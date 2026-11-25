#!/usr/bin/env python3
"""Short 012 sound: own 120 bpm music (9 parts + 3 dead stops), ambience beds per set, SFX on cuts, pops and action frames.
Same synth kit as audio011.py. usage: audio012.py <voice.wav> <cuts.json> <sfxdir> <outdir>"""
import sys, json, wave, numpy as np
VOICE, CUTS, SFXD, OUT = sys.argv[1:5]
SR = 48000; DUR = 59.67; N = int(SR * DUR); rng = np.random.default_rng(12)
def rd(p):
    w = wave.open(p); sr = w.getframerate(); ch = w.getnchannels(); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    if ch > 1: x = x.reshape(-1, ch).mean(1)
    if sr != SR: x = np.interp(np.arange(int(len(x) * SR / sr)) / SR, np.arange(len(x)) / sr, x)
    return x
def wr(p, x):
    w = wave.open(p, "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
def T(d): return np.arange(int(SR * d)) / SR
def add(buf, x, t, g=1.0):
    i = int(t * SR)
    if i >= len(buf): return
    L = min(len(x), len(buf) - i); buf[i:i + L] += x[:L] * g
def bp(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X[(f < lo) | (f > hi)] = 0; return np.fft.irfft(X, len(x))
def env(d, a=0.005, r=None):
    t = T(d); e = np.minimum(1, t / a); return e * (np.exp(-t * (r if r else 4 / d)))
def hz(m): return 440 * 2 ** ((m - 69) / 12)

# ---------------- music (A minor, 120 bpm) ----------------
BEAT = 0.5; mus = np.zeros(N)
def tuba(m, d=0.42): t = T(d); f = hz(m); return (np.sin(2 * np.pi * f * t) + 0.45 * np.sin(4 * np.pi * f * t) + 0.2 * np.sin(6 * np.pi * f * t)) * env(d, 0.012, 7)
def pluck(m, d=0.35): t = T(d); f = hz(m); return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t + 0.3)) * env(d, 0.003, 12)
def bell(m, d=0.6): t = T(d); f = hz(m); return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 9)) * env(d, 0.002, 6)
def kick(d=0.3): t = T(d); f = 50 + 90 * np.exp(-t * 25); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(d, 0.002, 14)
def hat(d=0.05): return bp(rng.standard_normal(int(SR * d)), 6000, 14000) * env(d, 0.001, 70)
def snare(d=0.18): return bp(rng.standard_normal(int(SR * d)), 900, 7000) * env(d, 0.001, 22) + np.sin(2 * np.pi * 190 * T(d)) * env(d, 0.001, 30) * 0.5
def tom(m, d=0.35): t = T(d); f = hz(m) * (1 + 0.5 * np.exp(-t * 20)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(d, 0.002, 10)
def pad(ms, d): t = T(d); x = sum(np.sin(2 * np.pi * hz(m) * t + i) + 0.3 * np.sin(2 * np.pi * hz(m) * 1.003 * t) for i, m in enumerate(ms)); a = np.minimum(1, t / 0.4) * np.minimum(1, (d - t) / 0.4); return x * a / len(ms)
def saw(m, d): t = T(d); f = hz(m); x = 2 * ((f * t) % 1) - 1; return bp(x, 40, 1200) * np.minimum(1, t / 0.08) * np.minimum(1, (d - t) / 0.08)
def flute(m, d=0.45): t = T(d); f = hz(m) * (1 + 0.004 * np.sin(2 * np.pi * 5.5 * t)); return (np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.08 * bp(rng.standard_normal(len(t)), 1500, 6000)) * np.minimum(1, t / 0.04) * np.minimum(1, (d - t) / 0.08)
# A 0-11.81 night village: drone + minor bell tune
add(mus, saw(33, 11.8), 0, 0.12); add(mus, pad([57, 60, 64], 11.8), 0, 0.12)
tune = [69, 72, 76, 74, 72, 71, 69, None, 64, 67, 69, 71, 72, 71, 67, None]
t = 0.0; b = 0
while t < 11.8:
    m = tune[b % 16]
    if m: add(mus, bell(m + 12, 0.7), t, 0.11)
    if b % 2 == 0: add(mus, kick(0.25), t, 0.2)
    add(mus, hat(0.03), t + 0.25, 0.035); b += 1; t += BEAT
# B 11.81-16.2 sneak: walking pizzicato
walk = [45, 48, 47, 45, 44, 45, 47, 48]
t = 11.81; k = 0
while t < 16.2:
    add(mus, pluck(walk[k % 8] - 12, 0.18), t, 0.45); add(mus, pluck(walk[k % 8] + 12, 0.12), t + 0.25, 0.1); add(mus, hat(0.03), t + 0.25, 0.05); k += 1; t += BEAT
add(mus, saw(52, 1.8) * np.linspace(0, 1, int(SR * 1.8)) ** 2, 14.4, 0.2)  # devil riser
# C 16.2-26.66 march of the judges -> torture: kick, snare, toms, drone
t = 16.2; k = 0
while t < 26.66:
    add(mus, kick(), t, 0.5); add(mus, hat(), t + 0.25, 0.06)
    if k % 2 == 1: add(mus, snare(), t, 0.22)
    if k % 4 == 3: add(mus, tom(45), t + 0.25, 0.3); add(mus, tom(41), t + 0.375, 0.3)
    k += 1; t += BEAT
add(mus, saw(33, 10.5), 16.2, 0.16); add(mus, saw(40, 10.5), 16.2, 0.09)
# D 26.66-33.9 Herzogenrath: military snare rolls + low tuba
t = 26.66; k = 0
while t < 33.9:
    add(mus, tuba([45, 45, 40, 43][(k // 2) % 4] - 12, 0.42), t, 0.45) if k % 2 == 0 else None
    for j in range(2): add(mus, snare(0.1), t + j * 0.125, 0.12)
    k += 1; t += BEAT
# E 33.9-39.33 dream: music box in minor + pad
box = [81, 76, 72, 76, 79, 76, 72, 69]
for i, ms in enumerate([[57, 60, 64], [53, 57, 60], [52, 55, 59]]): add(mus, pad(ms, 1.9), 33.9 + i * 1.8, 0.2)
t = 33.9; k = 0
while t < 39.33: add(mus, bell(box[k % 8], 0.5), t, 0.1); k += 1; t += BEAT / 2
# F 39.33-46.9 somber: pads + half-time pulse, riser into "torture room"
for i, ms in enumerate([[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 56, 59]]): add(mus, pad(ms, 2.0), 39.33 + i * 1.9, 0.22)
t = 39.33
while t < 46.9: add(mus, kick(0.25), t, 0.28); t += 1.0
add(mus, saw(57, 1.2) * np.linspace(0, 1, int(SR * 1.2)) ** 2, 45.7, 0.25)
# G 46.9-53.33 the count: heavy drums + low saw
t = 46.9; k = 0
while t < 53.33:
    add(mus, kick(0.35), t, 0.6); add(mus, tom(40 if k % 2 else 43), t + 0.25, 0.22)
    if k % 2 == 1: add(mus, snare(), t, 0.2)
    k += 1; t += BEAT
add(mus, saw(28, 6.4), 46.9, 0.18)
# H 53.33-55.53 pastoral flute (the goat in the meadow)
for i, m in enumerate([76, 79, 81, 79, 76]): add(mus, flute(m, 0.42), 53.6 + i * 0.36, 0.14)
add(mus, pad([60, 64, 67], 2.2), 53.33, 0.12)
# I 55.53-end soft tension, final hit on "say"
t = 55.53
while t < 58.3: add(mus, kick(0.2), t, 0.3); add(mus, pluck(45, 0.2), t + 0.25, 0.2); t += BEAT
add(mus, saw(45, 2.9), 55.53, 0.08)
hit = kick(0.8) * 1.2 + bp(rng.standard_normal(int(SR * 0.8)), 200, 4000) * env(0.8, 0.001, 9) * 0.4; add(mus, hit, 58.38, 0.6)
add(mus, pad([45, 52, 57], 1.25), 58.38, 0.18)
# dead stops on 3 key moments
for a, d in [(21.14, 0.4), (32.85, 0.55), (53.33, 0.3)]:
    i, j = int(a * SR), int((a + d) * SR); mus[i:j] = 0; f = int(0.01 * SR); mus[i - f:i] *= np.linspace(1, 0, f)

# ---------------- ambience beds ----------------
amb = np.zeros(N)
def wind(d): return bp(rng.standard_normal(int(SR * d)), 80, 500) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.2 * T(d)))
def crickets(d):
    y = np.zeros(int(SR * d))
    for k in range(int(d * 6)): add(y, np.sin(2 * np.pi * 4400 * T(0.05)) * (0.5 + 0.5 * np.sin(2 * np.pi * 60 * T(0.05))) * env(0.05, 0.003, 40), rng.uniform(0, d - 0.1))
    return y
def drips(d):
    y = bp(rng.standard_normal(int(SR * d)), 60, 300) * 0.4
    for k in range(int(d * 1.2)): t = T(0.12); add(y, np.sin(2 * np.pi * np.cumsum(1400 * np.exp(-t * 18) + 500) / SR) * env(0.12, 0.001, 30) * 2, rng.uniform(0, d - 0.2))
    return y
def crackle(d):
    y = np.zeros(int(SR * d))
    for k in range(int(d * 14)): add(y, bp(rng.standard_normal(int(SR * 0.02)), 1500, 7000) * env(0.02, 0.0005, 150) * rng.uniform(0.3, 1.2), rng.uniform(0, d - 0.05))
    return y
def crowd(d, k=1.0): return sum(bp(rng.standard_normal(int(SR * d)), 250 + 180 * i, 700 + 300 * i) * (0.6 + 0.4 * np.sin(2 * np.pi * (2.1 + i * 0.7) * T(d) + i)) for i in range(4)) * k
def birds(d):
    y = np.zeros(int(SR * d))
    for k in range(int(d * 3)):
        f0 = rng.uniform(2500, 4200); t = T(0.12); add(y, np.sin(2 * np.pi * np.cumsum(f0 + 1500 * np.sin(2 * np.pi * 18 * t)) / SR) * env(0.12, 0.005, 25), rng.uniform(0, d - 0.2))
    return y
def place(x, a, b, g):
    i, j = int(a * SR), int(min(b, DUR) * SR); y = x[:j - i].copy(); f = int(0.25 * SR); y[:f] *= np.linspace(0, 1, f); y[-f:] *= np.linspace(1, 0, f); amb[i:i + len(y)] += y * g
place(wind(1.9) + crickets(1.9), 0.0, 1.9, 0.5)
place(drips(1.7) + crackle(1.7), 1.6, 3.3, 0.5)
place(wind(13.2) + crickets(13.2), 3.1, 16.3, 0.5)
place(wind(2.2) * 1.3, 16.1, 18.3, 0.45)
place(drips(8.6) + crackle(8.6), 18.1, 26.7, 0.5)
place(crowd(7.4, 0.6) + birds(7.4), 26.6, 34.0, 0.45)
place(wind(5.6) + crickets(5.6), 33.8, 39.4, 0.45)
place(drips(7.7) + crackle(7.7), 39.2, 46.95, 0.5)
place(wind(6.6) * 1.4, 46.8, 53.4, 0.5)
place(birds(2.4) + wind(2.4) * 0.4, 53.2, 55.6, 0.5)
place(drips(4.3) + crackle(4.3), 55.4, DUR, 0.5)

# ---------------- SFX events ----------------
lib = {n: rd(f"{SFXD}/{n}.wav") for n in ["whoosh", "swing", "pop", "tick", "impact", "glass", "ding", "sparkle", "slash", "click", "riser", "stamp", "roll", "sand", "draw", "chime", "lock"]}
def flap(d=0.6):
    y = np.zeros(int(SR * d))
    for k in range(int(d * 7)): add(y, bp(rng.standard_normal(int(SR * 0.09)), 200, 1800) * env(0.09, 0.01, 30), k / 7)
    return y
def bleat(): t = T(0.7); f = 420 * (1 + 0.06 * np.sin(2 * np.pi * 7 * t)); x = 2 * ((np.cumsum(f) / SR) % 1) - 1; return bp(x, 400, 2800) * (0.5 + 0.5 * np.sin(2 * np.pi * 7 * t)) * np.minimum(1, t / 0.05) * np.minimum(1, (0.7 - t) / 0.2)
def gallop(d=1.8):
    y = np.zeros(int(SR * d)); t = 0.0
    while t < d - 0.1:
        for o in (0, 0.09, 0.18): add(y, tom(38, 0.08) + bp(rng.standard_normal(int(SR * 0.08)), 800, 4000) * env(0.08, 0.0005, 80) * 0.5, t + o)
        t += 0.36
    return y
def steps(d=2.0):
    y = np.zeros(int(SR * d)); t = 0.0
    while t < d - 0.1: add(y, tom(36, 0.1) * 0.8 + bp(rng.standard_normal(int(SR * 0.1)), 300, 2500) * env(0.1, 0.001, 60) * 0.4, t); t += 0.5
    return y
def creak(): t = T(0.8); f = 140 + 60 * np.sin(2 * np.pi * 3 * t); x = 2 * ((np.cumsum(f) / SR) % 1) - 1; return bp(x, 300, 2500) * (0.6 + 0.4 * np.sin(2 * np.pi * 23 * t)) * np.sin(np.pi * t / 0.8)
def toll(): t = T(2.0); return (np.sin(2 * np.pi * 98 * t) + 0.6 * np.sin(2 * np.pi * 98 * 2.4 * t) * np.exp(-t * 2) + 0.3 * np.sin(2 * np.pi * 98 * 3.9 * t) * np.exp(-t * 4)) * env(2.0, 0.003, 1.6)
def rewind(): t = T(0.6); f = 1800 * np.exp(-t * 3) + 200; return (np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3 + bp(rng.standard_normal(len(t)), 500, 5000) * 0.6) * np.sin(np.pi * t / 0.6)
def slam(): y = kick(0.5) * 1.0; n = bp(rng.standard_normal(int(SR * 0.3)), 150, 3000) * env(0.3, 0.0008, 18); y[:len(n)] += n; return y
def ticks(d, n): y = np.zeros(int(SR * d)); [add(y, lib["tick"], d * (i / n) ** 1.6, 0.8) for i in range(n)]; return y
lib.update(flap=flap(), bleat=bleat(), gallop=gallop(), steps=steps(), creak=creak(), toll=toll(), rewind=rewind(), slam=slam())
lib["ticks"] = ticks(1.5, 14)
cuts = json.load(open(CUTS)); ev = []
for c in cuts["cuts"]: ev.append((c - 2 / 30, "whoosh" if c in cuts["stages"] else "swing", -3 if c in cuts["stages"] else -5))
for p in cuts["pops"]: ev.append((p + 0.02, "pop" if int(p * 10) % 2 == 0 else "tick", -6))
ev += [(0.0, "flap", -2), (0.35, "bleat", -6), (0.8, "flap", -4), (1.9, "draw", -6), (2.45, "draw", -6),  # goat at the lens, quill
       (9.42, "slam", -2), (10.0, "gallop", -3),                                                        # door slams, riders gallop
       (12.17, "slam", 0), (13.0, "slam", -2), (13.6, "sparkle", -6), (14.4, "riser", -6), (15.1, "flap", -2),  # robbery, devil, goat flies
       (16.2, "steps", -4), (19.09, "creak", -3), (24.62, "creak", -3), (25.7, "ticks", -6),            # judges, wheel, 9 cards
       (29.6, "impact", -6), (32.85, "toll", 0), (33.95, "rewind", -2), (37.06, "bleat", -6), (37.95, "flap", -2),  # arrest, bell, dream
       (42.5, "creak", -2), (44.0, "glass", -6), (45.1, "flap", -8),                                     # pain, loot, puppet goat
       (48.64, "ticks", -4), (51.2, "ticks", -6), (54.14, "bleat", -2), (55.6, "riser", -8), (57.3, "sparkle", -8), (57.83, "stamp", -4), (58.38, "slash", -2)]
sfx = np.zeros(N)
for t, n, db in ev: add(sfx, lib[n] / (np.abs(lib[n]).max() + 1e-9) * 0.7, max(0, t), 10 ** (db / 20))
ev.sort()
json.dump([{"t": round(t, 3), "sfx": n, "db": db} for t, n, db in ev], open(f"{OUT}/sfx-events.json", "w"), indent=0)
wr(f"{OUT}/music012.wav", mus / np.abs(mus).max() * 0.8); wr(f"{OUT}/amb012.wav", amb / np.abs(amb).max() * 0.8); wr(f"{OUT}/sfx012.wav", sfx / np.abs(sfx).max() * 0.8)
n_all = len(ev); first3 = sum(1 for t, _, _ in ev if t < 3); last10 = sum(1 for t, _, _ in ev if t >= DUR - 10)
print(f"{n_all} sfx ({n_all / DUR * 60:.1f}/min), first 3 s: {first3}, last 10 s: {last10}")
assert 53 <= n_all / DUR * 60 <= 105 and first3 >= 5 and last10 >= 12, "sfx density outside the channel rules"
