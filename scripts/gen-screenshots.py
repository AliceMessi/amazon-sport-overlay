"""Generate faithful TV UI mock screenshots for amazon-sport-overlay.
Replicates LiveSportsScreen styles (colors, layout) at 1920x1080.
"""
from PIL import Image, ImageDraw, ImageFont
import os

OUT = r"C:\Users\User\Downloads\agentprize\projects\amazon-sport-overlay\docs\screenshots"
os.makedirs(OUT, exist_ok=True)

W, H = 1920, 1080
BG = (7, 17, 31)
CARD = (13, 29, 47)
CARD_SEL = (18, 42, 64)
ACCENT = (85, 230, 193)
TEXT = (247, 250, 252)
MUTED = (142, 164, 184)
LIVE = (255, 107, 134)
BORDER = (32, 59, 85)

def font(size, bold=False):
    # DejaVu ships with PIL / Windows fallback to arial
    candidates = []
    if bold:
        candidates = ["C:/Windows/Fonts/arialbd.ttf", "C:/Windows/Fonts/arial.ttf"]
    else:
        candidates = ["C:/Windows/Fonts/arial.ttf"]
    for p in candidates:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

F = {
    "eyebrow": font(22, True),
    "title": font(44, True),
    "badge": font(18, True),
    "filter": font(24, True),
    "section": font(28, True),
    "count": font(18, True),
    "comp": font(17, True),
    "status": font(17, True),
    "team": font(26, False),
    "score": font(26, True),
    "detail_title": font(38, True),
    "detail_score": font(72, True),
    "detail_body": font(24, False),
    "hint": font(20, False),
}

MATCHES = [
    {"comp": "SERIE A", "status": "LIVE", "live": True, "home": "Inter", "away": "Milan", "score": "1 — 1", "sub": "67'  ·  San Siro", "sport": "football"},
    {"comp": "LBA", "status": "LIVE", "live": True, "home": "Olimpia Milano", "away": "Virtus Bologna", "score": "74 — 69", "sub": "Q3 04:12  ·  Mediolanum Forum", "sport": "basketball"},
    {"comp": "FORMULA 1", "status": "LIVE", "live": True, "home": "Verstappen", "away": "Leclerc", "score": "P1 — P2", "sub": "Lap 42/58", "sport": "formula1"},
    {"comp": "NBA", "status": "LIVE", "live": True, "home": "Lakers", "away": "Warriors", "score": "98 — 95", "sub": "Q4 02:41", "sport": "basketball"},
    {"comp": "UEFA CHAMPIONS LEAGUE", "status": "UPCOMING", "live": False, "home": "Real Madrid", "away": "PSG", "score": "20:00", "sub": "Santiago Bernabeu", "sport": "football"},
]

FILTERS = ["All", "Football", "Basket", "Formula 1"]

def rounded(draw, xy, r, fill, outline=None, width=1):
    draw.rounded_rectangle(xy, r, fill=fill, outline=outline, width=width)

def draw_header(d):
    d.text((96, 48), "SPORT COMPANION", font=F["eyebrow"], fill=ACCENT)
    d.text((96, 80), "All your sports, at a glance", font=F["title"], fill=TEXT)
    # demo badge
    rounded(d, [1620, 56, 1824, 104], 24, fill=(16, 36, 58), outline=(28, 58, 85), width=2)
    d.ellipse([1640, 74, 1656, 90], fill=(255, 77, 109))
    d.text((1666, 72), "DEMO FEED", font=F["badge"], fill=(184, 199, 217))

def draw_filters(d, active="All"):
    x = 96
    for f in FILTERS:
        is_act = (f == active)
        w = 190 if len(f) < 8 else 230
        fill = ACCENT if is_act else (16, 36, 58)
        txt = (7, 17, 31) if is_act else (184, 199, 217)
        outline = TEXT if is_act else (41, 68, 93)
        rounded(d, [x, 200, x + w, 258], 16, fill=fill, outline=outline, width=3)
        d.text((x + 32, 214), f, font=F["filter"], fill=txt)
        x += w + 16

def draw_cards(d, matches, selected_idx=0):
    y = 330
    for i, m in enumerate(matches):
        sel = (i == selected_idx)
        fill = CARD_SEL if sel else CARD
        outline = ACCENT if sel else BORDER
        rounded(d, [96, y, 1080, y + 128], 20, fill=fill, outline=outline, width=3 if sel else 2)
        d.text((128, y + 14), m["comp"], font=F["comp"], fill=MUTED)
        d.text((960, y + 14), m["status"], font=F["status"], fill=LIVE if m["live"] else MUTED)
        d.text((128, y + 44), m["home"], font=F["team"], fill=TEXT)
        d.text((920, y + 44), m["score"], font=F["score"], fill=TEXT)
        d.text((128, y + 82), m["away"], font=F["team"], fill=TEXT)
        d.text((880, y + 84), m["sub"], font=F["comp"], fill=MUTED)
        y += 146

