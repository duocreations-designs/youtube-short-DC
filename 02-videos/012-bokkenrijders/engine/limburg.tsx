// Props for Short 012 (Bokkenrijders, Limburg 1743-1794): goat (with optional wings), gallows, church, farmhouse,
// ledger, name card, moon, hill, torch, lantern, scroll, post with ropes, wheel, devil horns.
import React from "react";
import { Box, Cyl, Ball, CanvasPlane, INK } from "./toon";
import { V3, clamp } from "./kit";
import { Glow } from "./props";
import { Extrude } from "./extra";
import { Seg, Rope, fitText } from "./oldtown";

/* goat: faces local +x, feet at y 0, about 1.6 long. gallop 0..1 swings legs, flap = wing angle (radians) or undefined for no wings */
export const Goat: React.FC<{ p: V3; rotY?: number; s?: number; t: number; gallop?: number; flap?: number; color?: string; chew?: number; eye?: boolean }> = ({ p, rotY = 0, s = 1, t, gallop = 0, flap, color = "#ece6d8", chew = 0, eye = true }) => {
  const dark = "#3a2a1a", leg = (i: number) => gallop * 0.6 * Math.sin(t * 14 + (i % 2 ? Math.PI : 0) + (i > 1 ? 0.8 : 0));
  const jaw = chew * Math.abs(Math.sin(t * 7)) * 0.05;
  return (
    <group position={p} rotation={[0, rotY, 0]} scale={s}>
      <Ball p={[0, 0.95, 0]} r={0.5} s={[1.5, 0.85, 0.85]} color={color} />
      <Ball p={[0.62, 1.2, 0]} r={0.2} s={[1, 1.4, 1]} color={color} />
      <Ball p={[0.82, 1.42, 0]} r={0.24} s={[1.35, 1, 0.9]} color={color} />
      <Ball p={[1.07, 1.33 - jaw, 0]} r={0.13} s={[1.1, 0.9, 0.9]} color="#d8c8b8" />
      {[-1, 1].map((k) => <React.Fragment key={k}>
        <Cyl p={[0.74, 1.72, k * 0.1]} rt={0.015} rb={0.055} h={0.42} rot={[k * 0.25, 0, 0.75]} color={dark} line={2} />
        <Box p={[0.72, 1.5, k * 0.24]} s={[0.18, 0.06, 0.12]} rot={[k * 0.5, 0, -0.3]} color={color} line={2} />
        {eye ? <Ball p={[0.94, 1.5, k * 0.17]} r={0.055} color="#fff8d0" ink={0.02} /> : null}
        {eye ? <Ball p={[0.97, 1.5, k * 0.2]} r={0.028} color={INK} ink={0} /> : null}
      </React.Fragment>)}
      <Cyl p={[1.0, 1.12 - jaw, 0]} rt={0.06} rb={0.01} h={0.24} color="#bfb4a4" line={2} />
      <Cyl p={[-0.74, 1.2, 0]} rt={0.05} rb={0.02} h={0.22} rot={[0, 0, -0.9]} color={color} line={2} />
      {[[0.42, 0.2], [0.42, -0.2], [-0.42, 0.2], [-0.42, -0.2]].map(([x, z], i) => (
        <group key={i} position={[x, 0.66, z]} rotation={[0, 0, leg(i)]}>
          <Cyl p={[0, -0.3, 0]} rt={0.07} rb={0.055} h={0.6} color={color} line={2} />
          <Box p={[0, -0.62, 0]} s={[0.13, 0.08, 0.12]} color={dark} line={2} />
        </group>))}
      {flap !== undefined ? [-1, 1].map((k) => (
        <group key={"w" + k} position={[0.05, 1.25, k * 0.32]} rotation={[k * -flap, 0, 0]}>
          <Box p={[0, 0, k * 0.55]} s={[0.8, 0.05, 1.1]} color="#f6f2ff" line={2} />
          <Box p={[-0.18, 0, k * 1.2]} s={[0.55, 0.04, 0.5]} color="#e6e0f8" line={2} />
          <Box p={[-0.32, 0, k * 1.55]} s={[0.32, 0.04, 0.35]} color="#d8d0f0" line={2} />
        </group>)) : null}
    </group>
  );
};

