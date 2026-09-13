#!/usr/bin/env python3
"""MAP-595 · retouch v9's Terminal B 4F map bitmap (record §193).

Input : v9-map-terminal-b-4f-2x.png — the 1808×1688 render of v9's "Mapsicle Map" image
        (Figma get_screenshot of a temporary 1808×1688 frame carrying the same image fill, FILL mode).
        Check-in 3 carries the dashboard's baked selection (light-blue fill + 2px #4071e2 stroke).
Output: four PNGs — clean · sel3 · sel3-hov5 · sel3-5-4 — uploaded with the Figma MCP `upload_assets`
        (multipart POST, `curl -k`) and set as the "Mapsicle Map" fill on ③'s screens.

The dashboard's highlight is a per-channel LINEAR map of the mint band (fitted on the two dominant
colours of Check-in 3 against Check-in 4's): r 1.265x−79.4 · g 1.114x−44.0 · b 0.775x+50.6.
So: inverse-map Check-in 3's interior (keeping the icon and the label), inpaint the stroke and its
corner joins from pixels along the centroid direction, then forward-map the bands a state lights.
Geometry (1× map-body coordinates) is in geometry.json — PCA fits of the stroke and mint pixels.
"""
from PIL import Image
import math, json, sys, os
here = os.path.dirname(os.path.abspath(__file__))
im = Image.open(os.path.join(here, 'v9-map-terminal-b-4f-2x.png')).convert('RGB'); W, H = im.size; S = W / 904.0
geo = json.load(open(os.path.join(here, 'geometry.json')))
P = {k: [(x * S, y * S) for x, y in geo[k]] for k in ('c3', 'c5', 'c4')}
A = {'r': (1.2653, -79.4), 'g': (1.1136, -44.0), 'b': (0.775, 50.6)}
def fwd(p): return tuple(max(0, min(255, round(A[c][0] * v + A[c][1]))) for c, v in zip('rgb', p))
def inv(p): return tuple(max(0, min(255, round((v - A[c][1]) / A[c][0]))) for c, v in zip('rgb', p))
def inside(p, poly):
    x, y = p; n = len(poly); s = None
    for i in range(n):
        x1, y1 = poly[i]; x2, y2 = poly[(i + 1) % n]; c = (x2 - x1) * (y - y1) - (y2 - y1) * (x - x1)
        if c == 0: continue
        if s is None: s = c > 0
        elif (c > 0) != s: return False
    return True
def dist(p, poly):
    x, y = p; best = 1e9; n = len(poly)
    for i in range(n):
        x1, y1 = poly[i]; x2, y2 = poly[(i + 1) % n]; dx, dy = x2 - x1, y2 - y1; L2 = dx * dx + dy * dy
        t = max(0, min(1, ((x - x1) * dx + (y - y1) * dy) / L2)); best = min(best, math.hypot(x - (x1 + t * dx), y - (y1 + t * dy)))
    return best
strokeBlue = lambda p: p[2] > 185 and p[0] < 120 and p[1] < 160        # the selection stroke only
blueish = lambda p: p[2] > p[1] + 15 and p[2] > p[0] + 40                # blue-dominant, never teal
def keep(p):                                                             # the icon, and dark text
    r, g, b = p; return (g > r + 40 and abs(g - b) < 25 and r < 150) or (r + g + b < 400 and not strokeBlue(p))
px = im.load(); base = im.copy(); bp = base.load()
poly = P['c3']; cx = sum(q[0] for q in poly) / 4; cy = sum(q[1] for q in poly) / 4
xs = [q[0] for q in poly]; ys = [q[1] for q in poly]
x0, y0, x1, y1 = int(min(xs) - 14), int(min(ys) - 14), int(max(xs) + 15), int(max(ys) + 15)
band = 5.5; cornerR = 12.0; interior = []; strokepx = []
for x in range(max(0, x0), min(W, x1)):
    for y in range(max(0, y0), min(H, y1)):
        d = dist((x, y), poly); ins = inside((x, y), poly); nearC = any(math.hypot(x - a, y - b) <= cornerR for a, b in poly)
        if d <= band or nearC or (ins and strokeBlue(px[x, y])): strokepx.append((x, y, ins))
        elif ins: interior.append((x, y))
for x, y in interior:
    if not keep(px[x, y]): bp[x, y] = inv(px[x, y])
for x, y, ins in strokepx:
    vx, vy = (cx - x, cy - y) if ins else (x - cx, y - cy); L = math.hypot(vx, vy) or 1; vx /= L; vy /= L; src = None
    for off in (12, 16, 20, 26, 32, 40):
        sx = int(round(x + vx * off)); sy = int(round(y + vy * off))
        if 0 <= sx < W and 0 <= sy < H and not blueish(px[sx, sy]) and not strokeBlue(px[sx, sy]) and dist((sx, sy), poly) > band: src = px[sx, sy]; break
    if src is None: src = (220, 238, 238) if ins else (255, 255, 255)
    bp[x, y] = inv(src) if (ins and not keep(src)) else src
def highlighted(img, polys):
    out = img.copy(); op = out.load(); bpx = img.load()
    for pl in polys:
        xs_ = [q[0] for q in pl]; ys_ = [q[1] for q in pl]
        for x in range(max(0, int(min(xs_)) - 1), min(W, int(max(xs_)) + 2)):
            for y in range(max(0, int(min(ys_)) - 1), min(H, int(max(ys_)) + 2)):
                if inside((x, y), pl) and not keep(bpx[x, y]): op[x, y] = fwd(bpx[x, y])
    return out
outdir = sys.argv[1] if len(sys.argv) > 1 else here
base.save(os.path.join(outdir, 'map2x-clean.png'))
highlighted(base, [P['c3']]).save(os.path.join(outdir, 'map2x-sel3.png'))
highlighted(base, [P['c3'], P['c5']]).save(os.path.join(outdir, 'map2x-sel3-hov5.png'))
highlighted(base, [P['c3'], P['c5'], P['c4']]).save(os.path.join(outdir, 'map2x-sel3-5-4.png'))
bpx = base.load(); left = sum(1 for x in range(x0, x1) for y in range(y0, y1) if strokeBlue(bpx[x, y]))
print('stroke-blue pixels left:', left, '· wrote 4 variants to', outdir)
