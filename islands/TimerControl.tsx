import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { formatTime } from "../utils/timeFormat.ts";

export default function TimerControl({ reps }: { reps: number }) {
  // Signals for reactive state management
  const currentRep = useSignal(0); // Tracks the current rep number
  const repLen = 20 * 60 * 1000 / reps; // Time per rep in milliseconds
  const timeRemaining = useSignal(repLen); // Time remaining for the current rep, calculated based on total time (20 minutes) divided by the number of reps
  const isPaused = useSignal(false); // Tracks if the timer is paused
  const isStarted = useSignal(false); // Tracks if the timer is started
  const increments = 100;
  const audioRef = useSignal<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio instance when component mounts
    audioRef.value = new Audio("/chime.mp3");
  }, []);

  useEffect(() => {
    if (!isStarted.value) return;

    const timer = setInterval(() => {
      if (currentRep.value >= reps) {
        clearInterval(timer);
        isStarted.value = false;
        return;
      } else{
        if (timeRemaining.value <= 0) {
          audioRef.value?.play();
          currentRep.value += 1;
          timeRemaining.value = repLen;
        } else if (!isPaused.value && isStarted.value) {
          timeRemaining.value -= increments;
        }
      }
    }, increments);
    return () => clearInterval(timer);
  }, [isStarted.value]);

  const handleStart = () => {isStarted.value = true;};
  const handlePause = () => {isPaused.value = true;};
  const handleResume = () => {isPaused.value = false;};
  const handleStop = () => {
    isStarted.value = false;
    isPaused.value = false;
    currentRep.value = 0; // Reset to the first rep
    timeRemaining.value = repLen; // Reset time for the first rep
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-white rounded-lg">
        {/* Display the current rep and the total reps */}
        <p className="text-3xl font-semibold text-gray-700">
          Rep {currentRep.value} of {reps}
        </p>

        {/* Display the formatted time remaining */}
        <p className="text-8xl font-bold text-gray-800">
          {formatTime(timeRemaining.value)}
        </p>

        {/* Dynamic buttons based on the state */}
        <div className="flex space-x-4">
          {!isStarted.value ? (
            <button 
              onClick={handleStart}
              className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
            >
              Start
            </button>
          ) : isPaused.value ? (
            <button
              onClick={handleResume}
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Resume
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Pause
            </button>
          )}
          <button
            onClick={handleStop}
            className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}
