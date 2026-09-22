# L'Intermittent

Site vitrine et parcours de réservation (maquette) pour L'Intermittent, brasserie au 87 av. Jean-Baptiste Clément, Boulogne-Billancourt.

- `index.html` — accueil (enseigne, la maison, signatures, une journée, soirées match, réservation rapide, accès)
- `carte.html` — la carte complète et la carte des vins
- `reserver.html` — réservation en 4 étapes (maquette : rien n'est envoyé)

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # sortie dans dist/
```

Stack : Vite (multi-pages), GSAP + ScrollTrigger, Lenis. En-tête/pied de page partagés via `partials/`.
Photos : extraites des publications Instagram du restaurant (`scripts/crop.py`), à remplacer par les originaux.
