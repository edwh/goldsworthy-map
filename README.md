# Andy Goldsworthy in Britain

A map of Andy Goldsworthy's permanent works in Britain: the Cumbrian sheepfolds, the
Striding Arches, Hanging Stones, the Yorkshire Sculpture Park trail and others.

**Live map:** https://edwh.github.io/goldsworthy-map/

Tap a place for photos, directions and a button to mark it visited. The visited list is
kept in your browser's local storage, so it stays on the device you used and is never
sent anywhere. Each place has a link of the form `#tilberthwaite-touchstone-fold`.

## Data

`data/sites.json` holds every place. Positions come from three sources, in this order of
accuracy:

1. Sheepfolds: the OS grid references on the project's own list
   (sheepfoldscumbria.co.uk), converted to WGS84 with `scripts/osgb.mjs`.
2. The geotags on Wikimedia Commons photos of the work.
3. Hand placement. Anything not from (1) is marked approximate.

Temporary and ephemeral works are left out. Corrections are welcome as issues or PRs.

## Photos

Photos are loaded from Wikimedia Commons, and only files with a free licence (CC BY,
CC BY-SA, CC0, FAL or public domain) are used. Most are Geograph photos under
CC BY-SA 2.0. Each photo is credited in the page with its author and licence and links
to its Commons page. The photos are not covered by this repository's licence.

## Rebuilding the data

```
node scripts/sites.mjs        # site list with converted grid references
node scripts/cat.mjs > scripts/work/cat.txt   # Commons category listing
node scripts/photos.mjs       # Commons photos near each site
node scripts/info.mjs         # licence and location for candidate photos
node scripts/curate.mjs       # merge into data/sites.json
```

`scripts/sites.mjs` and `scripts/info.mjs` write to `scripts/work/`. The photo choices
in `scripts/curate.mjs` were checked by hand.

## Licence

Code and data: MIT. Map tiles and data © OpenStreetMap contributors.
