// Odd Truth Toons 012 "Bokkenrijders" (chain of confessions, Limburg 1743-1794). 720x1280 comp, rendered at scale 2 -> 1440x2560 master.
// 12 stages (transitions only between stages), 34 shots (hard cuts inside a stage), top-band pop texts, word captions.
import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing, Audio, staticFile, delayRender, continueRender, interpolate } from "remotion";
import "@fontsource/archivo-black/400.css";
import { Box, Cyl, Ball, CanvasPlane, Surface, BrickWall, INK } from "../style/toon";
import { Look } from "../style/puppet";
import { Person, Lights, Grade, Desk, seg, lerp, clamp, mix3, V3 } from "../style/kit";
import { Glow, Dust } from "../style/props";
import { Cam, Key, camAt, FaceGroup, hand } from "../style/extra";
import { Tree, OldLamp, Barrel, Cart, Crate, Rope, fitText } from "../style/oldtown";
import { Goat, Gallows, Church, Farmhouse, Ledger, Quill, NameCard, Moon, Hill, Torch, Lantern, Scroll, Post, Wheel, Horns } from "../style/limburg";
import { FPS, WALK, Ctx, Scene, soldier, folk, Sky, StreetSet } from "./eel/world";
import words from "../../public/words.json";
import SCRIPT from "../../public/script.json";

export const DUR012 = 1790; // 59.67 s

/* ---------- shots: hard cuts inside a stage ---------- */
type Shot = { t0: number; keys: Key[]; impacts?: [number, number][]; fovKick?: number[]; quake?: number };
const active = (t: number, shots: Shot[]) => { let s = shots[0]; for (const x of shots) if (t >= x.t0) s = x; return s; };
const Shots: React.FC<{ t: number; shots: Shot[] }> = ({ t, shots }) => { const s = active(t, shots); return <Cam t={t} keys={s.keys} impacts={s.impacts} fovKick={s.fovKick} quake={s.quake} />; };
const K = (t: number, pos: V3, look: V3, fov = 56): Key => ({ t, pos, look, fov });
const path = (t: number, t0: number, t1: number, a: V3, b: V3, e = Easing.inOut(Easing.sin)) => mix3(a, b, seg(t, t0, t1, e));
const yawOf = (a: V3, b: V3) => Math.atan2(-(b[2] - a[2]), b[0] - a[0]); // rotY that points a goat (local +x) from a to b

/* ---------- cast (1770s) ---------- */
const judge: Look = { skin: "#f6d6bd", body: "#14141c", outfit: "suit", tie: "#f4efe4", hair: "grey", hat: "#14141c", hatStyle: "dome", shoe: "#0b0d1a" };
const clerk: Look = { skin: "#f1c9a5", body: "#5a3a22", outfit: "blazer", shirt: "#f4efe4", hair: "grey", glasses: true, shoe: "#2a1a12" };
const prisoner: Look = { skin: "#e8c4a0", body: "#c9b89a", outfit: "shirt", hair: "short", hairColor: "#3b2a1a", shoe: "#3a2a1a" };
const prisoners: Look[] = [prisoner, { ...prisoner, body: "#b8a888", hairColor: "#1a1010" }, { ...prisoner, body: "#d4c4a4", hair: "bob", hairColor: "#6a3a1a" }, { ...prisoner, body: "#a89878", hair: "swept", hairColor: "#2a1a10" }];
const rider: Look = { skin: "#e0b48c", body: "#1e1e26", outfit: "hoodie", hair: "short", hairColor: "#111", hat: "#111", hatStyle: "cap", shoe: "#0b0d1a" };
const devil: Look = { skin: "#d8463a", body: "#1a0a12", outfit: "hoodie", hair: "none", shoe: "#0b0d1a" };
const kerck: Look = { skin: "#f6d6bd", body: "#4a2a5a", outfit: "blazer", shirt: "#f4efe4", hair: "swept", hairColor: "#4a2a1a", glasses: true, shoe: "#1b1b2a" };
const NAMES = ["JAN", "PIETER", "ANNA", "MATHIJS", "LAMBERT", "GEERTRUI", "HENDRIK", "MARIA", "SERVAAS", "JOZEF", "WILLEM", "CATHARINA"];
const FL = (t: number, sp = 13) => 0.75 * Math.sin(t * sp); // wing flap angle

/* =================== sets =================== */
const LHX = -7.6, RHX = 7.6, HZ = [8, 0, -8, -16, -24];
const VillageSet: React.FC<{ t: number; f: number; sky: [string, string]; lit?: number; doors?: Record<string, number>; church?: number; stars?: number }> = ({ t, f, sky, lit = 0.35, doors = {}, church = 0, stars = 110 }) => (<>
  <Lights warm="#b8c8ff" />
  <Sky t={t} top={sky[0]} bottom={sky[1]} stars={stars} skyline={false} />
  <Moon p={[-18, 30, -70]} r={4} />
  <Hill p={[-34, -8, -66]} s={[40, 16, 18]} color="#1e3a2e" /><Hill p={[28, -10, -74]} s={[46, 20, 18]} color="#22402f" /><Hill p={[0, -14, -96]} s={[80, 24, 18]} color="#1a3226" />
  <Surface p={[0, -0.01, -20]} s={[90, 110]} rot={[-Math.PI / 2, 0, 0]} kind="plain" a="#2f4a32" b="#2f4a32" />
  <Surface p={[0, 0, -14]} s={[8, 54]} rot={[-Math.PI / 2, 0, 0]} kind="tile" a="#6a6258" b="#5a5248" unit={0.8} />
  {HZ.map((z, i) => <React.Fragment key={i}>
    <Farmhouse p={[LHX, 0, z]} rotY={Math.PI / 2} open={doors["L" + i] ?? 0} lit={lit} seed={i + 1} />
    <Farmhouse p={[RHX, 0, z - 1]} rotY={-Math.PI / 2} open={doors["R" + i] ?? 0} lit={lit} seed={i + 11} />
  </React.Fragment>)}
  <Church p={[0, 0, -38]} open={church} lit={1} />
  {[4, -12, -26].map((z, i) => <React.Fragment key={"l" + i}><OldLamp p={[-4.4, 0, z]} on={1} /><OldLamp p={[4.4, 0, z - 4]} on={1} /></React.Fragment>)}
  <Tree p={[-11, 0, 3]} s={1.1} color="#2a5a32" /><Tree p={[11.5, 0, -12]} s={1.2} color="#2f6a3a" /><Tree p={[-10.5, 0, -30]} s={1.0} color="#2a5a32" /><Tree p={[10, 0, -32]} s={1.1} color="#2f6a3a" />
  <Barrel p={[-4.2, 0, 1.4]} /><Cart p={[4.0, 0, 5.2]} rotY={0.3} /><Crate p={[3.8, 0, -6.6]} s={0.8} />
  <Dust t={t} area={[6, 5, 6]} color="rgba(220,230,255,.8)" />
  {void f}
</>);

