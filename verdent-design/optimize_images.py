"""Redimensiona e comprime os PNGs do app para tamanhos adequados a mobile.

Os icones sao exibidos em ~148px (CSS), entao 320px cobre telas 2x com folga.
Sem esse passo, cada icone tinha 1024x1024 (~1.4MB) e o total passava de 210MB,
o que inviabiliza o APK e trava o carregamento no celular.
"""
import os
from PIL import Image

BASE = os.path.join(os.path.dirname(__file__), "..", "www", "assets", "images")
WORDS_DIR = os.path.join(BASE, "words")

# arquivo -> maior dimensao alvo
SINGLES = {
    "mascot-sabi-owl.png": 256,
    "stone-node-glow.png": 256,
    "hero-night-sky-background.png": 1080,
}
WORD_TARGET = 320


def optimize(path, target):
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    if max(w, h) > target:
        scale = target / max(w, h)
        im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)

    # Quantiza preservando alpha (FASTOCTREE aceita RGBA) -> reduz muito o peso
    quant = im.quantize(colors=192, method=Image.FASTOCTREE)
    before = os.path.getsize(path)
    quant.save(path, format="PNG", optimize=True)
    after = os.path.getsize(path)
    return before, after


total_before = 0
total_after = 0

for name, target in SINGLES.items():
    p = os.path.join(BASE, name)
    if os.path.exists(p):
        b, a = optimize(p, target)
        total_before += b
        total_after += a
        print(f"{name}: {b/1024:.0f}KB -> {a/1024:.0f}KB")

count = 0
for name in sorted(os.listdir(WORDS_DIR)):
    if not name.lower().endswith(".png"):
        continue
    b, a = optimize(os.path.join(WORDS_DIR, name), WORD_TARGET)
    total_before += b
    total_after += a
    count += 1

print(f"\nicones processados: {count}")
print(f"total antes: {total_before/1024/1024:.1f} MB")
print(f"total depois: {total_after/1024/1024:.1f} MB")
