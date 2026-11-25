import React from "react";
import { Composition } from "remotion";
import "@fontsource/inter/900.css";
import { Main } from "./Main";
import { NvidiaV4 } from "./videos/NvidiaV4";
import { Eel011, DUR011 } from "./videos/Eel011";
import { Bok012, DUR012 } from "./videos/Bok012";
// DURATION: set durationInFrames = ceil(voiceover_seconds * 30). Use --props or edit per video.
export const Root: React.FC = () => <>
  <Composition id="Main" component={Main} width={720} height={1280} fps={30} durationInFrames={60} />
  <Composition id="NvidiaV4" component={NvidiaV4} width={720} height={1280} fps={30} durationInFrames={661} />
  <Composition id="Eel011" component={Eel011} width={720} height={1280} fps={30} durationInFrames={DUR011} />
  <Composition id="Bok012" component={Bok012} width={720} height={1280} fps={30} durationInFrames={DUR012} />
</>;