def draw_detail(d, m, note="Use arrows to move, OK to select."):
    rounded(d, [1120, 330, 1824, 990], 28, fill=CARD, outline=BORDER, width=2)
    d.text((1168, 366), m["comp"] + "  ·  " + m["sport"].upper(), font=F["comp"], fill=MUTED)
    d.text((1168, 420), "SELECTED MATCH", font=F["comp"], fill=ACCENT)
    title = f'{m["home"]} vs {m["away"]}'
    d.text((1168, 456), title[:30], font=F["detail_title"], fill=TEXT)
    d.text((1168, 520), m["score"], font=F["detail_score"], fill=TEXT)
    d.line([1168, 640, 1776, 640], fill=BORDER, width=2)
    d.text((1168, 664), m["sub"], font=F["detail_body"], fill=(231, 238, 245))
    d.text((1168, 704), "Live companion panel, no video needed.", font=F["detail_body"], fill=MUTED)
    rounded(d, [1168, 830, 1776, 942], 18, fill=(16, 36, 58))
    d.text((1196, 852), "REMOTE CONTROLS", font=F["comp"], fill=ACCENT)
    d.text((1196, 884), note, font=F["hint"], fill=(184, 199, 217))

def draw_section(d, count):
    d.text((96, 282), "Live & upcoming", font=F["section"], fill=TEXT)
    d.text((940, 290), f"{count} EVENTS", font=F["count"], fill=(113, 134, 155))

def shot(name, active, indices, sel, detail_idx, note="Use arrows to move, OK to select."):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    draw_header(d)
    draw_filters(d, active)
    ms = [MATCHES[i] for i in indices]
    draw_section(d, len(ms))
    draw_cards(d, ms, sel)
    draw_detail(d, MATCHES[detail_idx], note)
    # footer
    d.text((96, 1010), "Sport Overlay for Fire TV  ·  Expo + React Native TV  ·  D-pad native", font=F["comp"], fill=(113, 134, 155))
    img.save(os.path.join(OUT, name))
    print("saved", name)

shot("01-home-all.png", "All", [0, 1, 2, 3], 0, 0)
shot("02-football-filter.png", "Football", [0, 4], 0, 0, "Filter: Football — 2 events.")
shot("03-basketball-filter.png", "Basket", [1, 3], 1, 3, "Filter: Basket — card focus updates panel.")
shot("04-formula1-detail.png", "Formula 1", [2], 0, 2, "Filter: Formula 1 — P1/P2 duel, Lap 42/58.")
shot("05-dpad-navigation.png", "All", [0, 1, 2, 3], 1, 1, "D-pad focus = selection. OK confirms.")

# 06 — match overlay over "video": dark stadium gradient bg + score bug + bottom bar
img = Image.new("RGB", (W, H), (4, 10, 18))
d = ImageDraw.Draw(img)
for y in range(H):
    t = y / H
    d.line([(0, y), (W, y)], fill=(int(4 + 10 * t), int(14 + 22 * t), int(24 + 30 * t)))
d.ellipse([500, 180, 1420, 900], outline=(28, 70, 60), width=6)  # pitch hint
d.line([(960, 120), (960, 960)], fill=(28, 70, 60), width=4)
d.text((96, 48), "● LIVE  ·  SERIE A", font=F["eyebrow"], fill=(255, 107, 134))
rounded(d, [96, 100, 760, 180], 14, fill=(7, 17, 31), outline=(85, 230, 193), width=3)
d.text((128, 118), "Inter  1 — 1  Milan   ·   67'", font=F["score"], fill=TEXT)
rounded(d, [96, 880, 1824, 990], 16, fill=(7, 17, 31))
d.text((128, 896), "Derby equilibrato nel secondo tempo  ·  San Siro", font=F["detail_body"], fill=TEXT)
d.text((96, 1010), "Match overlay demo  ·  video + score bug  ·  Hide info / Back (D-pad OK)", font=F["comp"], fill=(113, 134, 155))
img.save(os.path.join(OUT, "06-match-overlay.png"))
print("saved 06-match-overlay.png")

