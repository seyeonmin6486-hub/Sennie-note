"""센니 노트 앱 아이콘 PNG 생성 (192 / 512 / maskable 512 / apple-touch 180)."""
import math

from PIL import Image, ImageDraw

S = 1024  # 작업 해상도


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def gradient_bg(size, top, bottom):
    img = Image.new("RGB", (1, size))
    d = ImageDraw.Draw(img)
    for y in range(size):
        d.point((0, y), lerp(top, bottom, y / max(1, size - 1)))
    return img.resize((size, size), Image.BICUBIC)


def rounded_mask(size, radius):
    m = Image.new("L", (size, size), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    return m


def leaf(d, cx, cy, length, width, angle_deg, fill):
    a = math.radians(angle_deg)
    dx, dy = math.cos(a), math.sin(a)
    px, py = -dy, dx
    pts = []
    for sign in (1, -1):
        rng = range(41) if sign == 1 else range(40, -1, -1)
        for i in rng:
            t = i / 40
            bx = cx + dx * length * (t - 0.5)
            by = cy + dy * length * (t - 0.5)
            off = width * 0.5 * math.sin(math.pi * t) ** 0.75
            pts.append((bx + px * off * sign, by + py * off * sign))
    d.polygon(pts, fill=fill)


def draw_icon(scale_content=1.0, rounded=True):
    """scale_content: 1.0 = 기본, 0.82 = maskable 안전 영역."""
    bg = gradient_bg(S, (203, 129, 92), (166, 92, 60)).convert("RGBA")
    layer = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)

    if scale_content != 1.0:
        # 콘텐츠를 축소해 중앙 배치
        inner = draw_icon(1.0, rounded=False).crop((0, 0, S, S))
        inner = inner.resize((int(S * scale_content), int(S * scale_content)), Image.LANCZOS)
        off = (S - inner.width) // 2
        base = Image.new("RGBA", (S, S), (0, 0, 0, 0))
        base.alpha_composite(inner, (off, off))
        # 배경은 꽉 차게 유지
        out = bg.copy()
        out.alpha_composite(base)
        return out

    # 페이지
    d.rounded_rectangle([252, 208, 772, 816], radius=84, fill=(255, 253, 249))
    d.rounded_rectangle([252, 208, 772, 816], radius=84, outline=(0, 0, 0, 0))
    # 제본 밴드
    d.rounded_rectangle([252, 208, 330, 816], radius=39, fill=(239, 223, 207))
    d.rectangle([300, 208, 330, 816], fill=(239, 223, 207))
    # 링
    for cy in (340, 512, 684):
        d.ellipse([288, cy - 16, 320, cy + 16], fill=(201, 158, 124))
    # 텍스트 라인
    d.rounded_rectangle([408, 356, 700, 392], radius=18, fill=(58, 51, 43))
    d.rounded_rectangle([408, 444, 632, 480], radius=18, fill=(58, 51, 43))
    d.rounded_rectangle([408, 544, 700, 572], radius=14, fill=(198, 185, 168))
    d.rounded_rectangle([408, 608, 600, 636], radius=14, fill=(198, 185, 168))
    # 잎
    leaf(d, 716, 668, 118, 76, -78, (110, 143, 107))
    d.line([716, 728, 716, 660], fill=(110, 143, 107), width=11)

    out = bg.copy()
    out.alpha_composite(layer)
    if rounded:
        out.putalpha(rounded_mask(S, 232))
    return out


base = draw_icon(1.0, rounded=False)
for name, size, kw in [
    ("icon-512", 512, {}),
    ("icon-192", 192, {}),
    ("icon-maskable-512", 512, {}),
    ("apple-touch-icon", 180, {}),
]:
    src = draw_icon(0.80, rounded=False) if name == "icon-maskable-512" else base
    src.resize((size, size), Image.LANCZOS).convert("RGB").save(f"icons/{name}.png", "PNG", optimize=True)
print("icons written")