const BW = -4, BOARD: V3 = [0, 3.5, BW + 0.12], DESK: V3 = [-2.6, 0, 0.2], POST: V3 = [1.5, 0, -1.6], WHEEL: V3 = [3.7, 1.55, -2.8];
const PRIS: V3 = [1.5, 0, -1.15], JUDGE: V3 = [-0.4, 0, 0.6], CLERK: V3 = [-2.7, 0, -0.75];
const cardPos = (i: number): V3 => [-1.65 + (i % 4) * 1.1, 4.25 - Math.floor(i / 4) * 0.75, BW + 0.2];
const CellarSet: React.FC<{ t: number; cards?: number; cardT?: number[]; wheel?: number; loot?: boolean; ledgerLines?: string[]; ledgerK?: number }> = ({ t, cards = 0, cardT = [], wheel = 0, loot, ledgerLines = ["Interrogation", "Prisoner 1", "He swore to the devil", "They ride at night"], ledgerK = 1 }) => (<>
  <Lights warm="#ffb070" />
  <Surface p={[0, 0, 0]} s={[16, 14]} rot={[-Math.PI / 2, 0, 0]} kind="tile" a="#4a4038" b="#3e3630" unit={1.1} />
  <BrickWall p={[0, 4, BW]} s={[16, 8]} a="#5a5660" b="#4a4650" repeat={[10, 6]} />
  {[-1, 1].map((s) => <BrickWall key={s} p={[s * 6.5, 4, 2]} rot={[0, -s * Math.PI / 2, 0]} s={[14, 8]} a="#4e4a54" b="#423e48" repeat={[9, 6]} />)}
  <Box p={[0, 7.6, 1]} s={[13, 0.4, 10]} color="#2a2228" line={2} />
  {[-3.6, 3.6].map((x) => <Box key={x} p={[x, 7.0, 1]} s={[0.4, 0.8, 10]} color="#3a2e2a" line={2} />)}
  <Torch p={[-4.6, 3.4, BW + 0.3]} t={t} /><Torch p={[4.6, 3.4, BW + 0.3]} t={t + 1.3} /><Torch p={[-6.3, 3.4, 1.5]} t={t + 2.1} o={0.7} />
  {/* name board */}
  <CanvasPlane p={BOARD} s={[4.8, 2.6]} px={[480, 260]} frame="#3a2418" draw={(c, W, H) => { c.fillStyle = "#6a4a2e"; c.fillRect(0, 0, W, H); c.strokeStyle = "rgba(0,0,0,.25)"; c.lineWidth = 3; for (let y = 20; y < H; y += 26) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); } }} />
  {Array.from({ length: Math.min(cards, 12) }, (_, i) => {
    const t0 = cardT[i] ?? -9, k = seg(t, t0, t0 + 0.38, Easing.out(Easing.back(1.3))), from: V3 = [PRIS[0], 2.0, PRIS[2] + 0.6];
    const P = mix3(from, cardPos(i), k); if (t < t0) return null;
    return <NameCard key={i} p={P} rot={[0, 0, (1 - k) * (i % 2 ? 2.4 : -2.4) + ((i * 37) % 7 - 3) * 0.02]} s={lerp(0.5, 0.95, k)} name={NAMES[i]} />;
  })}
  {/* desk, ledger, candle */}
  <Desk p={DESK} w={2.8} d={1.6} top="#6a4226" leg="#4a2e1a" />
  <Ledger p={[DESK[0], 1.13, DESK[2] + 0.05]} lines={ledgerLines} k={ledgerK} red={ledgerLines.length - 1} />
  <Cyl p={[DESK[0] + 1.1, 1.35, DESK[2] - 0.5]} rt={0.06} h={0.45} color="#f4efe4" line={2} /><Ball p={[DESK[0] + 1.1, 1.64, DESK[2] - 0.5]} r={0.06} s={[1, 1.7, 1]} color="#ffc23a" ink={0} /><Glow p={[DESK[0] + 1.1, 1.66, DESK[2] - 0.45]} r={1.4} color="rgba(255,200,110,1)" o={0.6} />
  {loot ? <>{[-0.9, -0.55].map((dx, i) => <React.Fragment key={i}><Cyl p={[DESK[0] + dx, 1.45, DESK[2] + 0.45]} rt={0.05} rb={0.14} h={0.7} color="#ffc23a" line={2} /><Cyl p={[DESK[0] + dx, 1.82, DESK[2] + 0.45]} rt={0.1} rb={0.05} h={0.08} color="#ffc23a" line={2} /></React.Fragment>)}
    <Ball p={[DESK[0] + 0.3, 1.25, DESK[2] + 0.25]} r={0.13} s={[1, 0.85, 1]} color="#8a6a3a" /><Ball p={[DESK[0] + 0.6, 1.23, DESK[2] + 0.2]} r={0.11} s={[1, 0.85, 1]} color="#7a5a32" /><Cyl p={[DESK[0] + 0.95, 1.13, DESK[2] + 0.5]} rt={0.3} h={0.04} color="#d8dce6" line={2} />{Array.from({ length: 7 }, (_, i) => <Cyl key={"co" + i} p={[DESK[0] + 0.1 + (i % 4) * 0.18, 1.13 + Math.floor(i / 4) * 0.03, DESK[2] + 0.72 - (i % 3) * 0.08]} rt={0.07} h={0.025} color="#ffd23a" line={1} />)}</> : null}
  <Post p={POST} />
  <Wheel p={WHEEL} ang={wheel} r={1.3} rotY={-0.5} />
  <Barrel p={[-5.3, 0, -2.8]} s={0.9} /><Crate p={[5.3, 0, 0.6]} s={0.8} rotY={0.3} />
  <Dust t={t} area={[5, 4, 4]} color="rgba(255,210,160,.8)" />
</>);

const FieldSet: React.FC<{ t: number; sky: [string, string]; stars?: number; moon?: boolean; ground?: string; trees?: boolean }> = ({ t, sky, stars = 0, moon = true, ground = "#2f4a32", trees = true }) => (<>
  <Lights warm={stars > 0 ? "#b8c0ff" : "#ffd0a0"} />
  <Sky t={t} top={sky[0]} bottom={sky[1]} stars={stars} skyline={false} />
  {moon ? <Moon p={[-6, 22, -60]} r={5} /> : null}
  <Hill p={[-30, -6, -50]} s={[36, 14, 16]} color="#1e3a2e" /><Hill p={[26, -8, -56]} s={[40, 17, 16]} color="#22402f" /><Hill p={[0, -12, -80]} s={[80, 22, 18]} color="#1a3226" />
  <Surface p={[0, 0, -20]} s={[100, 100]} rot={[-Math.PI / 2, 0, 0]} kind="plain" a={ground} b={ground} />
  {trees ? [[-9, -6], [-12, -14], [-6, -18], [8, -8], [12, -16], [5, -22], [-14, -2], [14, -3], [0, -28], [-4, -30], [9, -30]].map(([x, z], i) => <Tree key={i} p={[x, 0, z]} s={1.1 + (i % 3) * 0.2} color={i % 2 ? "#2a5a32" : "#2f6a3a"} />) : null}
  <Dust t={t} area={[6, 4, 6]} color="rgba(230,230,255,.8)" />
</>);

/* =================== STAGE 1 the flying goat (0 – 1.75) =================== */
const S1: Shot[] = [{ t0: 0, keys: [K(0, [1.0, 1.7, 7.6], [-3.2, 7.4, -16], 58), K(1.75, [0.8, 1.6, 7.0], [-0.6, 4.6, -4], 62)] }];
const GA: V3 = [-4.6, 8.6, -13], GB: V3 = [0.7, 2.7, 5.6];
const Stage1 = ({ t, f }: Ctx) => {
  const P = path(t, 0, 1.6, GA, GB, Easing.in(Easing.quad));
  return (<>
    <Shots t={t} shots={S1} />
    <VillageSet t={t} f={f} sky={["#0e1236", "#3a2a6e"]} />
    <Goat p={P} rotY={yawOf(GA, GB)} t={t} gallop={1} flap={FL(t, 15)} s={1.3} />
    <Person p={[P[0], P[1] + 1.25, P[2]]} h={2.4} look={rider} f={f} shadow={false} pose={{ mood: "grin", arms: "up", armK: 0.6, air: 1 }} />
    <Glow p={P} r={3} color="rgba(200,210,255,1)" o={0.25} />
  </>);
};

/* =================== STAGE 2 the court writes it down (1.75 – 3.20) =================== */
const LG: V3 = [DESK[0], 1.13, DESK[2] + 0.05];
const S2: Shot[] = [{ t0: 1.75, keys: [K(1.75, [LG[0] + 0.66, 2.75, LG[2] + 1.95], [LG[0] + 0.62, 1.13, LG[2] - 0.02], 46), K(3.2, [LG[0] + 0.64, 2.5, LG[2] + 1.6], [LG[0] + 0.62, 1.13, LG[2] - 0.02], 42)], fovKick: [2.29] }];
const L2 = ["Interrogation", "Prisoner 1", "He swore to the devil", "THEY FLY ON GOATS"];
const Stage2 = ({ t }: Ctx) => {
  const k = seg(t, 1.85, 3.0, Easing.linear), u = 0.11 + 1.0 * k;
  return (<>
    <Shots t={t} shots={S2} />
    <CellarSet t={t} ledgerLines={L2} ledgerK={k} />
    <Quill p={[LG[0] + u, LG[1] + 0.02 + Math.abs(Math.sin(t * 22)) * 0.02, LG[2] + 0.16]} rot={[0.35, 0, -0.55]} s={1.1} />
  </>);
};

