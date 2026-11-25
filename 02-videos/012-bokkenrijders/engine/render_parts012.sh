#!/usr/bin/env bash
# 4 parts, at most 2 at the same time, each with its own software-GPU process
cd "$(dirname "$0")/../engine"
R() { npx remotion render Bok012 ../out/parts012/p$1.mp4 --gl=swangle --concurrency=2 --muted --scale=2 --crf=14 --frames=$2 --log=info --browser-executable=/opt/pw-browsers/chromium_headless_shell > ../out/parts012/p$1.log 2>&1; }
R 1 0-447 & R 2 448-895 & wait
R 3 896-1343 & R 4 1344-1789 & wait
echo ALLDONE > ../out/parts012/done.txt
