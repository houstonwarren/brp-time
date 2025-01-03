// /** @jsx h */
// import { h } from "preact";
// import { Handlers, PageProps } from "$fresh/server.ts";

import TimerControl from "../islands/TimerControl.tsx";

export default function TimerPage({ url }: { url: URL }) {
  const reps = Number(url.searchParams.get("reps") || 1);

  return (
    <div>
      <TimerControl reps={reps} />
    </div>
  );
}
