import { useState } from "preact/hooks";
import { formatTime } from "../utils/timeFormat.ts";

export default function SetReps() {
  const [reps, setReps] = useState(100);
  const timePerRep = 20 * 60 * 1000 / reps;

  return (
    <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <form action="/timer" method="GET" class="space-y-4">
        <div class="flex flex-col">
          <label for="reps" class="text-lg font-medium text-gray-700 mb-2">
            Number of Reps:
          </label>
          <input 
            type="number" 
            id="reps" 
            name="reps" 
            required 
            min="1"
            value={reps}
            onChange={(e) => setReps(parseInt(e.currentTarget.value))}
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <p class="text-gray-600 font-medium">
          Time per rep: {formatTime(timePerRep)} seconds
        </p>
        <button 
          type="submit"
          class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Start Workout
        </button>
      </form>
    </div>
  );
}