/* gallows: post at local x 0, beam towards +x, empty noose */
export const Gallows: React.FC<{ p: V3; rotY?: number; s?: number; sway?: number }> = ({ p, rotY = 0, s = 1, sway = 0 }) => {
  const nx = 1.55 + sway * 0.1, top: V3 = [1.55, 4.1, 0], knot: V3 = [nx, 3.0, 0];
  const ring: V3[] = Array.from({ length: 13 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return [nx + Math.sin(a) * 0.18, 2.75 - Math.cos(a) * 0.25, 0]; });
  return (
    <group position={p} rotation={[0, rotY, 0]} scale={s}>
      <Box p={[0, 2.1, 0]} s={[0.26, 4.4, 0.26]} color="#4a3422" />
      <Box p={[0.85, 4.2, 0]} s={[2.0, 0.24, 0.24]} color="#4a3422" />
      <Seg a={[0, 3.3, 0]} b={[0.75, 4.1, 0]} r={0.07} color="#4a3422" line={2} />
      <Box p={[0, 0.1, 0]} s={[1.2, 0.2, 1.2]} color="#3a2a1a" line={2} />
      <Rope pts={[top, knot]} r={0.035} color="#c9a66b" />
      <Rope pts={ring} r={0.03} color="#c9a66b" />
    </group>
  );
};

/* village church: nave along local z, tower at the front (+z), door at the tower foot. open 0..1 swings the door */
export const Church: React.FC<{ p: V3; rotY?: number; s?: number; open?: number; lit?: number }> = ({ p, rotY = 0, s = 1, open = 0, lit = 0 }) => (
  <group position={p} rotation={[0, rotY, 0]} scale={s}>
    <Box p={[0, 2.4, 0]} s={[5, 4.8, 9]} color="#b8ae9a" />
    <Extrude pts={[[-2.9, 0], [2.9, 0], [0, 2.6]]} depth={9.4} color="#5a3a3a" p={[0, 4.8, 0]} line={3} />
    <Box p={[0, 4.6, 5.2]} s={[2.4, 9.2, 2.4]} color="#c4baa6" />
    <Cyl p={[0, 11.1, 5.2]} rt={0.0} rb={1.7} h={3.8} color="#3a4a5a" line={3} />
    <Box p={[0, 13.5, 5.2]} s={[0.1, 1.0, 0.1]} color="#ffc23a" line={2} /><Box p={[0, 13.7, 5.2]} s={[0.55, 0.1, 0.1]} color="#ffc23a" line={2} />
    <CanvasPlane p={[0, 7.4, 6.42]} s={[1.0, 1.0]} px={[128, 128]} draw={(c, W, H) => { c.fillStyle = "#efe6d6"; c.beginPath(); c.arc(W / 2, H / 2, W / 2 - 4, 0, 7); c.fill(); c.strokeStyle = INK; c.lineWidth = 6; c.stroke(); c.beginPath(); c.moveTo(W / 2, H / 2); c.lineTo(W / 2, 22); c.moveTo(W / 2, H / 2); c.lineTo(W - 34, H / 2); c.stroke(); }} />
    {[-1.4, 1.4].map((z, i) => <CanvasPlane key={i} p={[2.52, 2.9, z]} rot={[0, Math.PI / 2, 0]} s={[0.9, 1.9]} px={[90, 190]} draw={(c, W, H) => { c.fillStyle = lit > 0 ? "#ffd770" : "#1e2a44"; c.beginPath(); c.moveTo(0, H); c.lineTo(0, W / 2); c.arc(W / 2, W / 2, W / 2, Math.PI, 0); c.lineTo(W, H); c.fill(); c.strokeStyle = INK; c.lineWidth = 6; c.stroke(); }} />)}
    <Box p={[0, 1.4, 6.42]} s={[1.5, 2.8, 0.06]} color="#1a1014" line={2} />
    <group position={[-0.7, 0, 6.48]} rotation={[0, open * 1.4, 0]}><Box p={[0.7, 1.35, 0]} s={[1.4, 2.7, 0.12]} color="#6a3a22" /><Box p={[1.2, 1.3, 0.09]} s={[0.12, 0.12, 0.08]} color="#d8b24a" line={2} /></group>
    {lit > 0 ? <Glow p={[0, 1.6, 6.0]} r={2.2} color="rgba(255,200,120,1)" o={0.4 * lit * open} /> : null}
  </group>
);

