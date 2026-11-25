#!/usr/bin/env python3
"""mix012.py: voice + (music, ambience, sfx) -> mix012.wav. Bed sits BED_DB below the voice (integrated LUFS), ducked under speech,
final -14 LUFS with a -3 dBTP ceiling. Writes mix_qa.json."""
import wave, json, subprocess, re, numpy as np
SR = 48000; BED_DB = 18.5
def rd(p):
    w = wave.open(p); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768; return x
def wr(p, x):
    w = wave.open(p, "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
def lufs(p):
    o = subprocess.run(["ffmpeg", "-nostats", "-i", p, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    I = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", o)[-1]); LRA = float(re.findall(r"LRA:\s+([\d.]+) LU", o)[-1]); TP = float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS", o)[-1]); return I, LRA, TP
v = rd("voice012.wav"); N = int(59.67 * SR); v = np.pad(v, (0, max(0, N - len(v))))[:N]
mus, amb, sfx = [np.pad(rd(f), (0, max(0, N - len(rd(f)))))[:N] for f in ["music012.wav", "amb012.wav", "sfx012.wav"]]
# speech envelope -> ducking (music/ambience -6 dB, sfx -3 dB while speaking)
hop = 480; e = np.sqrt(np.convolve(v ** 2, np.ones(hop) / hop, "same")); act = np.clip((20 * np.log10(e + 1e-9) + 45) / 15, 0, 1)
k = np.exp(-1 / (0.12 * SR / 1)); sm = np.copy(act)
a, r = np.exp(-1 / (0.01 * SR)), np.exp(-1 / (0.25 * SR)); y = 0.0
for i in range(0, N, 48):
    tgt = act[i]; y = tgt + (a if tgt > y else r) ** 48 * (y - tgt); sm[i:i + 48] = y
bed = mus * 10 ** (-6 * sm / 20) * 0.55 + amb * 10 ** (-6 * sm / 20) * 0.45 + sfx * 10 ** (-3 * sm / 20) * 0.9
wr("_v.wav", v); wr("_b.wav", bed / max(1e-9, np.abs(bed).max()) * 0.5)
Iv, _, _ = lufs("_v.wav"); Ib, _, _ = lufs("_b.wav")
g = 10 ** ((Iv - BED_DB - Ib) / 20); bedn = bed / max(1e-9, np.abs(bed).max()) * 0.5 * g
mix = v + bedn; wr("_m.wav", mix); Im, _, _ = lufs("_m.wav")
mix *= 10 ** ((-14.0 - Im) / 20)
# soft-knee limiter to -3 dBFS sample peak (true peak then lands near -2.8)
c = 10 ** (-3.2 / 20); over = np.abs(mix) > c * 0.8
mix = np.where(np.abs(mix) > c * 0.8, np.sign(mix) * (c * 0.8 + (c * 0.2) * np.tanh((np.abs(mix) - c * 0.8) / (c * 0.2))), mix)
wr("mix012.wav", mix)
I, LRA, TP = lufs("mix012.wav"); wr("_bedf.wav", bedn * 10 ** ((-14.0 - Im) / 20)); Ibf, _, _ = lufs("_bedf.wav"); wr("_vf.wav", v * 10 ** ((-14.0 - Im) / 20)); Ivf, _, _ = lufs("_vf.wav")
clip = float(np.mean(np.abs(mix) >= 0.999) * 100)
qa = {"integrated_LUFS": I, "LRA_LU": LRA, "true_peak_dBTP": TP, "voice_LUFS": Ivf, "bed_LUFS": Ibf, "bed_under_voice_dB": round(Ivf - Ibf, 2), "clipped_pct": clip}
json.dump(qa, open("mix_qa.json", "w"), indent=1); print(qa)
