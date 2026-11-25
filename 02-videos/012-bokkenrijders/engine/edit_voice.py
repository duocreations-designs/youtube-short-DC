# usage: edit_voice.py raw.wav raw_words.json out.wav target_wps [pause_word=Now] [s1_last_word=anyway]
# 1) cap silences: >0.25 s -> 0.22 s (one 0.40 s pause kept before "Now")  2) rubberband tempo on everything after sentence 1
import sys, json, wave, numpy as np, subprocess
raw, wj, out, wps = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4])
PW, S1W = (sys.argv[5:7] + ["Now", "anyway"][len(sys.argv[5:7]):])
w = wave.open(raw); sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768; w.close()
words = json.load(open(wj))
hop = int(0.01 * sr); n = len(x) // hop
rms = np.sqrt(np.mean(x[: n * hop].reshape(n, hop) ** 2, axis=1) + 1e-12); db = 20 * np.log10(rms / rms.max())
quiet = db < -38
now_t = next(v["start"] for v in words if v["word"] == PW)
s1_end = next(v["end"] for v in words if v["word"] == S1W)
keep = np.ones(n, bool); i = 0
while i < n:
    if quiet[i]:
        j = i
        while j < n and quiet[j]: j += 1
        L = (j - i) * 0.01; mid = (i + j) / 2 * 0.01
        cap = 0.40 if abs(mid - now_t) < 0.6 else 0.22
        if i == 0: cap = 0.0
        if L > cap + 0.03:
            drop = int(round((L - cap) / 0.01)); a = i + (j - i - drop) // 2; keep[a:a + drop] = False
        i = j
    else: i += 1
# time map old->new (10 ms resolution) to find sentence-1 boundary after trimming
newpos = np.cumsum(keep) * 0.01
seg = np.concatenate([x[k * hop:(k + 1) * hop] for k in range(n) if keep[k]])
b = int(newpos[min(n - 1, int(s1_end / 0.01))] * sr) + int(0.12 * sr)
first_last = (newpos[min(n - 1, int(words[-1]["end"] / 0.01) - 1)] - newpos[int(words[0]["start"] / 0.01)])
s1 = b / sr - newpos[int(words[0]["start"] / 0.01)]
target = len(words) / wps
factor = (first_last - s1) / (target - s1)   # >1 means speed up
print(f"trimmed first->last {first_last:.2f}s, sentence1 {s1:.2f}s, target {target:.2f}s, tempo x{factor:.3f}")
def wr(p, y):
    o = wave.open(p, "wb"); o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr); o.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes()); o.close()
wr("/tmp/_a.wav", seg[:b]); wr("/tmp/_b.wav", seg[b:])
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", "/tmp/_b.wav", "-af", f"rubberband=tempo={factor:.4f}:pitch=1.0:transients=crisp:formant=preserved", "/tmp/_b2.wav"], check=True)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", "/tmp/_a.wav", "-i", "/tmp/_b2.wav", "-filter_complex", "[0:a][1:a]concat=n=2:v=0:a=1,apad=pad_dur=0.25[a]", "-map", "[a]", "-ar", "48000", out], check=True)