/* Limburg farmhouse with half-timber front (front faces local +z). open 0..1 swings the door */
export const Farmhouse: React.FC<{ p: V3; rotY?: number; w?: number; h?: number; open?: number; lit?: number; seed?: number }> = ({ p, rotY = 0, w = 6, h = 3.6, open = 0, lit = 0.3, seed = 1 }) => (
  <group position={p} rotation={[0, rotY, 0]}>
    <Box p={[0, h / 2, 0]} s={[w, h, 5]} color="#efe6d6" />
    <Extrude pts={[[-w / 2 - 0.3, 0], [w / 2 + 0.3, 0], [0, 2.8]]} depth={5.6} color="#6a2a22" p={[0, h, 0]} line={3} />
    <CanvasPlane p={[0, h / 2, 2.52]} s={[w, h]} px={[Math.round(w * 50), Math.round(h * 50)]} draw={(c, W, H) => {
      c.fillStyle = "#efe6d6"; c.fillRect(0, 0, W, H); c.strokeStyle = "#3a2418"; c.lineWidth = 12;
      c.strokeRect(6, 6, W - 12, H - 12); c.beginPath(); c.moveTo(0, H * 0.48); c.lineTo(W, H * 0.48);
      for (let i = 1; i < 6; i++) { const x = (W / 6) * i; c.moveTo(x, 0); c.lineTo(x, H); }
      c.moveTo(0, H * 0.48); c.lineTo(W / 6, 0); c.moveTo(W, H * 0.48); c.lineTo(W * 5 / 6, 0); c.stroke();
      let n = seed * 17; for (const x of [W / 12, W * 3 / 12, W * 9 / 12, W * 11 / 12]) { n = (n * 9301 + 49297) % 233280; c.fillStyle = n / 233280 < lit ? "#ffd770" : "#1e2a44"; c.fillRect(x - 22, H * 0.58, 44, 50); c.strokeStyle = "#3a2418"; c.lineWidth = 6; c.strokeRect(x - 22, H * 0.58, 44, 50); }
    }} />
    <Box p={[0, 1.15, 2.56]} s={[1.3, 2.3, 0.04]} color="#120c10" line={2} />
    <group position={[-0.65, 0, 2.62]} rotation={[0, open * 1.45, 0]}><Box p={[0.65, 1.12, 0]} s={[1.3, 2.24, 0.12]} color="#2f5a3a" /><Box p={[1.1, 1.1, 0.09]} s={[0.1, 0.1, 0.08]} color="#d8b24a" line={2} /></group>
  </group>
);

/* open ledger (flat on a table, spine along local x). lines are drawn top to bottom; k 0..1 reveals the last line like a quill writing */
export const Ledger: React.FC<{ p: V3; rot?: V3; s?: number; lines: string[]; k?: number; red?: number; title?: string }> = ({ p, rot = [-Math.PI / 2, 0, 0], s = 1, lines, k = 1, red = -1, title = "PROTOCOL" }) => (
  <group position={p} rotation={rot} scale={s}>
    <Box p={[0, 0, -0.04]} s={[2.5, 1.7, 0.06]} color="#5a2a1a" line={3} />
    <CanvasPlane p={[0, 0, 0.01]} s={[2.4, 1.6]} px={[720, 480]} draw={(c, W, H) => {
      c.fillStyle = "#f3e6c4"; c.fillRect(0, 0, W, H); c.fillStyle = "rgba(120,80,30,.25)"; c.fillRect(W / 2 - 6, 0, 12, H);
      c.strokeStyle = "rgba(90,60,30,.25)"; c.lineWidth = 2; for (let y = 90; y < H - 20; y += 52) { c.beginPath(); c.moveTo(24, y); c.lineTo(W / 2 - 24, y); c.moveTo(W / 2 + 24, y); c.lineTo(W - 24, y); c.stroke(); }
      c.fillStyle = "#3a2418"; c.textAlign = "center"; fitText(c, title, W / 4, 58, W / 2 - 60, 38); fitText(c, "ANNO 1772", W * 3 / 4, 58, W / 2 - 60, 38);
      c.textAlign = "left";
      lines.forEach((l, i) => {
        const last = i === lines.length - 1, x = W / 2 + 34, y = 132 + i * 52;
        c.fillStyle = i === red ? "#a01a1a" : "#2a1a12"; c.font = "italic 700 40px Georgia, 'DejaVu Serif', serif";
        if (!last || k >= 1) { fitText(c, l, x, y, W / 2 - 60, 40, 700, "Georgia, 'DejaVu Serif', serif"); return; }
        c.save(); c.beginPath(); c.rect(x - 4, y - 44, (W / 2 - 50) * clamp(k), 60); c.clip(); fitText(c, l, x, y, W / 2 - 60, 40, 700, "Georgia, 'DejaVu Serif', serif"); c.restore();
      });
      for (let i = 0; i < 4; i++) { c.fillStyle = "rgba(42,26,18,.55)"; c.fillRect(40, 112 + i * 52, 150 + ((i * 37) % 90), 6); }
    }} />
  </group>
);