/* =================== STAGE 3 the village nobody saw it from (3.20 – 11.81) =================== */
const RA: V3 = [-1.4, 0, -22], RB: V3 = [0.2, 0, -3.5];
const S3: Shot[] = [
  { t0: 3.2, keys: [K(3.2, [0.4, 1.3, 7.8], [0, 3.0, 0], 58), K(4.6, [0.3, 1.25, 7.2], [0, 4.6, -2], 60), K(5.77, [0.2, 1.15, 6.8], [-1, 9.5, -8], 62)] },
  { t0: 5.77, keys: [K(5.77, [2.6, 6.5, 18], [0, 2.4, -12], 56), K(8.45, [1.4, 15, 23], [0, 0.5, -16], 60)] },
  { t0: 8.45, keys: [K(8.45, [1.6, 2.4, 3.8], [-5.0, 1.6, -0.2], 52), K(10.0, [1.0, 2.3, 3.2], [-5.0, 1.6, -0.2], 46)], impacts: [[9.42, 0.03]] },
  { t0: 10.0, keys: [K(10.0, [0.6, 0.85, 6.0], [0, 2.2, -8], 54), K(11.81, [0.4, 0.8, 4.6], [0, 2.4, -4], 58)], quake: 0.006 },
];
const Stage3 = ({ t, f }: Ctx) => {
  const door = t < 8.5 ? 1 : 1 - seg(t, 9.25, 9.42, Easing.in(Easing.quad));
  const lit = t > 9.5 ? 0.08 : 0.35;
  return (<>
    <Shots t={t} shots={S3} />
    <VillageSet t={t} f={f} sky={["#0e1236", "#3a2a6e"]} lit={lit} doors={{ L1: door }} />
    {/* villagers look up at an empty sky */}
    {t < 8.45 ? [[-2.2, 0.2], [-0.8, -0.8], [0.6, 0.0], [1.9, -1.0], [-1.6, -2.2], [1.0, -2.6]].map(([x, z], i) => <Person key={"v" + i} p={[x, 0, z]} h={2.9} look={folk[i % 8]} f={f + i * 7}
      pose={{ mood: t > 3.36 ? (i % 2 ? "worry" : "deadpan") : "smile", arms: t > 3.4 && i % 2 ? "shrug" : "down", armK: seg(t, 3.4 + i * 0.05, 3.7 + i * 0.05), lookX: x > 0 ? -0.4 : 0.4, squash: 0.01 * Math.sin(f * 0.2 + i) }} />) : null}
    {/* two villagers run inside before the door slams */}
    {t > 8.45 && t < 9.4 ? [0, 1].map((i) => { const k = seg(t, 8.5 + i * 0.25, 9.2 + i * 0.1, Easing.in(Easing.quad)); const P: V3 = [lerp(0.6 + i * 1.0, -5.1, k), 0, lerp(-1.4 - i * 1.0, 0.2 * i, k)];
      return k < 0.98 ? <Person key={"run" + i} p={P} h={2.8} look={folk[(i + 3) % 8]} f={f + i * 5} pose={{ mood: "shock", walk: k * 14, speed: 1, arms: "head", armK: 1, lookX: -1, nerv: 0.6 }} /> : null; }) : null}
    {t > 8.45 && t < 10 ? <Glow p={[-4.9, 1.2, 0]} r={1.6} color="rgba(255,210,120,1)" o={0.5 * door} /> : null}
    {/* goat riders gallop down the street */}
    {t > 10 ? [-1.6, 0, 1.6].map((dx, i) => { const P = path(t, 10.0 + i * 0.12, 11.9, [RA[0] + dx, 0, RA[2] - i * 2.5], [RB[0] + dx * 1.2, 0, RB[2] - i * 2.2], Easing.linear);
      return <React.Fragment key={"r" + i}><Goat p={P} rotY={-Math.PI / 2 + 0.05 * dx} t={t + i} gallop={1} s={1.35} eye />
        <Person p={[P[0], 1.55 + Math.abs(Math.sin((t + i) * 14)) * 0.08, P[2] + 0.1]} h={2.4} look={rider} f={f + i * 4} shadow={false} pose={{ mood: "grin", arms: "hold", armK: 1, air: 1 }} /></React.Fragment>; }) : null}
  </>);
};

/* =================== STAGE 4 robbery and the devil's goats (11.81 – 16.20) =================== */
const RD: V3 = [RHX - 2.62, 0, -9]; // right house 2 door (faces -x)
const S4: Shot[] = [
  { t0: 11.81, keys: [K(11.81, [1.0, 2.5, -3.6], [5.2, 1.7, -9], 50), K(12.87, [1.6, 2.4, -4.6], [5.2, 1.7, -9], 46)], impacts: [[12.17, 0.05]], fovKick: [12.17] },
  { t0: 12.87, keys: [K(12.87, [2.2, 2.6, -22.5], [0, 1.9, -31.5], 52), K(13.94, [1.7, 2.5, -24.0], [0, 1.9, -31.5], 48)], impacts: [[13.0, 0.04]] },
  { t0: 13.94, keys: [K(13.94, [1.8, 2.5, -14.2], [-0.3, 2.2, -20], 52), K(15.1, [1.6, 2.8, -14.8], [-0.1, 2.9, -20], 54), K(16.2, [1.4, 3.2, -15.4], [0.4, 5.2, -20], 58)] },
];
const Stage4 = ({ t, f }: Ctx) => {
  const farm = seg(t, 12.17, 12.3, Easing.out(Easing.back(2))), ch = seg(t, 13.0, 13.15, Easing.out(Easing.back(2)));
  const rise = seg(t, 15.09, 16.3, Easing.in(Easing.quad)), GP: V3 = [0.9, rise * 5.5, -19.6 - rise * 1.5];
  return (<>
    <Shots t={t} shots={S4} />
    <VillageSet t={t} f={f} sky={["#0a0e2a", "#2a1a4e"]} lit={0.1} doors={{ R2: farm }} church={ch} />
    {/* gang at the farm door */}
    {t < 12.87 ? [[RD[0] - 1.2, RD[2] + 0.6], [RD[0] - 1.6, RD[2] - 0.8], [RD[0] - 2.4, RD[2] + 0.1]].map(([x, z], i) => { const lunge = i === 0 ? seg(t, 11.95, 12.17, Easing.in(Easing.quad)) * (1 - seg(t, 12.2, 12.5)) : 0;
      return <Person key={"g" + i} p={[x + lunge * 0.7, 0, z]} h={2.9} look={rider} f={f + i * 6} pose={{ mood: "angry", arms: i === 0 ? "up" : "hold", armK: 1, tilt: i === 0 ? -0.2 * lunge : 0, lookX: 1, flip: false, squash: i === 0 ? 0.1 * lunge : 0 }} />; }) : null}
    {t < 12.87 ? <Glow p={[RD[0] + 0.2, 1.3, RD[2]]} r={1.4} color="rgba(255,240,220,1)" o={0.8 * (t > 12.17 && t < 12.4 ? 1 : 0)} /> : null}
    {/* gang at the church door, one carries a candlestick out */}
    {t > 12.87 && t < 13.94 ? [[-1.2, -30.2], [1.1, -30.4], [0.2, -29.2]].map(([x, z], i) => { const out = i === 2 ? seg(t, 13.35, 13.9) : 0; const P: V3 = [x, 0, z + out * 2.2];
      return <React.Fragment key={"c" + i}><Person p={P} h={2.9} look={rider} f={f + i * 6} pose={{ mood: i === 2 ? "grin" : "angry", arms: i === 2 ? undefined : "up", armK: 1, armR: i === 2 ? [0.2, 0.62] : undefined, armRK: 1, walk: out * 10, speed: out > 0 && out < 1 ? 1 : 0, lookX: 0 }} />
        {i === 2 ? <FaceGroup p={P}><Cyl p={hand(2.9, [0.2, 0.62], 0, false, 0.12)} rt={0.05} rb={0.12} h={0.6} color="#ffc23a" line={2} /></FaceGroup> : null}</React.Fragment>; }) : null}
    {/* whispers, then the devil hands out a goat that flies */}
    {t > 13.94 ? <>
      {t < 14.45 ? [[-1.4, -16.5], [-0.6, -16.9]].map(([x, z], i) => <Person key={"w" + i} p={[x, 0, z]} h={2.8} look={folk[(i + 5) % 8]} f={f + i * 9} pose={{ mood: "worry", hunch: 0.6, arms: i ? "chest" : "head", armK: 0.5, lookX: i ? -1 : 1, nerv: 0.3 }} />) : null}
      {t > 14.38 ? <><Person p={[-1.2, 0, -20.4]} h={3.3} look={devil} f={f} pose={{ mood: "grin", arms: t < 15.0 ? "point" : "up", armK: seg(t, 14.4, 14.6), squash: 0.03 * Math.sin(t * 6), lookX: 1 }} />
        <FaceGroup p={[-1.2, 0, -20.4]}><Horns h={3.3} /></FaceGroup>
        <Glow p={[-1.2, 1.8, -20]} r={4} color="rgba(255,60,40,1)" o={0.45 * seg(t, 14.38, 14.6)} /></> : null}
      <Goat p={GP} rotY={-0.4} t={t} gallop={rise > 0 ? 1 : 0} flap={t > 14.82 ? FL(t, 14) * seg(t, 14.82, 15.0) : 0.05} s={1.3} />
      <Person p={[GP[0], GP[1] + 1.25, GP[2]]} h={2.4} look={rider} f={f} shadow={false} pose={{ mood: "laugh", arms: "up", armK: 0.6, air: rise > 0 ? 1 : 0 }} />
    </> : null}
  </>);
};

