import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { formatTime } from "../utils/timeFormat.ts";
import BackButton from "./BackButton.tsx";
export default function TimerControl({ reps }: { reps: number }) {
  // Signals for reactive state management
  const currentRep = useSignal(0); // Tracks the current rep number
  const repLen = 20 * 60 * 1000 / reps; // Time per rep in milliseconds
  const timeRemaining = useSignal(repLen); // Time remaining for the current rep, calculated based on total time (20 minutes) divided by the number of reps
  const isPaused = useSignal(false); // Tracks if the timer is paused
  const isStarted = useSignal(false); // Tracks if the timer is started
  const increments = 100;
  const audioRef = useSignal<HTMLAudioElement | null>(null);
  const wakeLock = useSignal<WakeLockSentinel | null>(null);

  // Audio
  useEffect(() => {
    // Create audio instance when component mounts
    const audio = new Audio("/chime.mp3");
    // Enable playing on iOS without interrupting background audio
    audio.setAttribute('playsinline', '');
    audio.setAttribute('preload', 'auto');
    // Set to not interfere with background audio
    audio.volume = 1.0;
    audioRef.value = audio;
  
    // Initialize audio on first user interaction
    const initAudio = () => {
      // Set audio context options for iOS
      if (typeof globalThis.AudioContext !== 'undefined') {
        const audioContext = new AudioContext();
        audioContext.resume().catch(console.error);
      }
      
      audio.load();
      // Play and immediately pause to initialize, handle asynchronously
      audio.play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
        })
        .catch(err => console.warn('Audio init error:', err));
      
      document.removeEventListener('touchstart', initAudio);
      document.removeEventListener('click', initAudio);
    };
  
    document.addEventListener('touchstart', initAudio);
    document.addEventListener('click', initAudio);
  
    return () => {
      document.removeEventListener('touchstart', initAudio);
      document.removeEventListener('click', initAudio);
    };
  }, []);

  // Add wake lock request function
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLock.value = await navigator.wakeLock.request('screen');
      }
    } catch (err) {
      console.warn('Wake Lock error:', err);
    }
  };

  // Add wake lock release function
  const releaseWakeLock = async () => {
    if (wakeLock.value) {
      try {
        await wakeLock.value.release();
        wakeLock.value = null;
      } catch (err) {
        console.warn('Wake Lock release error:', err);
      }
    }
  };

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
          timeRemaining.value = repLen;
          currentRep.value += 1;
          timeRemaining.value = repLen;
        } else if (!isPaused.value && isStarted.value) {
          timeRemaining.value -= increments;
        }
      }
    }, increments);
    return () => clearInterval(timer);
  }, [isStarted.value]);

  const handleStart = async () => {
    isStarted.value = true;
    await requestWakeLock();
  };
  const handlePause = () => {isPaused.value = true;};
  const handleResume = () => {isPaused.value = false;};
  const handleStop = async () => {
    isStarted.value = false;
    isPaused.value = false;
    currentRep.value = 0; // Reset to the first rep
    timeRemaining.value = repLen; // Reset time for the first rep
    await releaseWakeLock();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-white rounded-lg">
        {/* Display the current rep and the total reps */}
        <p className="text-3xl font-semibold text-gray-700">
          Rep {currentRep.value} of {reps}
        </p>

        {/* Display the formatted time remaining */}
        <p className="text-9xl font-bold text-gray-800">
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
      <div class="flex justify-center fixed bottom-8 w-full">
        <BackButton />
      </div>
    </div>
  );
}