/* quill: tip at local origin, feather up */
export const Quill: React.FC<{ p: V3; rot?: V3; s?: number }> = ({ p, rot, s = 1 }) => (
  <group position={p} rotation={rot} scale={s}><Cyl p={[0, 0.32, 0]} rt={0.012} rb={0.004} h={0.64} color="#2a1a12" line={1} /><Box p={[0.05, 0.6, 0]} s={[0.12, 0.5, 0.02]} rot={[0, 0, -0.2]} color="#f4f0e8" line={2} /></group>
);

/* parchment card with a name (vertical, front faces local +z) */
export const NameCard: React.FC<{ p: V3; rot?: V3; s?: number; name: string; x?: boolean }> = ({ p, rot, s = 1, name, x }) => (
  <CanvasPlane p={p} rot={rot} s={[1.0 * s, 0.6 * s]} px={[300, 180]} frame="#3a2418" draw={(c, W, H) => {
    c.fillStyle = "#f3e6c4"; c.fillRect(0, 0, W, H); c.fillStyle = "#2a1a12"; c.textAlign = "center"; c.textBaseline = "middle"; fitText(c, name, W / 2, H / 2 + 4, W - 40, 64);
    if (x) { c.strokeStyle = "#b3122e"; c.lineWidth = 12; c.beginPath(); c.moveTo(24, 24); c.lineTo(W - 24, H - 24); c.moveTo(W - 24, 24); c.lineTo(24, H - 24); c.stroke(); }
  }} />
);

export const Moon: React.FC<{ p: V3; r?: number }> = ({ p, r = 4 }) => (<><Ball p={p} r={r} color="#fff4c8" ink={0} /><Glow p={p} r={r * 3.2} color="rgba(255,240,190,1)" o={0.55} /></>);
export const Hill: React.FC<{ p: V3; s: V3; color?: string }> = ({ p, s, color = "#2f5a3a" }) => <Ball p={p} r={1} s={s} color={color} ink={0.01} />;

/* wall torch: flicker flame + glow */
export const Torch: React.FC<{ p: V3; t: number; o?: number }> = ({ p, t, o = 1 }) => {
  const fl = 0.85 + 0.15 * Math.sin(t * 23) * Math.sin(t * 7.3);
  return (<group position={p}><Cyl p={[0, -0.35, 0]} rt={0.07} rb={0.05} h={0.7} color="#4a3422" line={2} /><Ball p={[0, 0.12, 0]} r={0.16 * fl} s={[1, 1.6, 1]} color="#ffb83a" ink={0} /><Ball p={[0, 0.1, 0]} r={0.08} color="#fff2a8" ink={0} /><Glow p={[0, 0.15, 0.05]} r={3.4 * fl} color="rgba(255,150,60,1)" o={0.55 * o} /></group>);
};
/* hand lantern (hang point at local origin) */
export const Lantern: React.FC<{ p: V3; on?: number }> = ({ p, on = 1 }) => (
  <group position={p}><Cyl p={[0, 0.06, 0]} rt={0.02} h={0.12} color="#1f2a30" line={1} /><Box p={[0, -0.18, 0]} s={[0.26, 0.34, 0.26]} color={on > 0 ? "#ffe9a8" : "#a8b8c0"} line={2} /><Cyl p={[0, -0.02, 0]} rt={0.0} rb={0.2} h={0.12} color="#1f2a30" line={2} />{on > 0 ? <Glow p={[0, -0.18, 0.05]} r={2.2} color="rgba(255,210,120,1)" o={0.6 * on} /> : null}</group>
);

