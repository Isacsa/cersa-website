#!/usr/bin/env bash
# Rebusca os woff2 do Google Fonts para assets/fonts/.
#
# Só o subset latin: cobre todo o português e os sinais usados na página.
# Só os pesos em uso -- Archivo 400/500 e IBM Plex Mono 400. Se acrescentares
# um font-weight ao CSS, acrescenta-o aqui e corre outra vez, senão o browser
# sintetiza o peso e o texto sai deformado.
#
# Depois de correr, confirma que o unicode-range no @font-face do styles.css
# ainda bate certo com o que o Google devolve.
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p assets/fonts

UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
URL="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500&family=IBM+Plex+Mono:wght@400&display=swap"

curl -sS -A "$UA" "$URL" | python3 -c '
import re, sys, urllib.request, pathlib
css = sys.stdin.read()
out = pathlib.Path("assets/fonts")
for name, block in re.findall(r"/\* (\S+) \*/\s*@font-face \{(.*?)\}", css, re.S):
    if name != "latin":
        continue
    fam = re.search(r"font-family: .([^\x27]+).", block).group(1)
    wt  = re.search(r"font-weight: (\d+)", block).group(1)
    url = re.search(r"url\((https://[^)]+\.woff2)\)", block).group(1)
    dest = out / (fam.lower().replace(" ", "-") + "-" + wt + ".woff2")
    urllib.request.urlretrieve(url, dest)
    print(f"  {dest.name:28} {dest.stat().st_size/1024:>6.1f} KB")
'