/* =================== STAGE 5 the judges go hunting (16.20 – 18.22) =================== */
const S5: Shot[] = [
  { t0: 16.2, keys: [K(16.2, [1.6, 0.9, 6.5], [0, 2.6, -6], 56), K(17.3, [1.3, 0.95, 5.6], [0, 2.7, -5], 56)] },
  { t0: 17.3, keys: [K(17.3, [0.2, 2.25, 1.5], [-0.1, 1.95, -2.6], 40), K(18.22, [0.15, 2.2, 1.15], [-0.1, 1.95, -2.6], 36)] },
];
const Stage5 = ({ t, f }: Ctx) => {
  const z0 = lerp(-10, -3.0, seg(t, 16.2, 18.3, Easing.linear));
  const march: [V3, Look, number][] = [[[-0.1, 0, z0], judge, 3.3], [[-1.5, 0, z0 - 1.4], judge, 3.2], [[1.3, 0, z0 - 1.6], judge, 3.2], [[-2.4, 0, z0 - 3.2], soldier, 3.3], [[2.2, 0, z0 - 3.4], soldier, 3.3], [[0, 0, z0 - 4.6], soldier, 3.3]];
  return (<>
    <Shots t={t} shots={S5} />
    <VillageSet t={t} f={f} sky={["#0e1236", "#3a2a6e"]} lit={0.05} />
    {march.map(([P, L, h], i) => <React.Fragment key={i}><Person p={P} h={h} look={L} f={f + i * 4} pose={{ mood: "angry", walk: (P[2] + 10) * WALK, speed: 0.8, armR: i < 3 ? [0.24, 0.55] : undefined, armRK: 1, lookX: Math.sin(t * 2 + i) * 0.6 }} />
      {i < 3 ? <FaceGroup p={P}><Lantern p={hand(h, [0.24, 0.55], 0, false, 0.12)} on={1} /></FaceGroup> : null}</React.Fragment>)}
  </>);
};

/* =================== STAGE 6 the torture room, the chain of names (18.22 – 26.66) =================== */
const CARD3 = [22.86, 23.0, 23.14], CARD9 = Array.from({ length: 9 }, (_, i) => 25.67 + i * 0.08);
const S6: Shot[] = [
  { t0: 18.22, keys: [K(18.22, [0, 3.1, 9.4], [0.2, 2.2, -1], 56), K(19.55, [0.3, 2.9, 7.4], [0.5, 2.2, -1], 54)] },
  { t0: 19.55, keys: [K(19.55, [2.5, 2.4, 3.4], [1.5, 1.85, -1.15], 44), K(21.14, [2.2, 2.35, 2.8], [1.5, 1.85, -1.15], 40)], impacts: [[19.1, 0.02], [20.2, 0.02]] },
  { t0: 21.14, keys: [K(21.14, [-0.3, 2.1, 4.0], [-0.4, 2.3, 0.6], 40), K(22.08, [-0.35, 2.05, 3.5], [-0.4, 2.3, 0.6], 36)], fovKick: [21.31] },
  { t0: 22.08, keys: [K(22.08, [0.9, 3.3, 6.6], [0.6, 3.35, -2.6], 56), K(23.82, [0.6, 3.35, 5.9], [0.4, 3.45, -3], 54)] },
  { t0: 23.82, keys: [K(23.82, [-3.4, 2.5, 4.6], [0.6, 2.0, -1.2], 50), K(25.67, [-2.5, 2.5, 3.6], [0.9, 2.0, -1.2], 47)], impacts: [[24.62, 0.02]] },
  { t0: 25.67, keys: [K(25.67, [0.3, 3.45, 1.7], [0, 3.5, BW], 50), K(26.66, [0.2, 3.45, 1.05], [0, 3.5, BW], 46)] },
];
const Stage6 = ({ t, f }: Ctx) => {
  const wheel = t * 0.6 + (t > 19.09 ? seg(t, 19.09, 19.6) * 1.2 : 0) + (t > 24.62 ? seg(t, 24.62, 25.2) * 1.2 : 0);
  const pain = (t > 19.1 && t < 19.8) || (t > 24.6 && t < 25.3);
  const extra = t > 23.82, nCards = t < 22.86 ? 0 : t < 25.67 ? 3 : 12;
  return (<>
    <Shots t={t} shots={S6} />
    <CellarSet t={t} cards={nCards} cardT={[...CARD3, ...CARD9]} wheel={wheel} />
    <Person p={PRIS} h={3.0} look={prisoner} f={f} pose={{ mood: t > 22.08 && t < 23.82 ? "gulp" : pain ? "shock" : "worry", nerv: pain ? 1 : 0.5, sweat: 1, squash: pain ? -0.06 * Math.abs(Math.sin(t * 20)) : 0, arms: t > 22.6 && t < 23.6 ? "point" : "down", armK: 1, lookX: -0.6 }} />
    <Person p={JUDGE} h={3.3} look={judge} f={f} pose={{ mood: t > 21.0 && t < 22.2 ? "angry" : "deadpan", tilt: t > 21.14 && t < 22.08 ? -0.08 : 0, arms: t > 21.14 && t < 22.08 ? "point" : "down", armK: seg(t, 21.14, 21.3), lookX: 0.6 }} />
    <Person p={CLERK} h={3.0} look={clerk} f={f + 9} pose={{ mood: "deadpan", hunch: 0.4, armR: [0.2, 0.36], armRK: 1, lookX: 0.4 }} />
    {extra ? [[-0.9, -2.3], [0.1, -2.7], [-1.9, -2.6]].map(([x, z], i) => { const k = seg(t, 23.9 + i * 0.2, 24.6 + i * 0.2), P: V3 = [lerp(-5.6, x, k), 0, z];
      return <Person key={"p" + i} p={P} h={2.9} look={prisoners[i + 1]} f={f + i * 7} pose={{ mood: t > 24.62 ? "shock" : "worry", walk: k * 12, speed: k < 1 ? 0.8 : 0, nerv: t > 24.62 ? 1 : 0.4, sweat: 1, hunch: 0.3, arms: t > 25.43 ? "point" : "down", armK: 1, lookX: 1 }} />; }) : null}
    {extra ? [[-4.2, -1.4], [-3.4, -0.4]].map(([x, z], i) => <Person key={"s" + i} p={[lerp(-6.4, x, seg(t, 23.82, 24.5)), 0, z]} h={3.3} look={soldier} f={f + i * 3} pose={{ mood: "angry", lookX: 1 }} />) : null}
  </>);
};

