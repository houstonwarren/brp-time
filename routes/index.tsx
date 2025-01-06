import SetReps from "../islands/SetReps.tsx";

export default function Home() {
  return (
    <div class="grid-cols-1">
      <h1 class="text-2xl font-bold text-center my-8 text-gray-800">Burpee Timer</h1>
      <br />
      <SetReps />
    </div>
  );
}
