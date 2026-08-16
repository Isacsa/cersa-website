#!/usr/bin/env python3
"""Gera os assets do logo a partir dos originais em cersa-logo/.

Os ficheiros de origem são PNG sem canal alpha, com o fundo (branco ou
preto) queimado na imagem e a tinta a ocupar 14-26% da tela. Servidos
como estão, o fundo branco desenharia um retângulo claro sobre o
#F7F6F3 do site.

Este script recupera a transparência a partir da luminância, recorta ao
conteúdo e reduz para as dimensões de exibição. Re-executável: se os
originais mudarem, corre outra vez.

    python3 tools/build-logo.py
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "cersa-logo"
OUT = ROOT / "assets"

# Alinhados com as variáveis do styles.css, para o logo assentar na
# mesma tinta que o texto à volta em vez de um preto puro destoante.
INK = (19, 20, 21)  # --ink        #131415
DARK_INK = (242, 241, 238)  # --dark-ink   #F2F1EE
BG = (247, 246, 243)  # --bg         #F7F6F3
DARK_BG = (14, 15, 16)  # --dark-bg    #0E0F10

# Abaixo de ~2% trata-se de ruído do fundo, não de bordo real.
ALPHA_FLOOR = 5


def to_transparent(path, ink_color):
    """Recorta o fundo liso por luminância e devolve RGBA recortado ao conteúdo.

    Um pixel de bordo é uma mistura entre tinta e fundo. Resolvendo a
    cobertura a partir da luminância, as bordas suaves passam a alpha
    parcial e o logo compõe correctamente sobre qualquer fundo.
    """
    im = Image.open(path).convert("RGB")
    gray = im.convert("L")
    w, h = gray.size
    px = gray.load()

    # O fundo é o que está na moldura exterior.
    edge = []
    for x in range(0, w, 5):
        edge += [px[x, 1], px[x, h - 2]]
    for y in range(0, h, 5):
        edge += [px[1, y], px[w - 2, y]]
    bg_luma = sum(edge) / len(edge)

    lo, hi = gray.getextrema()
    ink_luma = lo if bg_luma > 127 else hi
    span = ink_luma - bg_luma
    if abs(span) < 20:
        raise SystemExit(f"{path.name}: contraste insuficiente para separar o fundo")

    # LUT luminância -> alpha, evita percorrer 1,5M de pixéis em Python.
    #
    # O piso é essencial: o fundo varia 1-2 níveis, o que sem ele produz
    # alpha residual não-nulo em toda a tela. getbbox() passa a devolver
    # a imagem inteira e o recorte não corta nada -- o logo acabava a
    # ocupar menos de metade da altura do ficheiro.
    lut = []
    for v in range(256):
        a = round(max(0.0, min(1.0, (v - bg_luma) / span)) * 255)
        lut.append(0 if a <= ALPHA_FLOOR else a)
    alpha = gray.point(lut)

    out = Image.new("RGBA", im.size, ink_color + (0,))
    out.putalpha(alpha)

    bbox = alpha.getbbox()
    if bbox is None:
        raise SystemExit(f"{path.name}: nada sobrou depois do recorte")
    if (bbox[2] - bbox[0]) > w * 0.95 and (bbox[3] - bbox[1]) > h * 0.95:
        raise SystemExit(f"{path.name}: recorte não cortou nada, piso de alpha baixo demais")
    return out.crop(bbox)


def flatten(im, color):
    """Reafirma uma cor de tinta chapada, preservando o alpha.

    O resample do Pillow trabalha em alpha pré-multiplicado; ao
    desmultiplicar, as zonas de alpha quase nulo ficam com RGB errático
    (chega a dar (0,42,42) a partir de uma imagem de cor única). São
    pixéis invisíveis, mas repor a cor evita ruído e comprime melhor.
    """
    out = Image.new("RGBA", im.size, color + (0,))
    out.putalpha(im.getchannel("A"))
    return out


def recolor(im, color):
    """Mesma silhueta, tinta diferente."""
    return flatten(im, color)


def fit_height(im, height, color):
    w = max(1, round(im.width * height / im.height))
    return flatten(im.resize((w, height), Image.LANCZOS), color)


def square_icon(mark, size, bg, ink, margin=0.18):
    """Marca centrada num quadrado sólido.

    Fundo sólido de propósito: um favicon transparente desaparece contra
    barras de separadores escuras.
    """
    inner = round(size * (1 - 2 * margin))
    scaled = fit_height(mark, min(inner, round(inner * mark.height / mark.width)), ink)
    canvas = Image.new("RGBA", (size, size), bg + (255,))
    canvas.alpha_composite(
        scaled, ((size - scaled.width) // 2, (size - scaled.height) // 2)
    )
    return canvas


def load_font(size):
    for p in (
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
    ):
        if Path(p).exists():
            try:
                return ImageFont.truetype(p, size)
            except OSError:
                pass
    return None


def og_cover(lockup, path):
    """Cartão 1200x630 para partilhas no LinkedIn, WhatsApp e afins."""
    W, H = 1200, 630
    card = Image.new("RGBA", (W, H), BG + (255,))
    logo = fit_height(lockup, 132, INK)
    card.alpha_composite(logo, ((W - logo.width) // 2, 218))

    font = load_font(30)
    if font:
        text = "Software & Inteligência Artificial — Portugal"
        d = ImageDraw.Draw(card)
        tw = d.textbbox((0, 0), text, font=font)[2]
        d.text(((W - tw) // 2, 398), text, font=font, fill=(82, 82, 79))

    card.convert("RGB").save(path, "PNG", optimize=True)
    return card


def main():
    OUT.mkdir(exist_ok=True)

    # Ambas as variantes saem do MESMO original, só com tinta diferente.
    # As versões brancas de origem têm a arte com extensões ligeiramente
    # distintas (365px contra 359px de largura depois do recorte), o que
    # daria proporções diferentes para a mesma marca. Recolorir a partir
    # de uma só origem garante formas idênticas.
    lockup = to_transparent(SRC / "cersalogolettersblack.png", INK)
    lockup_light = recolor(lockup, DARK_INK)
    mark_light = recolor(to_transparent(SRC / "cersalogoblack.png", INK), DARK_INK)

    written = []

    def save(im, name):
        p = OUT / name
        im.save(p, "PNG", optimize=True)
        written.append((name, im.width, im.height, p.stat().st_size))

    # 96px de altura cobre exibição até 32px em ecrãs 3x.
    save(fit_height(lockup, 96, INK), "cersa-logo.png")
    save(fit_height(lockup_light, 96, DARK_INK), "cersa-logo-white.png")

    # Margem menor a 32px: no separador do browser a legibilidade vale
    # mais do que o ar à volta.
    save(square_icon(mark_light, 32, INK, DARK_INK, margin=0.10), "favicon-32.png")
    save(square_icon(mark_light, 180, INK, DARK_INK), "apple-touch-icon-180.png")
    save(square_icon(mark_light, 512, INK, DARK_INK), "icon-512.png")

    og_cover(lockup, OUT / "og-cover.png")
    p = OUT / "og-cover.png"
    written.append(("og-cover.png", 1200, 630, p.stat().st_size))

    for name, w, h, size in written:
        print(f"  {name:26} {w:>4}x{h:<4} {size / 1024:>7.1f} KB")


if __name__ == "__main__":
    main()