/* =================== STAGE 7 Herzogenrath, the surgeon (26.66 – 33.90) =================== */
const KP: V3 = [1.6, 0, 2.2];
const S7: Shot[] = [
  { t0: 26.66, keys: [K(26.66, [2.6, 2.3, 8.6], [1.4, 2.1, 1.6], 50), K(28.74, [2.2, 2.25, 6.8], [1.4, 2.0, 1.6], 44)] },
  { t0: 28.74, keys: [K(28.74, [-1.6, 3.2, 14], [-0.6, 2.6, -5], 56), K(30.55, [-0.6, 3.0, 11.6], [0.6, 2.5, -2], 52)] },
  { t0: 30.55, keys: [K(30.55, [2.2, 1.2, -9.6], [0.3, 4.0, -22], 56), K(33.9, [1.3, 1.4, -12.6], [0.3, 4.2, -22], 50)], fovKick: [33.25] },
];
const Stage7 = ({ t, f }: Ctx) => {
  const grab = seg(t, 29.4, 30.2, Easing.inOut(Easing.sin));
  const sway = Math.sin(t * 1.6) * (t > 33.25 ? 1 : 0.3);
  return (<>
    <Shots t={t} shots={S7} />
    <StreetSet t={t} f={f} sky={["#3a3a8a", "#ff9a6a"]} lit={0.25} lamps={0.5} />
    {/* castle at the end of the street */}
    <group position={[0, 0, -38]}><Box p={[0, 4.5, 0]} s={[14, 9, 4]} color="#8a8478" />{[-7, 7].map((x) => <React.Fragment key={x}><Cyl p={[x, 6, 0]} rt={2} h={12} color="#9a9488" line={3} /><Cyl p={[x, 13.2, 0]} rt={0} rb={2.4} h={2.4} color="#4a3a5a" line={3} /></React.Fragment>)}
      {Array.from({ length: 7 }, (_, i) => <Box key={i} p={[-6 + i * 2, 9.4, 1.6]} s={[0.9, 0.8, 0.8]} color="#8a8478" line={2} />)}<Box p={[0, 2, 2.05]} s={[2.4, 4, 0.1]} color="#2a1a14" line={2} /></group>
    {/* town sign + surgeon's sign */}
    <Box p={[-1.4, 1.4, 6.0]} s={[0.18, 2.8, 0.18]} color="#3a2a1a" line={2} />
    <CanvasPlane p={[-1.4, 2.9, 6.15]} s={[2.4, 0.7]} px={[480, 140]} frame="#3a2a1a" draw={(c, W, H) => { c.fillStyle = "#f3e6c4"; c.fillRect(0, 0, W, H); c.fillStyle = "#1a1a1a"; c.textAlign = "center"; c.textBaseline = "middle"; fitText(c, "HERZOGENRATH", W / 2, H / 2 + 4, W - 40, 72); }} />
    <Box p={[3.4, 4.0, 2.2]} s={[1.6, 0.1, 0.1]} color="#1f2a30" line={2} />
    <CanvasPlane p={[3.1, 3.5, 2.25]} s={[1.5, 0.75]} px={[300, 150]} frame="#3a2a1a" draw={(c, W, H) => { c.fillStyle = "#2a4a6a"; c.fillRect(0, 0, W, H); c.fillStyle = "#f4efe4"; c.textAlign = "center"; c.textBaseline = "middle"; fitText(c, "CHIRURGIJN", W / 2, H / 2 + 4, W - 30, 46); }} />
    {/* Kerckhoffs with his bag, soldiers take him */}
    {t < 30.6 ? <><Person p={[KP[0] - grab * 0.3, 0, KP[2]]} h={3.2} look={kerck} f={f} pose={{ mood: t > 29.6 ? "shock" : "smile", armR: t < 29.6 ? [0.22, 0.3] : undefined, armRK: 1, arms: t > 29.6 ? "up" : "down", armK: seg(t, 29.6, 29.8), nerv: t > 29.6 ? 0.6 : 0, sweat: t > 29.8 ? 1 : 0, lookX: t > 29.5 ? -0.8 : 0.3 }} />
      {t < 29.6 ? <FaceGroup p={KP}><Box p={hand(3.2, [0.22, 0.3], 0, false, 0.14)} s={[0.55, 0.38, 0.26]} color="#3a2418" line={2} /></FaceGroup> : null}
      {[-1, 1].map((s) => <Person key={s} p={[lerp(KP[0] + s * 4.5, KP[0] + s * 1.15, grab), 0, KP[2] - 0.4]} h={3.3} look={soldier} f={f + s * 5} pose={{ mood: "angry", walk: grab * 10, speed: grab < 1 && grab > 0 ? 0.9 : 0, arms: grab > 0.8 ? "point" : "down", armK: 1, flip: s > 0, lookX: -s }} />)}</> : null}
    {/* gallows in the castle square, dawn */}
    <Gallows p={[-0.8, 0, -22]} s={1.15} sway={sway} />
    <group position={[2.6, 0, -21.5]}><Box p={[0, 1.3, 0]} s={[0.16, 2.6, 0.16]} color="#3a2a1a" line={2} />
      <CanvasPlane p={[0, 2.8, 0.12]} s={[2.2, 1.1]} px={[440, 220]} frame="#3a2a1a" draw={(c, W, H) => { c.fillStyle = "#f3e6c4"; c.fillRect(0, 0, W, H); c.textAlign = "center"; c.fillStyle = "#7a1a22"; fitText(c, "11 MAY", W / 2, 96, W - 40, 86); c.fillStyle = "#1a1a1a"; fitText(c, "1772", W / 2, 190, W - 40, 82); }} /></group>
    {t > 30.55 ? [[-4.6, -17], [-3.4, -16.2], [3.8, -16.6], [5.0, -17.6], [-5.6, -18.6], [6.0, -19]].map(([x, z], i) => <Person key={"cr" + i} p={[x, 0, z]} h={3.0} look={folk[i % 8]} f={f + i * 7} pose={{ mood: t > 33.25 ? "shock" : "worry", hunch: 0.4, arms: t > 33.25 && i % 2 ? "head" : "chest", armK: 1, lookX: x > 0 ? -1 : 1 }} />) : null}
  </>);
};

