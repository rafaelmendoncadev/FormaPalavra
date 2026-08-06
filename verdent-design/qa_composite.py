from PIL import Image

base = r"C:\Users\Rafael\.verdent\verdent-projects\baseado-nesse-material-crie\www\assets\images"
bg = Image.open(base + r"\hero-night-sky-background.png").convert("RGBA")
stone = Image.open(base + r"\stone-node-glow.png").convert("RGBA")
mascot = Image.open(base + r"\mascot-sabi-owl.png").convert("RGBA")

canvas = bg.resize((480, 720)).copy()
s = stone.resize((150, 150))
m = mascot.resize((120, 120))

canvas.alpha_composite(s, (70, 540))
canvas.alpha_composite(s, (260, 420))
canvas.alpha_composite(s, (70, 300))
canvas.alpha_composite(m, (190, 460))

out = r"C:\Users\Rafael\.verdent\verdent-projects\baseado-nesse-material-crie\verdent-design\qa-composite-preview.png"
canvas.convert("RGB").save(out)
print("saved", out)
