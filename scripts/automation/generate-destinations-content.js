import fs from 'fs';
import path from 'path';

const taxonomyPath = path.resolve('./scripts/automation/taxonomy.json');
const taxonomy = JSON.parse(fs.readFileSync(taxonomyPath, 'utf8'));

const outPath = path.resolve('./scripts/automation/destinations-content.json');

const content = {};

// Unsplash images for each destination
const destinationImages = {
  'ibiza': 'https://images.unsplash.com/photo-1533271440058-20cb528247df?q=80&w=2070&auto=format&fit=crop',
  'mallorca': 'https://images.unsplash.com/photo-1520630737402-bc3e6c0c279d?q=80&w=2070&auto=format&fit=crop',
  'costa-del-sol': 'https://images.unsplash.com/photo-1549419131-7e8cddb5e434?q=80&w=2070&auto=format&fit=crop',
  'mykonos': 'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?q=80&w=2070&auto=format&fit=crop',
  'corfu': 'https://images.unsplash.com/photo-1563853153676-4d7a8d3e9112?q=80&w=2070&auto=format&fit=crop',
  'monaco': 'https://images.unsplash.com/photo-1579965416298-b99b50dbba0d?q=80&w=2070&auto=format&fit=crop',
  'costa-amalfina': 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2070&auto=format&fit=crop',
  'cerdena': 'https://images.unsplash.com/photo-1594954714157-e62a1b1fc8bd?q=80&w=2070&auto=format&fit=crop',
  'corcega': 'https://images.unsplash.com/photo-1563330232-5711470ce238?q=80&w=2070&auto=format&fit=crop',
  
  'bahamas': 'https://images.unsplash.com/photo-1548574505-12caf0050b5b?q=80&w=2070&auto=format&fit=crop',
  'islas-virgenes-britanicas': 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=2070&auto=format&fit=crop',
  'san-bartolome': 'https://images.unsplash.com/photo-1566904666324-4f85e5cb1594?q=80&w=2070&auto=format&fit=crop',
  'islas-exumas': 'https://images.unsplash.com/photo-1604169542031-bb698cc25fce?q=80&w=2070&auto=format&fit=crop',

  'maldivas': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2070&auto=format&fit=crop',
  'seychelles': 'https://images.unsplash.com/photo-1588698188168-3351d38890db?q=80&w=2070&auto=format&fit=crop'
};

const destinationStats = {
  'mediterraneo': { rutas: '42', barcos: '128', dias: '07' },
  'caribe': { rutas: '15', barcos: '45', dias: '14' },
  'indico': { rutas: '8', barcos: '12', dias: '10' }
};

function processDestinations(regionName, children) {
  children.forEach(dest => {
    const destPath = `odyssey-eds/destinos/${regionName}/${dest.name}`;
    const img = destinationImages[dest.name] || 'https://images.unsplash.com/photo-1500462006325-17730e23da91?q=80&w=2070&auto=format&fit=crop';
    const stats = destinationStats[regionName] || { rutas: '10', barcos: '20', dias: '07' };
    
    content[destPath] = {
      "section": {
        "hero_1": {
          "jcr:primaryType": "nt:unstructured",
          "sling:resourceType": "core/franklin/components/block/v1/block",
          "name": "hero",
          "model": "hero",
          "modelFields": ["image@reference","imageAlt@text","eyebrow@text","text@richtext","destinationLabel@text","destinationValue@text","departureLabel@text","departureValue@text","returnLabel@text","returnValue@text","guestsLabel@text","guestsValue@text"],
          "image": img,
          "imageAlt": dest.title,
          "eyebrow": "Odyssey Destinations",
          "text": `<h1>${dest.title}</h1><p>Explora aguas cristalinas y paisajes inolvidables en el corazón de ${regionName.toUpperCase()}.</p>`,
          "destinationLabel": "Embarcaciones",
          "destinationValue": stats.barcos,
          "departureLabel": "Rutas",
          "departureValue": stats.rutas,
          "returnLabel": "Días alta",
          "returnValue": stats.dias,
          "classList": "destination"
        },
        "manifesto_2": {
          "jcr:primaryType": "nt:unstructured",
          "sling:resourceType": "core/franklin/components/block/v1/block",
          "name": "manifesto",
          "model": "manifesto",
          "modelFields": ["eyebrow@text","headline@richtext","leftCol@richtext","rightCol@richtext","subtitle@text"],
          "eyebrow": "01 — El Paraíso",
          "headline": `<h2>Descubre ${dest.title}</h2>`,
          "leftCol": `<p>${dest.title} es uno de los destinos más codiciados del mundo para el chárter de yates de lujo. Disfruta de un clima perfecto, gastronomía excepcional y la libertad de navegar a tu propio ritmo.</p>`,
          "rightCol": `<p><a href="/flota">Ver Flota Disponible</a></p><p><img src="${img}" alt="Vista de ${dest.title}" width="100%" style="border-radius:12px;"/></p>`,
          "subtitle": "Curated Charters"
        }
      }
    };
  });
}

const destinos = taxonomy.find(t => t.name === 'destinos');
if (destinos && destinos.children) {
  destinos.children.forEach(region => {
    if (region.children) {
      processDestinations(region.name, region.children);
    }
  });
}

fs.writeFileSync(outPath, JSON.stringify(content, null, 2));
console.log(`Updated destinations content generated for ${Object.keys(content).length} locations!`);