/* =================== STAGE 8 the dream every prisoner told (33.90 – 39.33) =================== */
const bubble = (c: CanvasRenderingContext2D, W: number, H: number) => {
  c.clearRect(0, 0, W, H); c.fillStyle = "#fff"; c.strokeStyle = INK; c.lineWidth = 8; c.beginPath(); c.ellipse(W / 2, H * 0.44, W * 0.45, H * 0.38, 0, 0, 7); c.fill(); c.stroke();
  c.beginPath(); c.moveTo(W * 0.42, H * 0.78); c.lineTo(W * 0.36, H * 0.98); c.lineTo(W * 0.56, H * 0.8); c.fill(); c.stroke();
  c.fillStyle = "#ffe9a0"; c.beginPath(); c.arc(W * 0.7, H * 0.28, 22, 0, 7); c.fill(); // moon
  c.fillStyle = INK; c.beginPath(); c.ellipse(W * 0.46, H * 0.5, 58, 26, 0, 0, 7); c.fill(); c.beginPath(); c.arc(W * 0.66, H * 0.4, 20, 0, 7); c.fill(); // goat body + head
  c.lineWidth = 7; c.beginPath(); c.moveTo(W * 0.68, H * 0.32); c.lineTo(W * 0.74, H * 0.2); c.stroke(); // horn
  c.fillStyle = "#9a8adf"; c.beginPath(); c.moveTo(W * 0.42, H * 0.44); c.quadraticCurveTo(W * 0.3, H * 0.12, W * 0.18, H * 0.2); c.quadraticCurveTo(W * 0.26, H * 0.36, W * 0.42, H * 0.48); c.fill(); // wing
  for (const x of [0.36, 0.42, 0.52, 0.58]) { c.beginPath(); c.moveTo(W * x, H * 0.56); c.lineTo(W * x, H * 0.66); c.stroke(); }
};
const DV: V3 = [5.4, 0, -0.6], PO: V3 = [3.7, 0, 0.2], GM: V3 = [-5.2, 0, -6];
const FA: V3 = [-9, 4.2, -3], FB: V3 = [7, 7.4, -11];
const S8: Shot[] = [
  { t0: 33.9, keys: [K(33.9, [0, 2.6, 9.2], [0, 2.4, 0], 52), K(35.9, [0, 2.55, 7.4], [0, 2.5, 0], 50)] },
  { t0: 35.9, keys: [K(35.9, [3.6, 2.2, 3.9], [4.6, 1.9, -0.2], 42), K(36.98, [3.8, 2.15, 3.3], [4.6, 1.9, -0.2], 38)] },
  { t0: 36.98, keys: [K(36.98, [-3.4, 0.8, 1.6], [-5.6, 2.6, -7], 50), K(37.95, [-3.6, 0.85, 0.9], [-5.4, 2.4, -7], 46)] },
  { t0: 37.95, keys: [K(37.95, [-7.5, 5.6, 4.5], [-7.6, 5.8, -4], 58), K(39.33, [4.6, 7.0, 0.6], [6.4, 7.0, -10], 58)] },
];
const Stage8 = ({ t, f }: Ctx) => {
  const fly = path(t, 37.95, 39.4, FA, FB, Easing.linear);
  return (<>
    <Shots t={t} shots={S8} />
    <FieldSet t={t} sky={["#120a3a", "#4a2a7a"]} stars={120} />
    {t < 35.9 ? [-2.2, 0, 2.2].map((x, i) => { const pop = seg(t, 34.12 + i * 0.25, 34.4 + i * 0.25, Easing.out(Easing.back(2)));
      return <React.Fragment key={i}><Person p={[x, 0, 0]} h={2.9} look={prisoners[i]} f={f + i * 6} pose={{ mood: "deadpan", nerv: 0.3, sweat: 1, lookX: 0, squash: 0.01 * Math.sin(f * 0.2 + i) }} />
        {pop > 0 ? <CanvasPlane p={[x + 0.5, 3.35, 0.1]} s={[1.5 * pop, 1.2 * pop]} px={[300, 240]} face draw={bubble} /> : null}</React.Fragment>; }) : null}
    {t > 35.9 && t < 36.98 ? <><Person p={DV} h={3.3} look={devil} f={f} pose={{ mood: "grin", armL: [-0.18, 0.42], armLK: 1, lookX: -1 }} /><FaceGroup p={DV}><Horns h={3.3} /></FaceGroup>
      <Person p={PO} h={2.9} look={prisoner} f={f} pose={{ mood: "gulp", armR: [0.24, 0.4], armRK: seg(t, 36.0, 36.3), nerv: 0.5, lookX: 1 }} />
      <Ledger p={[4.6, 1.3, -0.15]} rot={[-0.9, -0.45, 0]} s={0.55} title="OATH" lines={["I renounce God", "I serve the devil", "I ride the goat"]} red={1} />
      <Glow p={[5.2, 1.6, -0.4]} r={3} color="rgba(255,60,40,1)" o={0.4} /></> : null}
    {t > 36.98 && t < 37.95 ? <><Hill p={[-5.6, -1.6, -7]} s={[5, 2.4, 4]} color="#24402e" /><Goat p={[GM[0], 0.6, GM[2]]} rotY={-0.4} t={t} s={1.3} chew={1} /><Moon p={[-6.4, 7.6, -24]} r={2.6} /></> : null}
    {t > 37.95 ? <><Goat p={fly} rotY={yawOf(FA, FB)} t={t} gallop={1} flap={FL(t, 13)} s={1.4} /><Person p={[fly[0], fly[1] + 1.35, fly[2]]} h={2.5} look={rider} f={f} shadow={false} pose={{ mood: "laugh", arms: "up", armK: 0.7, air: 1 }} /></> : null}
  </>);
};

/* =================== STAGE 9 the judges' script (39.33 – 46.90) =================== */
const SCR: V3 = [-0.35, 1.0, 1.05];
const S9: Shot[] = [
  { t0: 39.33, keys: [K(39.33, [-0.6, 2.5, 6.6], [-0.4, 1.8, 0.6], 52), K(41.07, [-0.5, 2.35, 4.8], [-0.4, 1.75, 0.6], 46)] },
  { t0: 41.07, keys: [K(41.07, [-0.3, 1.05, 2.9], [SCR[0], SCR[1], SCR[2]], 38), K(42.39, [-0.32, 1.03, 2.55], [SCR[0], SCR[1], SCR[2]], 35)] },
  { t0: 42.39, keys: [K(42.39, [3.4, 2.4, 3.2], [2.0, 1.9, -1.2], 50), K(43.88, [3.0, 2.3, 2.6], [1.8, 1.9, -1.2], 45)], impacts: [[42.56, 0.03]] },
  { t0: 43.88, keys: [K(43.88, [-2.2, 2.7, 3.1], [-2.4, 1.3, 0.5], 44), K(45.08, [-2.3, 2.55, 2.7], [-2.4, 1.3, 0.5], 40)] },
  { t0: 45.08, keys: [K(45.08, [0.5, 2.4, 4.8], [0.0, 1.9, 0.8], 50), K(46.9, [0.35, 2.3, 4.2], [0.0, 1.95, 0.8], 46)] },
];
const SL = ["1. Oath to the devil", "2. A goat at midnight", "3. A ride above trees", "4. Name your friends"];
const Stage9 = ({ t, f }: Ctx) => {
  const hi = t < 41.07 ? -1 : Math.min(3, Math.floor((t - 41.07) / 0.33));
  const wheel = t * 0.6 + seg(t, 42.5, 43.2) * 1.6, pain = t > 42.5 && t < 43.7;
  const pup: V3 = [0.45, 1.45 + Math.sin(t * 3) * 0.12, 1.3];
  return (<>
    <Shots t={t} shots={S9} />
    <CellarSet t={t} cards={12} cardT={Array(12).fill(0)} wheel={wheel} loot={t > 43.5} ledgerLines={["Prisoner 7", "Oath to the devil", "Goat at midnight", "RIDE ABOVE THE TREES"]} ledgerK={t < 42.4 ? 0 : seg(t, 42.6, 43.8, Easing.linear)} />
    <Person p={PRIS} h={3.0} look={prisoners[2]} f={f} pose={{ mood: pain ? "shock" : "worry", nerv: pain ? 1 : 0.5, sweat: 1, squash: pain ? -0.06 * Math.abs(Math.sin(t * 20)) : 0, lookX: -0.6 }} />
    <Person p={JUDGE} h={3.3} look={judge} f={f} pose={{ mood: t > 45.08 ? "grin" : "deadpan", armR: t < 43.88 ? [0.12, 0.36] : t > 45.08 ? [0.24, 0.62] : undefined, armL: t < 43.88 ? [-0.12, 0.36] : undefined, armRK: 1, armLK: 1, lookX: 0.3 }} />
    {t < 43.88 ? <Scroll p={SCR} rot={[-0.12, 0, 0]} s={0.62} title="CONFESSION" lines={SL} hi={hi} /> : null}
    {t < 43.88 || t > 45.08 ? <Person p={CLERK} h={3.0} look={clerk} f={f + 9} pose={{ mood: "deadpan", hunch: 0.4, armR: [0.2, 0.36], armRK: 1, lookX: 0.4 }} /> : null}
    {/* the only flying goat: a puppet on strings in the judge's hand */}
    {t > 45.08 ? <><Rope pts={[[0.55, 2.45, 0.95], [pup[0], pup[1] + 0.85, pup[2]]]} r={0.012} color="#e8e8e8" /><Rope pts={[[0.65, 2.45, 0.95], [pup[0] + 0.4, pup[1] + 0.8, pup[2]]]} r={0.012} color="#e8e8e8" />
      <Goat p={pup} rotY={0.3} t={t} flap={FL(t, 6)} s={0.55} gallop={0.4} /></> : null}
  </>);
};

