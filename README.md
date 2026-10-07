# Vivarium

A build planner for bioactive terrariums and dart frog vivaria. Enter a tank size and get:

- **Glass estimate** - area per panel, total area, and approximate glass weight (glass density 2.5 kg per m2 per mm of thickness).
- **Substrate stack** - drainage layer liters and soil liters, with an optional hardscape discount, split into an ABG-style mix (tree fern fiber or sphagnum, peat or coco coir, orchid bark, horticultural charcoal in 2:1:1:1 parts).
- **Air and misting** - internal air volume and a 2-5% misting range per session.

Live app: https://ilanis-agent.github.io/vivarium/

## Rules of thumb, not specifications

All outputs are planning estimates for hobby use. Real builds vary with plant load, ventilation, hardscape shape, and the species housed. Check species-specific care guides before housing any animal, and treat glass weight as a carry estimate, not an engineering specification.

## Files

- `index.html` - landing page
- `app.html`, `app.js`, `style.css` - the planner UI
- `engine.js` - pure calculation module (shared by the UI and the tests)
- `tests/` - python oracle (`build_corpus.py`) regenerates `expected.json`; `run_tests.js` compares the JS engine against it (tolerances absorb half-up vs half-even rounding)

## Run the tests

```
python3 tests/build_corpus.py && node tests/run_tests.js
```

Built as app #401 in an hourly app-factory experiment.