# 07 — YouTube overlay: red player bar hint + score bug + bottom bar
img = Image.new("RGB", (W, H), (10, 10, 12))
d = ImageDraw.Draw(img)
for y in range(H):
    t = y / H
    d.line([(0, y), (W, y)], fill=(int(10 + 14 * t), int(12 + 16 * t), int(16 + 22 * t)))
d.ellipse([500, 180, 1420, 900], outline=(60, 60, 70), width=5)
d.line([(960, 120), (960, 960)], fill=(60, 60, 70), width=4)
d.polygon([(900, 470), (900, 610), (1020, 540)], fill=(200, 30, 30))  # play hint
d.text((96, 48), "● HIGHLIGHTS  ·  YOUTUBE EMBED", font=F["eyebrow"], fill=(255, 90, 90))
rounded(d, [96, 100, 820, 180], 14, fill=(7, 17, 31), outline=(85, 230, 193), width=3)
d.text((128, 118), "Inter  1 — 2  Milan   ·   FT'", font=F["score"], fill=TEXT)
rounded(d, [96, 880, 1824, 990], 16, fill=(7, 17, 31))
d.text((128, 896), "Pulisic strikes in Milan derby win  ·  Serie A", font=F["detail_body"], fill=TEXT)
d.text((96, 1010), "YouTube overlay demo  ·  WebView embed + score bug  ·  Hide info / Back", font=F["comp"], fill=(113, 134, 155))
img.save(os.path.join(OUT, "07-youtube-overlay.png"))
print("saved 07-youtube-overlay.png")

# 08 — phone column layout (portrait): filters, 2 cards, detail panel, watch button, version footer
PW, PH = 720, 1280
pimg = Image.new("RGB", (PW, PH), BG)
p = ImageDraw.Draw(pimg)
p.text((40, 36), "SPORT COMPANION", font=font(20, True), fill=ACCENT)
p.text((40, 64), "All your sports,", font=font(34, True), fill=TEXT)
p.text((40, 108), "at a glance", font=font(34, True), fill=TEXT)
fx = 40
for f in ["All", "Football", "Basket", "F1"]:
    is_act = (f == "All")
    w = 130 if len(f) < 7 else 170
    rounded(p, [fx, 180, fx + w, 232], 14, fill=ACCENT if is_act else (16, 36, 58),
            outline=TEXT if is_act else (41, 68, 93), width=3)
    p.text((fx + 26, 192), f, font=font(22, True), fill=(7, 17, 31) if is_act else (184, 199, 217))
    fx += w + 12
p.text((40, 256), "Live & upcoming", font=font(26, True), fill=TEXT)
p.text((540, 264), "5 EVENTS", font=font(16, True), fill=(113, 134, 155))
cy = 300
for m in [MATCHES[0], MATCHES[1]]:
    rounded(p, [40, cy, 680, cy + 118], 18, fill=CARD_SEL if m == MATCHES[0] else CARD,
            outline=ACCENT if m == MATCHES[0] else BORDER, width=3 if m == MATCHES[0] else 2)
    p.text((64, cy + 10), m["comp"], font=font(16, True), fill=MUTED)
    p.text((580, cy + 10), m["status"], font=font(16, True), fill=LIVE if m["live"] else MUTED)
    p.text((64, cy + 36), m["home"], font=font(24, False), fill=TEXT)
    p.text((520, cy + 36), m["score"], font=font(24, True), fill=TEXT)
    p.text((64, cy + 74), m["away"], font=font(24, False), fill=TEXT)
    cy += 132
rounded(p, [40, cy + 8, 680, cy + 420], 24, fill=CARD, outline=BORDER, width=2)
p.text((72, cy + 28), "SELECTED MATCH", font=font(16, True), fill=ACCENT)
p.text((72, cy + 56), "Inter vs Milan", font=font(32, True), fill=TEXT)
p.text((72, cy + 108), "1 — 1", font=font(56, True), fill=TEXT)
p.text((72, cy + 190), "67'  ·  San Siro", font=font(22, False), fill=(231, 238, 245))
rounded(p, [72, cy + 240, 648, cy + 308], 14, fill=ACCENT, outline=TEXT, width=2)
p.text((220, cy + 258), "Watch with overlay", font=font(24, True), fill=(7, 17, 31))
p.text((200, cy + 340), "Sport Overlay v0.2 · phone layout", font=font(16, True), fill=(113, 134, 155))
p.text((40, 1216), "scroll ↓ filters · cards · detail · watch", font=font(16, True), fill=(113, 134, 155))
pimg.save(os.path.join(OUT, "08-phone-layout.png"))
print("saved 08-phone-layout.png")
