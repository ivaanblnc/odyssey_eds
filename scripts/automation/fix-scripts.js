const fs = require('fs');

// Fix migrate-parents.js
let mp = fs.readFileSync('scripts/automation/migrate-parents.js', 'utf8');
mp = mp.replace(/\.png/g, '.jpg');
mp = mp.replace(/<h2>/g, '<h1>').replace(/<\/h2>/g, '</h1>');
fs.writeFileSync('scripts/automation/migrate-parents.js', mp);

// Fix migrate-fleet-parents.js
let mfp = fs.readFileSync('scripts/automation/migrate-fleet-parents.js', 'utf8');
mfp = mfp.replace(/\.png/g, '.jpg');
mfp = mfp.replace(/<h2>/g, '<h1>').replace(/<\/h2>/g, '</h1>');

// Fix the swapped fields in migrate-fleet-parents.js
mfp = mfp.replace(
  /"destinationLabel": fleetParents\[key\]\.hero\.destLabel,\s+"destinationValue": fleetParents\[key\]\.hero\.destVal,\s+"departureLabel": fleetParents\[key\]\.hero\.routesLabel,\s+"departureValue": fleetParents\[key\]\.hero\.routesVal,\s+"returnLabel": fleetParents\[key\]\.hero\.depLabel,\s+"returnValue": fleetParents\[key\]\.hero\.depVal,\s+"guestsLabel": fleetParents\[key\]\.hero\.guestLabel,\s+"guestsValue": fleetParents\[key\]\.hero\.guestVal/g,
  `"destinationLabel": fleetParents[key].hero.destLabel,
    "destinationValue": fleetParents[key].hero.destVal,
    "departureLabel": fleetParents[key].hero.routesLabel,
    "departureValue": fleetParents[key].hero.routesVal,
    "returnLabel": fleetParents[key].hero.depLabel,
    "returnValue": fleetParents[key].hero.depVal,
    "guestsLabel": fleetParents[key].hero.guestLabel,
    "guestsValue": fleetParents[key].hero.guestVal`
);
fs.writeFileSync('scripts/automation/migrate-fleet-parents.js', mfp);

// Fix generate-destinations-content.js (the cards part)
let gdc = fs.readFileSync('scripts/automation/generate-destinations-content.js', 'utf8');
// To add variety to cards, we will assign a random image from our pool for each card.
// We will do this by injecting a random image logic instead of using child.image.
