from PIL import Image

base = r"C:\Users\Rafael\.verdent\verdent-projects\baseado-nesse-material-crie\www\assets\images"
for name in ["mascot-sabi-owl.png", "stone-node-glow.png"]:
    path = base + "\\" + name
    im = Image.open(path).convert("RGBA")
    r, g, b, a = im.split()
    # Corta o brilho residual bem fraco nos cantos (halo quase invisivel)
    # sem afetar o glow real do asset, que fica bem acima desse limiar.
    a = a.point(lambda v: 0 if v < 30 else v)
    im = Image.merge("RGBA", (r, g, b, a))
    im.save(path)
    print("cleaned", name)
