const fs = require('fs');
let mp = fs.readFileSync('scripts/automation/migrate-parents.js', 'utf8');

mp = mp.replace(
  /"eyebrow": manifesto\.eyebrow \|\| 'LA EXPERIENCIA',\s*"headline": manifesto\.text\.split\('<\/p>'\)\[0\] \? manifesto\.text\.split\('<\/p>'\)\[0\] \+ '<\/p>' : '',\s*"leftCol": manifesto\.text\.split\('<\/p>'\)\[1\] \? manifesto\.text\.split\('<\/p>'\)\[1\] \+ '<\/p>' : '',\s*"rightCol": `<p><picture><img src="\$\{manifesto\.image\}" alt="Manifesto Image"><\/picture><\/p>`/g,
  `"eyebrow": manifesto.eyebrow,
    "headline": manifesto.headline,
    "leftCol": manifesto.leftCol,
    "rightCol": manifesto.rightCol`
);

mp = mp.replace(
  /"eyebrow": manifesto\.eyebrow \|\| 'LA EXPERIENCIA',\s*"headline": manifesto\.text\.split\('<\/p>'\)\[0\] \? manifesto\.text\.split\('<\/p>'\)\[0\] \+ '<\/p>' : '',\s*"leftCol": manifesto\.text,\s*"rightCol": `<p><picture><img src="\$\{manifesto\.image\}" alt="Manifesto Image"><\/picture><\/p>`/g,
  `"eyebrow": manifesto.eyebrow,
    "headline": manifesto.headline,
    "leftCol": manifesto.leftCol,
    "rightCol": manifesto.rightCol`
);

fs.writeFileSync('scripts/automation/migrate-parents.js', mp);