/* unrolled scroll, front faces local +z */
export const Scroll: React.FC<{ p: V3; rot?: V3; s?: number; title: string; lines: string[]; hi?: number }> = ({ p, rot, s = 1, title, lines, hi = -1 }) => (
  <group position={p} rotation={rot} scale={s}>
    <CanvasPlane p={[0, 0, 0]} s={[1.5, 2.0]} px={[300, 400]} draw={(c, W, H) => {
      c.fillStyle = "#f3e6c4"; c.fillRect(0, 0, W, H); c.textAlign = "center"; c.fillStyle = "#7a1a22"; fitText(c, title, W / 2, 56, W - 40, 40);
      lines.forEach((l, i) => { c.fillStyle = i === hi ? "#b3122e" : "#2a1a12"; fitText(c, l, W / 2, 124 + i * 62, W - 40, 38, 700); });
    }} />
    {[1.02, -1.02].map((y) => <Cyl key={y} p={[0, y, 0.02]} rt={0.08} h={1.7} rot={[0, 0, Math.PI / 2]} color="#d8c49a" line={2} />)}
  </group>
);

/* wooden post with rope loops at body height (prisoner stands in front of it) */
export const Post: React.FC<{ p: V3; h?: number }> = ({ p, h = 3.6 }) => (
  <group position={p}><Cyl p={[0, h / 2, 0]} rt={0.16} rb={0.2} h={h} color="#5a3a22" line={2} />
    {[1.2, 1.7].map((y) => <Rope key={y} pts={Array.from({ length: 13 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return [Math.sin(a) * 0.42, y + Math.sin(a * 2) * 0.03, Math.cos(a) * 0.42 + 0.22] as V3; })} r={0.035} color="#c9a66b" />)}
  </group>
);

/* torture wheel standing up, axle along local z; ang turns it */
export const Wheel: React.FC<{ p: V3; r?: number; ang?: number; rotY?: number }> = ({ p, r = 1.4, ang = 0, rotY = 0 }) => (
  <group position={p} rotation={[0, rotY, 0]}><group rotation={[0, 0, ang]}>
    <Cyl p={[0, 0, 0]} rt={r} h={0.18} rot={[Math.PI / 2, 0, 0]} color="#6a4226" line={3} />
    <Cyl p={[0, 0, 0.02]} rt={r * 0.8} h={0.2} rot={[Math.PI / 2, 0, 0]} color="#2a1a12" line={1} />
    {Array.from({ length: 8 }, (_, i) => <Box key={i} p={[0, 0, 0.05]} s={[0.12, r * 1.95, 0.12]} rot={[0, 0, (i / 8) * Math.PI]} color="#7a4a2a" line={2} />)}
    <Cyl p={[0, 0, 0.1]} rt={0.22} h={0.3} rot={[Math.PI / 2, 0, 0]} color="#3a2a1a" line={2} />
  </group><Box p={[0, -r * 0.6, -0.3]} s={[0.24, r * 1.3, 0.24]} color="#4a3422" /></group>
);

/* two small horns on a puppet of height h (put inside a FaceGroup at the puppet's feet) */
export const Horns: React.FC<{ h: number; color?: string }> = ({ h, color = "#2a0a0a" }) => (<>
  {[-1, 1].map((k) => <Cyl key={k} p={[k * 0.1 * h, 0.79 * h, 0.03]} rt={0.0} rb={0.05 * h} h={0.14 * h} rot={[0, 0, -k * 0.35]} color={color} line={2} />)}
</>);