/* =================== STAGE 10 the gallows field, the count (46.90 – 53.33) =================== */
const COUNT = (t: number) => t < 48.64 ? 0 : Math.round(1200 * seg(t, 48.64, 50.2, Easing.out(Easing.quad)));
const EXEC = (t: number) => t < 50.92 ? 0 : Math.round(425 * seg(t, 50.92, 52.2, Easing.out(Easing.quad)));
const S10: Shot[] = [
  { t0: 46.9, keys: [K(46.9, [0, 3.5, 17], [0, 3.2, -10], 56), K(48.43, [2.4, 8.0, 15], [0, 1.6, -12], 60)] },
  { t0: 48.43, keys: [K(48.43, [-3.4, 2.6, 8.6], [1.2, 2.4, -6], 52), K(50.54, [-2.4, 2.6, 7.0], [1.6, 2.4, -6], 50)] },
  { t0: 50.54, keys: [K(50.54, [1.0, 2.0, 6.5], [2.2, 3.1, -4.5], 52), K(53.33, [1.2, 2.3, 5.0], [2.6, 3.2, -4.5], 46)], fovKick: [50.92] },
];
const Stage10 = ({ t, f }: Ctx) => (<>
  <Shots t={t} shots={S10} />
  <FieldSet t={t} sky={["#3a1a3a", "#e0603a"]} moon={false} ground="#3a3a2a" trees={false} />
  <Hill p={[0, -6, -14]} s={[24, 8, 12]} color="#2e2e22" />
  {Array.from({ length: 15 }, (_, i) => { const row = Math.floor(i / 5), x = -8 + (i % 5) * 4 + row * 1.2, z = -6 - row * 4.5; return <Gallows key={i} p={[x, row * 0.9, z]} s={1 - row * 0.08} rotY={0.2 - row * 0.1} sway={Math.sin(t * 1.2 + i)} />; })}
  {/* the line of the accused */}
  {t > 48.43 ? Array.from({ length: 22 }, (_, i) => { const z = 3.5 - i * 1.7, x = -1.0 + Math.sin(i * 1.7) * 0.4; return <Person key={i} p={[x, 0, z]} h={2.8} look={i % 3 ? prisoners[i % 4] : folk[i % 8]} f={f + i * 5} pose={{ mood: i % 2 ? "worry" : "gulp", hunch: 0.5, nerv: 0.3, lookX: 0.4, walk: t * 4 + i, speed: 0.2 }} />; }) : null}
  {/* counter board */}
  <group position={[3.0, 0, -4.5]}>{[-1.3, 1.3].map((x) => <Box key={x} p={[x, 1.6, 0]} s={[0.14, 3.2, 0.14]} color="#3a2a1a" line={2} />)}
    <CanvasPlane p={[0, 3.4, 0.08]} s={[3.2, 2.0]} px={[480, 300]} frame="#3a2a1a" draw={(c, W, H) => { c.fillStyle = "#1e2a22"; c.fillRect(0, 0, W, H); c.textAlign = "center"; c.fillStyle = "#f4efe4"; fitText(c, "ACCUSED", W / 2, 58, W - 40, 44, 800); c.fillStyle = "#ffd27a"; fitText(c, COUNT(t).toLocaleString("en-US"), W / 2, 150, W - 40, 100);
      if (t > 50.8) { c.fillStyle = "#ff8a7a"; fitText(c, `${EXEC(t)} EXECUTED`, W / 2, 260, W - 40, 64); } }} /></group>
</>);

/* =================== STAGE 11 the empty meadow (53.33 – 55.53) =================== */
const S11: Shot[] = [{ t0: 53.33, keys: [K(53.33, [2.8, 1.6, 5.4], [-0.3, 1.35, 0], 44), K(55.53, [2.2, 1.5, 4.4], [-0.2, 1.4, 0], 40)] }];
const Stage11 = ({ t }: Ctx) => {
  const look = seg(t, 54.1, 54.5, Easing.inOut(Easing.sin));
  return (<>
    <Shots t={t} shots={S11} />
    <FieldSet t={t} sky={["#6ab0e8", "#ffe0b0"]} moon={false} ground="#4a8a3a" />
    <Goat p={[-0.6, 0, -0.3]} rotY={lerp(0.2, -0.9, look)} t={t} chew={1 - look * 0.5} s={1.25} />
    {[[-2, -3], [2.5, -4], [-3.4, -1]].map(([x, z], i) => <Ball key={i} p={[x, 0.15, z]} r={0.3} s={[1.6, 0.5, 1]} color="#5a9a3a" />)}
  </>);
};

/* =================== STAGE 12 whose name do you say (55.53 – end) =================== */
const S12: Shot[] = [{ t0: 55.53, keys: [K(55.53, [-0.3, 2.5, 5.0], [-0.4, 2.0, 0.6], 48), K(57.8, [-0.32, 2.2, 3.6], [-0.4, 2.15, 0.6], 42), K(DUR012 / FPS, [-0.33, 2.15, 3.2], [-0.4, 2.15, 0.6], 38)], fovKick: [57.83] }];
const Stage12 = ({ t, f }: Ctx) => (<>
  <Shots t={t} shots={S12} />
  <CellarSet t={t} cards={12} cardT={Array(12).fill(0)} wheel={t * 0.4} ledgerLines={["Prisoner 13", "Who rides with you?", "Name:", "________"]} />
  <Person p={JUDGE} h={3.3} look={judge} f={f} pose={{ mood: t > 57.8 ? "grin" : "deadpan", tilt: -0.06 * seg(t, 56.5, 57.8), armR: [0.22, 0.5], armRK: seg(t, 56.8, 57.3), lookX: 0 }} />
  <FaceGroup p={JUDGE}><Quill p={hand(3.3, [0.22, 0.5], 0, false, 0.3)} rot={[0.9, 0, -0.4]} s={1.6 * seg(t, 56.8, 57.3)} /></FaceGroup>
  <Person p={CLERK} h={3.0} look={clerk} f={f + 9} pose={{ mood: "deadpan", hunch: 0.4, armR: [0.2, 0.36], armRK: 1, lookX: 0.4 }} />
</>);

