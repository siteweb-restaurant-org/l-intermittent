"""Extract photos from Instagram screenshots into public/img (run once)."""
import os, sys
from PIL import Image, ImageFilter

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'img')
os.makedirs(OUT, exist_ok=True)

# grid screenshots: file -> (col separators, row separators)
GRIDS = {
    1: ([22, 304, 586, 867, 1149, 1431], [17, 394, 769]),
    3: ([20, 302, 584, 865, 1147, 1429], [3, 379, 754]),
    4: ([40, 322, 604, 885, 1167, 1449], [-1, 374, 749]),
    5: ([51, 333, 615, 896, 1178, 1460], [14, 390, 766]),
    6: ([57, 339, 621, 902, 1184, 1466], [5, 380, 756]),
    7: ([57, 339, 621, 902, 1184, 1466], [3, 378, 754]),
    8: ([43, 325, 607, 888, 1170, 1452], [8, 384, 759]),
    9: ([59, 341, 623, 904, 1186, 1468], [10, 386, 761]),
}
TILES = [
    (1, 0, 0, 'barman-terrasse'), (1, 0, 1, 'beignets'), (1, 0, 2, 'terrasse-vue'),
    (1, 0, 4, 'risotto-asperges'), (1, 1, 0, 'cocktail-rose'), (1, 1, 1, 'terrasse-tablee'),
    (1, 1, 2, 'barmaid'), (1, 1, 4, 'saumon-oseille'),
    (3, 0, 0, 'champagne'), (3, 0, 1, 'facade-jour'), (3, 0, 2, 'barman'),
    (3, 0, 4, 'poulpe-marbre'), (3, 1, 0, 'burrata'), (3, 1, 1, 'patron-terrasse'),
    (3, 1, 2, 'homard'), (3, 1, 3, 'moelleux'),
    (4, 0, 0, 'salle-velours'), (4, 0, 2, 'moscow-mule'), (4, 1, 1, 'fenetre-terrasse'),
    (4, 1, 2, 'poulpe'), (4, 1, 3, 'cocktail-passion'),
    (5, 0, 0, 'planche'), (5, 0, 2, 'canard-confit'), (5, 0, 3, 'salle-noire'),
    (5, 1, 0, 'chef-cuisine'), (5, 1, 1, 'boeuf-tranche'), (5, 1, 2, 'irish-coffee'),
    (5, 1, 3, 'espresso-martini'), (5, 1, 4, 'huitres-panier'),
    (6, 0, 0, 'salle-orange'), (6, 0, 2, 'veranda'), (6, 0, 3, 'barman-bar'),
    (6, 1, 1, 'cocktail-nuit'), (6, 1, 2, 'escargots'), (6, 1, 4, 'plateau-crevettes'),
    (7, 0, 2, 'gravlax'), (7, 0, 3, 'profiteroles'), (7, 1, 1, 'patron-bar'),
    (7, 1, 2, 'filet-poivre'), (7, 1, 3, 'vins'), (7, 1, 4, 'croquettes'),
    (8, 0, 0, 'os-moelle'), (8, 0, 2, 'huitres'), (8, 0, 4, 'creme-brulee'),
    (8, 1, 0, 'store'), (8, 1, 1, 'charcuterie'), (8, 1, 2, 'mer-vin'),
    (8, 1, 3, 'gravlax-main'), (8, 1, 4, 'bouteille'),
    (9, 0, 0, 'hote'), (9, 0, 1, 'agneau-7h'), (9, 0, 2, 'dorade'), (9, 0, 3, 'salle-bleue'),
    (9, 1, 0, 'milanaise'), (9, 1, 1, 'cocktail-soleil'), (9, 1, 2, 'etal-mer'), (9, 1, 3, 'vin-rouge'),
]
# free crops: file -> (box, name)
BOXES = [
    (11, (30, 0, 660, 325), 'facade-nuit'),
    (12, (70, 25, 725, 450), 'salle-bar'),
    (20, (12, 10, 496, 505), 'ribs'),
    (23, (26, 75, 534, 710), 'canard-vin'),
    (25, (42, 0, 550, 500), 'gambas'),
    (27, (22, 0, 528, 540), 'cabillaud'),
    (29, (54, 0, 470, 524), 'carre-agneau'),
    (32, (40, 0, 545, 640), 'filet-girolles'),
    (33, (54, 22, 544, 731), 'burger'),
    (34, (32, 0, 520, 470), 'paleron'),
    (35, (22, 0, 531, 670), 'poisson-vierge'),
    (36, (16, 0, 526, 650), 'pavlova'),
    (38, (58, 0, 561, 640), 'linguine-homard'),
    (39, (0, 0, 510, 628), 'penne'),
    (40, (32, 48, 542, 762), 'risotto-truffe'),
    (42, (58, 0, 565, 540), 'ravioli'),
    (45, (20, 78, 523, 677), 'cotes-agneau'),
]

def save(img, name):
    # 2x Lanczos + light unsharp so tiles hold up on retina screens
    img = img.convert('RGB')
    img = img.resize((img.width * 2, img.height * 2), Image.LANCZOS)
    img = img.filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))
    img.save(os.path.join(OUT, name + '.jpg'), quality=84, optimize=True, progressive=True)

# extra trims (left, top, right, bottom) to drop Instagram reel icons / UI overlays
TRIM = {name: (0, 34, 0, 0) for name in
        ['cocktail-soleil', 'escargots', 'etal-mer', 'facade-jour', 'homard', 'irish-coffee', 'patron-bar']}
TRIM['saumon-oseille'] = (0, 0, 0, 56)

for f, r, c, name in TILES:
    cols, rows = GRIDS[f]
    l, t, rr, b = TRIM.get(name, (0, 0, 0, 0))
    box = (cols[c] + 2 + l, rows[r] + 2 + t, cols[c + 1] - 1 - rr, rows[r + 1] - 1 - b)
    save(Image.open(os.path.join(SRC, f'{f}.png')).crop(box), name)
for f, box, name in BOXES:
    save(Image.open(os.path.join(SRC, f'{f}.png')).crop(box), name)
print(len(TILES) + len(BOXES), 'images')
