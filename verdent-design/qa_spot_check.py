from PIL import Image
import random, os

d = os.path.join(os.path.dirname(__file__), "..", "www", "assets", "images", "words")
files = sorted(os.listdir(d))
random.seed(42)
sample = random.sample(files, 10)
for f in sample:
    im = Image.open(os.path.join(d, f)).convert("RGBA")
    w, h = im.size
    corner = im.getpixel((2, 2))
    center = im.getpixel((w // 2, h // 2))
    print(f, w, h, "corner_alpha=", corner[3], "center_alpha=", center[3])

print("total files:", len(files))
