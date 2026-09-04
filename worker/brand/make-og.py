#!/usr/bin/env python3
"""Build brand/og.png -- the 1200x630 card link previews show.

The card is the masthead: the mark, the wordmark, the line under it, and the
board's own progress bar with the orange on-pace tick, because that bar is the
thing the product actually is.

Run:  pip install pillow && python3 brand/make-og.py
Then fold the bytes into src/assets.js (see "Brand assets" in HANDOFF.md).

Fonts are the two the page loads, downloaded next to this script into fonts/:
  Archivo 800 semi-expanded  https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@112,800
  Public Sans 400            https://fonts.googleapis.com/css2?family=Public+Sans:wght@400
  IBM Plex Mono 400          https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400
Grab the .ttf each stylesheet points at. Without them the script falls back to
DejaVu and the card is legible but off-brand.
"""
import os, sys
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.environ.get('OG_FONTS', os.path.join(HERE, 'fonts'))
OUT = os.path.join(HERE, 'og.png')

W, H = 1200, 630
NAVY = (11, 17, 48)            # #0B1130, the icon's own background
INK = (255, 255, 255)
INK_2 = (162, 174, 200)        # #A2AEC8
INK_3 = (119, 131, 158)        # #77839E
BLAZE = (242, 133, 79)         # #F2854F -- on-pace, the one status colour
LANE = [(0.00, (34, 211, 238)),   # #22D3EE
        (0.48, (76, 125, 247)),   # #4C7DF7
        (1.00, (124, 92, 255))]   # #7C5CFF


def font(name, size, fallback='DejaVuSans.ttf'):
    path = os.path.join(FONTS, name)
    if os.path.exists(path):
        return ImageFont.truetype(path, size)
    print('  ! %s missing, falling back to %s' % (name, fallback), file=sys.stderr)
    return ImageFont.truetype('/usr/share/fonts/truetype/dejavu/' + fallback, size)


def lane_at(t):
    """The lane gradient sampled at 0..1, matching the SVG's three stops."""
    t = max(0.0, min(1.0, t))
    for i in range(len(LANE) - 1):
        p0, c0 = LANE[i]
        p1, c1 = LANE[i + 1]
        if p0 <= t <= p1:
            k = 0 if p1 == p0 else (t - p0) / (p1 - p0)
            return tuple(round(c0[j] + (c1[j] - c0[j]) * k) for j in range(3))
    return LANE[-1][1]


def lane_image(w, h, skew=0.55):
    """A horizontal sweep of the lane gradient, tilted like the SVG's."""
    img = Image.new('RGB', (max(1, w), max(1, h)))
    px = img.load()
    for x in range(img.width):
        for y in range(img.height):
            t = (x + (y - img.height / 2) * skew) / max(1, img.width)
            px[x, y] = lane_at(t)
    return img


def gradient_text(base, xy, text, fnt):
    """Draw text filled with the lane gradient. Returns its advance width."""
    box = ImageDraw.Draw(base).textbbox((0, 0), text, font=fnt)
    w, h = box[2] + 8, box[3] + 8
    mask = Image.new('L', (w, h), 0)
    ImageDraw.Draw(mask).text((0, 0), text, font=fnt, fill=255)
    base.paste(lane_image(w, h), (xy[0], xy[1]), mask)
    return ImageDraw.Draw(base).textlength(text, font=fnt)


def fit(name, text, target, hi=120, fallback='DejaVuSans-Bold.ttf'):
    """Largest size at which text still fits target px."""
    probe = ImageDraw.Draw(Image.new('RGB', (1, 1)))
    size = hi
    while size > 12:
        f = font(name, size, fallback)
        if probe.textlength(text, font=f) <= target:
            return f
        size -= 1
    return font(name, 12, fallback)


def build():
    card = Image.new('RGB', (W, H), NAVY)
    d = ImageDraw.Draw(card)

    # A whisper of the lane across the top edge, so the card is not flat navy.
    card.paste(lane_image(W, 6), (0, 0))

    pad = 76
    inner = W - pad * 2

    # Masthead order, same as the page: mark, then wordmark, then the line.
    icon_px, gap = 150, 30
    icon_path = os.path.join(HERE, 'icon-512.png')
    text_x = pad
    if os.path.exists(icon_path):
        icon = Image.open(icon_path).convert('RGBA').resize((icon_px, icon_px), Image.LANCZOS)
        card.paste(icon, (pad, 146), icon)
        text_x = pad + icon_px + gap

    avail = W - pad - text_x
    wm = fit('archivo-800-semiexp.ttf', 'SEPTEMBERMILES.com', avail, hi=104)
    suffix_size = max(14, int(wm.size * 0.40))
    suffix = font('archivo-800-semiexp.ttf', suffix_size, 'DejaVuSans-Bold.ttf')

    y = 164
    d.text((text_x, y), 'SEPTEMBER', font=wm, fill=INK)
    x = text_x + d.textlength('SEPTEMBER', font=wm)
    x += gradient_text(card, (int(x), y), 'MILES', wm)
    d = ImageDraw.Draw(card)
    d.text((x + 6, y + wm.size - suffix_size + 4), '.com', font=suffix, fill=INK_3)

    # The line under it, hung off the wordmark like the masthead's tagline.
    body = font('publicsans-400.ttf', 32)
    d.text((text_x, y + wm.size + 34), "Everyone's own 100 miles in September.", font=body, fill=INK_2)
    d.text((text_x, y + wm.size + 78), 'Same month, same goal, one board.', font=body, fill=INK_2)

    # The board's own bar: gradient fill, quarter ticks, orange on-pace mark.
    bx, by, bh = pad, H - 140, 18
    bw = inner
    d.rounded_rectangle([bx, by, bx + bw, by + bh], radius=3, fill=(24, 33, 61))
    fill_w = int(bw * 0.62)
    mask = Image.new('L', (fill_w, bh), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, fill_w - 1, bh - 1], radius=3, fill=255)
    # Sample across the whole track, so a colour means a position on the goal.
    card.paste(lane_image(bw, bh, skew=0.0).crop((0, 0, fill_w, bh)), (bx, by), mask)
    d = ImageDraw.Draw(card)
    for q in (0.25, 0.5, 0.75):
        tx = bx + int(bw * q)
        d.line([(tx, by), (tx, by + bh)], fill=(36, 48, 82), width=1)
    px = bx + int(bw * 0.55)
    d.rounded_rectangle([px - 1, by - 6, px + 2, by + bh + 6], radius=2, fill=BLAZE)

    mono = font('plexmono-400.ttf', 20, 'DejaVuSansMono.ttf')
    d.text((bx, by + bh + 24), 'orange line = on-pace', font=mono, fill=INK_3)
    right = 'septembermiles.com'
    d.text((bx + bw - d.textlength(right, font=mono), by + bh + 24), right, font=mono, fill=INK_3)

    card.save(OUT, 'PNG', optimize=True)
    print('wrote %s (%d bytes)' % (OUT, os.path.getsize(OUT)))


if __name__ == '__main__':
    build()
