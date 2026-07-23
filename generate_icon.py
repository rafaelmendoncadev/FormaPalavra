from PIL import Image, ImageDraw, ImageFont
import os

# Resolve a pasta de recursos do Android relativa a este script para que o
# projeto possa ser movido sem quebrar. Estrutura esperada:
#   <projeto>/generate_icon.py
#   <projeto>/android/app/src/main/res/
base = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'android', 'app', 'src', 'main', 'res')

ORANGE = (255, 140, 0, 255)
ORANGE_LIGHT = (255, 200, 50, 255)
WHITE = (255, 255, 255, 245)
TRANSPARENT = (0, 0, 0, 0)

# Tamanhos em px para o ícone legado (legacy). O Capacitor gera esses
# mipmaps com densities padrão: mdpi=1x, hdpi=1.5x, xhdpi=2x, etc.
legacy_sizes = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192,
}

# Adaptive icon foreground é sempre 108dp; safe zone central é 72dp.
# Convertendo dp -> px por density: divide por 160 e multiplica pela
# density (mdpi=1, hdpi=1.5, xhdpi=2, xxhdpi=3, xxxhdpi=4).
fg_sizes = {
    'mipmap-mdpi': 108,
    'mipmap-hdpi': 162,
    'mipmap-xhdpi': 216,
    'mipmap-xxhdpi': 324,
    'mipmap-xxxhdpi': 432,
}

syllables = ['BA', 'BE', 'BI', 'BO', 'BU']
text_colors = [(0, 150, 255), (50, 200, 50), (255, 80, 80), (200, 50, 200), (255, 165, 0)]


def make_legacy_icon():
    """Ícone legacy: círculo laranja com balão de fala branco + texto colorido."""
    size = 1024
    img = Image.new('RGBA', (size, size), TRANSPARENT)
    draw = ImageDraw.Draw(img)
    # Fundo circular laranja (cobre os cantos do PNG quadrado)
    draw.ellipse([0, 0, size, size], fill=ORANGE)
    draw.ellipse([size // 8, size // 8, size * 7 // 8, size * 7 // 8], fill=ORANGE_LIGHT)
    # Balão de fala
    draw.rounded_rectangle(
        [size // 6, size // 4, size * 5 // 6, size * 3 // 4],
        radius=40,
        fill=WHITE,
    )
    # Rabicho do balão
    draw.polygon(
        [
            (size * 5 // 6, size * 3 // 4),
            (size * 5 // 6 + 30, size * 3 // 4 + 40),
            (size * 5 // 6 - 30, size * 3 // 4),
        ],
        fill=WHITE,
    )
    # Texto (BA BE BI BO BU) colorido dentro do balão
    try:
        font = ImageFont.truetype('arial.ttf', 180)
    except OSError:
        font = ImageFont.load_default()
    y_start = size // 3
    for i, (syl, col) in enumerate(zip(syllables, text_colors)):
        x = size // 4 + (i % 3) * (size // 4)
        y = y_start + (i // 3) * (size // 5)
        draw.text((x, y), syl, fill=col + (255,), font=font)
    return img


def make_foreground_icon(canvas_px):
    """Adaptive icon foreground: só o balão branco + texto em fundo
    transparente. Quem pinta o fundo é a cor definida em
    values/ic_launcher_background.xml (que a gente troca pra laranja).
    Canvas deve ser 108dp na density alvo; o conteúdo fica dentro do safe
    zone de 72dp centralizado pra não ser cortado por máscaras do launcher
    (redondo, squircle, etc.)."""
    img = Image.new('RGBA', (canvas_px, canvas_px), TRANSPARENT)
    draw = ImageDraw.Draw(img)
    # Safe zone de 72dp = 72/108 do canvas
    safe = int(canvas_px * 72 / 108)
    # Balão ocupa ~88% do safe zone pra deixar uma folga visual
    bubble_w = int(safe * 0.88)
    bubble_h = int(safe * 0.74)
    cx, cy = canvas_px // 2, canvas_px // 2
    bl = cx - bubble_w // 2
    bt = cy - bubble_h // 2 - int(safe * 0.05)  # levemente acima do centro
    br = bl + bubble_w
    bb = bt + bubble_h
    radius = max(8, int(bubble_w * 0.08))
    draw.rounded_rectangle([bl, bt, br, bb], radius=radius, fill=WHITE)
    # Rabicho do balão (no canto inferior direito)
    draw.polygon(
        [
            (br - int(bubble_w * 0.10), bb),
            (br, bb + int(safe * 0.10)),
            (br - int(bubble_w * 0.22), bb),
        ],
        fill=WHITE,
    )
    # Texto
    try:
        font = ImageFont.truetype('arial.ttf', int(bubble_w * 0.18))
    except OSError:
        font = ImageFont.load_default()
    cols = 3
    cell_w = bubble_w // cols
    text_y_start = bt + int(bubble_h * 0.10)
    for i, (syl, col) in enumerate(zip(syllables, text_colors)):
        col_idx = i % cols
        row_idx = i // cols
        x = bl + col_idx * cell_w + int(cell_w * 0.12)
        y = text_y_start + row_idx * int(bubble_h * 0.42)
        draw.text((x, y), syl, fill=col + (255,), font=font)
    return img


def main():
    # 1. Ícone legacy
    legacy = make_legacy_icon()
    for folder, sz in legacy_sizes.items():
        folder_path = os.path.join(base, folder)
        if os.path.exists(folder_path):
            resized = legacy.resize((sz, sz), Image.LANCZOS)
            resized.save(os.path.join(folder_path, 'ic_launcher.png'), 'PNG')
            resized.save(os.path.join(folder_path, 'ic_launcher_round.png'), 'PNG')
            print(f'  legacy {folder}: {sz}x{sz}')

    # 2. Adaptive icon foreground (uma versão por density)
    for folder, sz in fg_sizes.items():
        folder_path = os.path.join(base, folder)
        if os.path.exists(folder_path):
            fg = make_foreground_icon(sz)
            fg.save(os.path.join(folder_path, 'ic_launcher_foreground.png'), 'PNG')
            print(f'  foreground {folder}: {sz}x{sz}')

    print('Done!')


if __name__ == '__main__':
    main()