/* =================== pop texts (top band) + word captions =================== */
type Pop = { a: number; b: number; parts: [string, string][] };
const Y = "#FFE830", R = "#FF5C4A", Wt = "#FFFFFF";
const F1 = 1 / FPS, FX = 12 / FPS; // ends: 1 frame after a hard cut / 12 frames before a stage change (the next stage fades in 6 frames early)
const POPS: Pop[] = [
  { a: 0, b: 1.75 - FX, parts: [["425 ", Y], ["HANGED", R], ["|", Wt], ["FOR THIS?", Wt]] },
  { a: 3.91, b: 5.77 + F1, parts: [["LIMBURG", Wt]] },
  { a: 6.06, b: 8.45 + F1, parts: [["1743", Y], [" TO ", Wt], ["1794", Y]] },
  { a: 9.46, b: 10.0 + F1, parts: [["FEAR", R]] },
  { a: 10.01, b: 11.81 - FX, parts: [["BOKKENRIJDERS", Wt]] },
  { a: 12.38, b: 13.94 + F1, parts: [["FARMS", Wt], ["|", Wt], ["CHURCHES", Wt]] },
  { a: 14.41, b: 15.09, parts: [["THE DEVIL", R]] },
  { a: 15.09, b: 16.2 - FX, parts: [["FLYING GOATS", Wt]] },
  { a: 16.43, b: 18.22 - FX, parts: [["THE JUDGES", Wt]] },
  { a: 19.09, b: 20.16, parts: [["TORTURE", R]] },
  { a: 20.16, b: 21.14 + F1, parts: [["1 ", Y], ["QUESTION", Wt]] },
  { a: 21.14, b: 22.08 + F1, parts: [["WHO RIDES", Wt], ["|", Wt], ["WITH YOU?", Wt]] },
  { a: 22.08, b: 22.86, parts: [["1 ", Y], ["PRISONER", Wt]] },
  { a: 22.86, b: 23.82 + F1, parts: [["3 ", Y], ["NAMES", Wt]] },
  { a: 24.62, b: 25.67 + F1, parts: [["3 ", Y], ["TORTURED", R]] },
  { a: 25.67, b: 26.66 - FX, parts: [["9 ", Y], ["MORE", Wt]] },
  { a: 26.9, b: 28.74 + F1, parts: [["JOSEPH", Wt], ["|", Wt], ["KERCKHOFFS", Wt]] },
  { a: 28.74, b: 29.99, parts: [["HERZOGENRATH", Wt]] },
  { a: 29.99, b: 30.55 + F1, parts: [["CAPTAIN", Wt]] },
  { a: 31.07, b: 32.85, parts: [["11 MAY 1772", Y]] },
  { a: 32.85, b: 33.9 - FX, parts: [["HANGED", R]] },
  { a: 34.87, b: 35.9 + F1, parts: [["SAME STORY", Wt]] },
  { a: 36.36, b: 36.98 + F1, parts: [["THE DEVIL", R]] },
  { a: 37.42, b: 37.95 + F1, parts: [["MIDNIGHT", Y]] },
  { a: 40.03, b: 41.07 + F1, parts: [["THE JUDGES", Wt], ["|", Wt], ["KNEW", Wt]] },
  { a: 42.56, b: 43.88 + F1, parts: [["PAIN", R]] },
  { a: 44.38, b: 45.08 + F1, parts: [["REAL ", Wt], ["ROBBERS", Wt]] },
  { a: 46.04, b: 46.9 - FX, parts: [["TORTURE ROOM", R]] },
  { a: 47.03, b: 48.43 + F1, parts: [["1794", Y]] },
  { a: 48.64, b: 50.54 + F1, parts: [["1,200 ", Y], ["ACCUSED", Wt]] },
  { a: 50.92, b: 53.33 - FX, parts: [["425 ", Y], ["EXECUTED", R]] },
  { a: 53.91, b: 55.53 - FX, parts: [["0 ", Y], ["GOATS FOUND", Wt]] },
  { a: 57.25, b: 57.83, parts: [["1 ", Y], ["NAME", Wt]] },
  { a: 57.83, b: 99, parts: [["WHOSE NAME?", Wt]] },
];
export const POPS012 = POPS;
const AB = "'Archivo Black', Arial Black, sans-serif";
const PopText: React.FC<{ t: number }> = ({ t }) => {
  const p = POPS.find((x) => t >= x.a && t < x.b); if (!p) return null;
  const lines: [string, string][][] = [[]]; p.parts.forEach((q) => { if (q[0] === "|") lines.push([]); else lines[lines.length - 1].push(q); });
  const n = Math.max(...lines.map((l) => l.reduce((s, q) => s + q[0].length, 0))), fs = Math.min(lines.length > 1 ? 78 : 84, (720 * 0.88) / (n * 0.74));
  const k = interpolate(t - p.a, [0, 0.16], [0.55, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2.4)) });
  return <div style={{ position: "absolute", left: 0, right: 0, top: 100, height: 230, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ fontFamily: AB, fontSize: fs, lineHeight: 1.08, textAlign: "center", transform: `scale(${k}) rotate(${(1 - k) * -6}deg)`, WebkitTextStroke: `${Math.round(fs * 0.16)}px #10101a`, paintOrder: "stroke fill", textShadow: "0 7px 0 rgba(0,0,0,.55)", whiteSpace: "nowrap" }}>
      {lines.map((l, j) => <div key={j}>{l.map(([s, c], i) => <span key={i} style={{ color: c }}>{s}</span>)}</div>)}
    </div></div>;
};
type Grp = { text: string; a: number };
const groups: Grp[] = (() => {
  const g: Grp[] = []; let cur: number[] = [];
  const flush = () => { if (cur.length) { g.push({ text: cur.map((i) => String(SCRIPT[i]).replace(/[.,!?;:]$/, "")).join(" "), a: words[cur[0]].start }); cur = []; } };
  words.forEach((_, i) => { cur.push(i); if (cur.length === 2 || /[.,!?;:]$/.test(String(SCRIPT[i]))) flush(); });
  flush(); return g;
})();
const WordCaps: React.FC<{ t: number }> = ({ t }) => {
  const idx = groups.findIndex((g, i) => t >= g.a - 0.02 && t < (groups[i + 1]?.a ?? 99) - 0.02); if (idx < 0) return null; const g = groups[idx];
  const sc = interpolate(t - g.a, [0, 0.1], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2.6)) });
  const fs = Math.min(76, 640 / (g.text.length * 0.72));
  return <div style={{ position: "absolute", left: 20, right: 20, top: 900 - fs * 0.55, textAlign: "center", fontFamily: AB, fontSize: fs, lineHeight: 1.05, color: "#fff", WebkitTextStroke: "11px #000", paintOrder: "stroke fill", transform: `scale(${sc})`, textShadow: "0 7px 0 rgba(0,0,0,.45)", whiteSpace: "nowrap" }}>{g.text.toUpperCase()}</div>;
};

let fontHandle: number | null = null;
const ThumbText: React.FC<{ parts: [string, string][] }> = ({ parts }) => {
  const lines: [string, string][][] = [[]]; parts.forEach((q) => { if (q[0] === "|") lines.push([]); else lines[lines.length - 1].push(q); });
  const n = Math.max(...lines.map((l) => l.reduce((s, q) => s + q[0].length, 0))), fs = Math.min(118, (720 * 0.9) / (n * 0.74));
  return <div style={{ position: "absolute", left: 0, right: 0, top: 90, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ fontFamily: AB, fontSize: fs, lineHeight: 1.04, textAlign: "center", WebkitTextStroke: `${Math.round(fs * 0.17)}px #10101a`, paintOrder: "stroke fill", textShadow: "0 9px 0 rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>
      {lines.map((l, j) => <div key={j}>{l.map(([s, c], i) => <span key={i} style={{ color: c }}>{s}</span>)}</div>)}
    </div></div>;
};
/* stage table (start, end, bg, transition) is shared with the cut list for audio */
export const STAGES012: [number, number, string, "ghost" | "zoom" | "flash" | "whip" | "rewind" | "first"][] = [
  [0, 1.75, "#0e1236", "first"], [1.75, 3.2, "#2a2228", "flash"], [3.2, 11.81, "#0e1236", "whip"], [11.81, 16.2, "#0a0e2a", "flash"], [16.2, 18.22, "#0e1236", "whip"], [18.22, 26.66, "#2a2228", "zoom"],
  [26.66, 33.9, "#3a3a8a", "ghost"], [33.9, 39.33, "#120a3a", "rewind"], [39.33, 46.9, "#2a2228", "zoom"], [46.9, 53.33, "#3a1a3a", "flash"], [53.33, 55.53, "#6ab0e8", "ghost"], [55.53, DUR012 / FPS, "#2a2228", "zoom"],
];
export const SHOTS012 = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12].flat().map((s) => s.t0);
const STAGE_FN = [Stage1, Stage2, Stage3, Stage4, Stage5, Stage6, Stage7, Stage8, Stage9, Stage10, Stage11, Stage12];
const TINT = ["rgba(80,90,255,.08)", "rgba(255,150,60,.08)", "rgba(80,90,255,.08)", "rgba(60,40,160,.12)", "rgba(80,90,255,.08)", "rgba(255,120,40,.10)", "rgba(255,170,120,.06)", "rgba(140,60,200,.14)", "rgba(255,120,40,.10)", "rgba(255,60,30,.12)", "rgba(255,230,160,.05)", "rgba(255,100,40,.12)"];
/* props: clean hides pop texts and word captions (thumbnail stills); thumb draws a big thumbnail text */
export const Bok012: React.FC<Record<string, unknown>> = (props) => {
  const clean = props.clean === true, thumb = props.thumb as [string, string][] | undefined;
  const [h] = React.useState(() => { if (fontHandle === null) { fontHandle = delayRender("archivo"); const hh = fontHandle; document.fonts.load(`80px "Archivo Black"`).then(() => continueRender(hh)).catch(() => continueRender(hh)); } return 0; }); void h;
  const f = useCurrentFrame(), t = f / FPS;
  const si = STAGES012.findIndex(([a, b]) => t >= a && t < b);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("mix.wav")} />
      {STAGES012.map(([a, b, bg, tr], i) => { const Fn = STAGE_FN[i]; return <Scene key={i} first={tr === "first"} start={a} end={b} bg={bg} trans={tr === "first" ? undefined : tr}>{(c) => <Fn {...c} />}</Scene>; })}
      <Grade t={t} shaft={false} tint={TINT[Math.max(0, si)]} />
      {!clean && <PopText t={t} />}
      {!clean && <WordCaps t={t} />}
      {thumb && <ThumbText parts={thumb} />}
    </AbsoluteFill>
  );
};
void clamp; void Rope;
