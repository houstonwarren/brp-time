// /** @jsx h */
// import { h } from "preact";
// import { PageProps } from "$fresh/server.ts";
// import { Button } from "../components/Button.tsx";
import SetReps from "../islands/SetReps.tsx";

export default function Home() {
  return (
    <div class="grid-cols-1">
      <h1 class="text-2xl font-bold text-center my-8 text-gray-800">Workout Timer</h1>
      <br />
      <SetReps />
    </div>
  );
}
