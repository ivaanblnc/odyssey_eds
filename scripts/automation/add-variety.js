const fs = require('fs');

const file1 = 'scripts/automation/migrate-parents.js';
let mp = fs.readFileSync(file1, 'utf8');

const replacement1 = `
    const imagePool = [
      '/content/dam/odyssey-eds/varied/mediterraneo_hero.jpg',
      '/content/dam/odyssey-eds/varied/mediterraneo_manifesto.jpg',
      '/content/dam/odyssey-eds/varied/caribe_hero.jpg',
      '/content/dam/odyssey-eds/varied/caribe_manifesto.jpg',
      '/content/dam/odyssey-eds/varied/indico_hero.jpg',
      '/content/dam/odyssey-eds/varied/indico_manifesto.jpg',
      '/content/dam/odyssey-eds/varied/megayates_hero.jpg'
    ];
    
    for (let i = 0; i < childrenData.length; i++) {
      const child = childrenData[i];
      const randomImage = imagePool[i % imagePool.length];
      
      const itemPath = \`\${cardsPath}/item_\${i + 1}\`;
      await updateNode(itemPath, {
        "jcr:primaryType": "nt:unstructured",
        "sling:resourceType": "core/franklin/components/block/v1/block/item",
        "model": "card",
        "image": randomImage,
        "text": \`
        <p>\${destinations[key].hero.title}</p>
        <h3><a href="\${destinations[key].path}/\${child.id}">\${child.name}</a></h3>
        <ul>
          <li>Región: \${child.region}</li>
          <li>Precio: \${child.price}</li>
        </ul>
        <p>Desde / sem.</p>
        <p>\${child.price} / semana</p>
      \`
      });
    }`;

// Regex to replace the cards iteration block in migrate-parents.js
mp = mp.replace(/for\s*\(let i = 0; i < childrenData\.length; i\+\+\)\s*\{[\s\S]*?await updateNode\(itemPath, \{[\s\S]*?\}\);\s*\}/, replacement1);
fs.writeFileSync(file1, mp);

const file2 = 'scripts/automation/migrate-fleet-parents.js';
let mfp = fs.readFileSync(file2, 'utf8');

const replacement2 = `
    const imagePool = [
      '/content/dam/odyssey-eds/varied/mediterraneo_hero.jpg',
      '/content/dam/odyssey-eds/varied/mediterraneo_manifesto.jpg',
      '/content/dam/odyssey-eds/varied/caribe_hero.jpg',
      '/content/dam/odyssey-eds/varied/caribe_manifesto.jpg',
      '/content/dam/odyssey-eds/varied/indico_hero.jpg',
      '/content/dam/odyssey-eds/varied/indico_manifesto.jpg',
      '/content/dam/odyssey-eds/varied/megayates_hero.jpg'
    ];
    
    for (let i = 0; i < childrenNodes.length; i++) {
      const childName = childrenNodes[i];
      const childNode = childrenData[childName];
      const randomImage = imagePool[i % imagePool.length];
      
      // Update cards item
      const itemPath = \`\${cardsPath}/item_\${i + 1}\`;
      await updateNode(itemPath, {
        "jcr:primaryType": "nt:unstructured",
        "sling:resourceType": "core/franklin/components/block/v1/block/item",
        "model": "card",
        "image": randomImage,
        "text": \`
        <p>\${fleetParents[key].hero.title}</p>
        <h3><a href="\${pagePath}/\${childName}">\${childNode.hero ? childNode.hero.title : childName}</a></h3>
        <ul>
          <li>Eslora: 35m</li>
          <li>Huéspedes: 10-12</li>
        </ul>
        <p>Desde / sem.</p>
        <p>65.000 € / semana</p>
      \`
      });
    }`;

mfp = mfp.replace(/for\s*\(let i = 0; i < childrenNodes\.length; i\+\+\)\s*\{[\s\S]*?await updateNode\(itemPath, \{[\s\S]*?\}\);\s*\}/, replacement2);
fs.writeFileSync(file2, mfp);
