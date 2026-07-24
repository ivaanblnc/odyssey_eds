import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const AEM_HOST = process.env.AEM_HOST;
const AEM_ACCESS_TOKEN = process.env.AEM_ACCESS_TOKEN;

if (!AEM_HOST || !AEM_ACCESS_TOKEN) {
  console.error("Missing AEM_HOST or AEM_ACCESS_TOKEN in .env");
  process.exit(1);
}

// Fleet parent pages metadata
const fleetParents = {
  megayates: {
    path: '/content/odyssey-eds/flota/megayates',
    hero: {
      image: '/content/dam/odyssey-eds/varied/megayates_hero.jpg',
      imageAlt: 'Megayates',
      eyebrow: 'FLOTA ODYSSEY',
      title: 'Megayates',
      content: 'El epítome del lujo y la sofisticación en el mar. Espacios inmensos, comodidades de clase mundial y tripulación de élite a tu entera disposición.',
      destLabel: 'Yates', destVal: '5',
      routesLabel: 'Categoría', routesVal: 'Megayates',
      depLabel: 'Eslora media', depVal: '35m+',
      guestLabel: 'Experiencia', guestVal: 'Top Tier'
    },
    manifesto: {
      image: '/content/dam/odyssey-eds/varied/indico_manifesto.jpg',
      eyebrow: '01 — Sin Límites',
      headline: '<h1>Lujo a Gran Escala</h1>',
      leftCol: '<p>Nuestros megayates están diseñados para quienes no aceptan compromisos. Con spas a bordo, cines privados y un equipo de profesionales dedicados, el océano es tu terreno de juego exclusivo.</p>',
      rightCol: '<p><picture><img src="/content/dam/odyssey-eds/varied/indico_manifesto.jpg" alt="Megayates"></picture></p>'
    }
  },
  catamaranes: {
    path: '/content/odyssey-eds/flota/catamaranes',
    hero: {
      image: '/content/dam/odyssey-eds/varied/caribe_hero.jpg',
      imageAlt: 'Catamaranes',
      eyebrow: 'FLOTA ODYSSEY',
      title: 'Catamaranes',
      content: 'Estabilidad insuperable y amplitud que desafía los estándares. La elección perfecta para familias o grupos grandes que buscan confort absoluto.',
      destLabel: 'Yates', destVal: '4',
      routesLabel: 'Categoría', routesVal: 'Catamaranes',
      depLabel: 'Eslora media', depVal: '20m+',
      guestLabel: 'Experiencia', guestVal: 'Espacio y Confort'
    },
    manifesto: {
      image: '/content/dam/odyssey-eds/varied/mediterraneo_manifesto.jpg',
      eyebrow: '02 — Equilibrio Perfecto',
      headline: '<h1>El Doble de Espacio</h1>',
      leftCol: '<p>Gracias a su diseño de doble casco, los catamaranes ofrecen zonas comunes inmensas y una navegación fluida, permitiéndote acercarte más a la costa y descubrir calas ocultas.</p>',
      rightCol: '<p><picture><img src="/content/dam/odyssey-eds/varied/mediterraneo_manifesto.jpg" alt="Catamaranes"></picture></p>'
    }
  },
  deportivos: {
    path: '/content/odyssey-eds/flota/deportivos',
    hero: {
      image: '/content/dam/odyssey-eds/varied/mediterraneo_hero.jpg',
      imageAlt: 'Yates Deportivos',
      eyebrow: 'FLOTA ODYSSEY',
      title: 'Yates Deportivos',
      content: 'Velocidad, adrenalina y un diseño vanguardista. Llega a tu próximo destino más rápido sin renunciar al máximo lujo.',
      destLabel: 'Yates', destVal: '3',
      routesLabel: 'Categoría', routesVal: 'Deportivos',
      depLabel: 'Velocidad media', depVal: '40 nudos',
      guestLabel: 'Experiencia', guestVal: 'Velocidad'
    },
    manifesto: {
      image: '/content/dam/odyssey-eds/varied/caribe_manifesto.jpg',
      eyebrow: '03 — Adrenalina Pura',
      headline: '<h1>Diseño y Velocidad</h1>',
      leftCol: '<p>Siente la potencia bajo tus pies mientras cruzas el mar a velocidades asombrosas. Diseño aerodinámico y motores rugientes para espíritus aventureros.</p>',
      rightCol: '<p><picture><img src="/content/dam/odyssey-eds/varied/caribe_manifesto.jpg" alt="Deportivos"></picture></p>'
    }
  },
  clasicos: {
    path: '/content/odyssey-eds/flota/clasicos',
    hero: {
      image: '/content/dam/odyssey-eds/varied/indico_hero.jpg',
      imageAlt: 'Yates Clásicos',
      eyebrow: 'FLOTA ODYSSEY',
      title: 'Yates Clásicos',
      content: 'La elegancia atemporal de la navegación tradicional. Descubre el encanto romántico de los yates clásicos restaurados con las comodidades modernas.',
      destLabel: 'Yates', destVal: '1',
      routesLabel: 'Categoría', routesVal: 'Clásicos',
      depLabel: 'Estilo', depVal: 'Vintage',
      guestLabel: 'Experiencia', guestVal: 'Historia'
    },
    manifesto: {
      image: '/content/dam/odyssey-eds/varied/caribe_hero.jpg',
      eyebrow: '04 — Elegancia Atemporal',
      headline: '<h1>Historia en Movimiento</h1>',
      leftCol: '<p>Navega a bordo de auténticas piezas de museo flotantes. Maderas nobles, latón pulido y una historia fascinante en cada milla recorrida.</p>',
      rightCol: '<p><picture><img src="/content/dam/odyssey-eds/varied/caribe_hero.jpg" alt="Clasicos"></picture></p>'
    }
  }
};

const authHeader = `Bearer ${AEM_ACCESS_TOKEN}`;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function updateNode(nodePath, data) {
  const url = `${AEM_HOST}${nodePath}`;
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else {
      params.append(key, value);
    }
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: params.toString(),
    });

    if (response.ok || response.status === 200 || response.status === 201) {
      console.log(`[SUCCESS] Updated properties at: ${nodePath}`);
    } else {
      console.error(`[ERROR] Failed to update ${nodePath}. Status: ${response.status}`);
      const text = await response.text();
      console.error(text.substring(0, 200));
    }
  } catch (error) {
    console.error(`[NETWORK ERROR] Could not reach AEM at ${url}:`, error.message);
  }
}

async function run() {
  console.log("=============================================");
  console.log("🚀 Starting AEM Fleet Parents Migration");
  console.log(`🌐 Target AEM: ${AEM_HOST}`);
  console.log("=============================================");

  // Read yachts data
  const inputFile = path.join(__dirname, 'yachts-content.json');
  const yachtsData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

  // Group yachts by category
  const yachtsByCategory = {
    megayates: [],
    catamaranes: [],
    deportivos: [],
    clasicos: []
  };

  for (const [yachtPath, data] of Object.entries(yachtsData)) {
    const parts = yachtPath.split('/');
    const category = parts[2];
    const id = parts[3];
    
    // Extract name
    const headerTitleHtml = data.section?.yacht_header_1?.title || data.section?.['yacht-header_1']?.title || `<h1>${id}</h1>`;
    const name = headerTitleHtml.replace(/<[^>]+>/g, '');
    
    // Extract price
    const price = data.section?.yacht_header_1?.price || data.section?.['yacht-header_1']?.price || 'Consultar';
    
    // Extract specs
    const specsHtml = data.section_1?.yacht_specs_0?.specs || data.section_1?.['yacht-specs_0']?.specs || '';
    
    let length = '30m';
    let guests = '12';
    
    // Parse specs for Eslora and Huéspedes
    const esloraMatch = specsHtml.match(/<td>Eslora<\/td>\s*<td>([^<]+)<\/td>/i);
    if (esloraMatch) length = esloraMatch[1];
    
    const guestsMatch = specsHtml.match(/<td>Huéspedes<\/td>\s*<td>([^<]+)<\/td>/i);
    if (guestsMatch) guests = guestsMatch[1];

    if (yachtsByCategory[category]) {
      yachtsByCategory[category].push({
        id,
        name,
        price,
        length,
        guests
      });
    }
  }

  // Iterate over categories to update parents
  for (const [category, children] of Object.entries(yachtsByCategory)) {
    const parentData = fleetParents[category];
    if (!parentData) continue;

    const pagePath = parentData.path;
    console.log(`\nMigrating content for: ${pagePath}`);

    // 1. Hero Block
    const heroPath = `${pagePath}/jcr:content/root/section/hero_1`;
    await updateNode(heroPath, {
      "jcr:primaryType": "nt:unstructured",
      "sling:resourceType": "core/franklin/components/block/v1/block",
      "name": "hero",
      "model": "hero",
      "modelFields": [
        "image@reference",
        "imageAlt@text",
        "eyebrow@text",
        "text@richtext",
        "destinationLabel@text",
        "destinationValue@text",
        "routesLabel@text",
        "routesValue@text",
        "departureLabel@text",
        "departureValue@text",
        "guestsLabel@text",
        "guestsValue@text"
      ],
      "image": parentData.hero.image,
      "imageAlt": parentData.hero.imageAlt,
      "eyebrow": parentData.hero.eyebrow,
      "text": `<h1>${parentData.hero.title}</h1><p>${parentData.hero.content}</p>`,
      "destinationLabel": parentData.hero.destLabel,
      "destinationValue": parentData.hero.destVal,
      "routesLabel": parentData.hero.routesLabel,
      "routesValue": parentData.hero.routesVal,
      "departureLabel": parentData.hero.depLabel,
      "departureValue": parentData.hero.depVal,
      "guestsLabel": parentData.hero.guestLabel,
      "guestsValue": parentData.hero.guestVal
    });
    await delay(200);

    // 2. Manifesto Block
    const manifestoPath = `${pagePath}/jcr:content/root/section/manifesto_2`;
    await updateNode(manifestoPath, {
      "jcr:primaryType": "nt:unstructured",
      "sling:resourceType": "core/franklin/components/block/v1/block",
      "name": "manifesto",
      "model": "manifesto",
      "modelFields": ["eyebrow@text", "headline@richtext", "leftCol@richtext", "rightCol@richtext", "subtitle@text"],
      "eyebrow": parentData.manifesto.eyebrow,
      "headline": parentData.manifesto.headline,
      "leftCol": parentData.manifesto.leftCol,
      "rightCol": parentData.manifesto.rightCol,
      "subtitle": ""
    });
    await delay(200);

    // 3. Cards Block Container
    const cardsPath = `${pagePath}/jcr:content/root/section/cards_3`;
    await updateNode(cardsPath, {
      "jcr:primaryType": "nt:unstructured",
      "sling:resourceType": "core/franklin/components/block/v1/block",
      "name": "cards",
      "filter": "cards",
      "classes": "fleet"
    });
    await delay(200);

    const imagePool = [
      '/content/dam/odyssey-eds/varied/unique_yacht_1.jpg',
      '/content/dam/odyssey-eds/varied/unique_yacht_2.jpg',
      '/content/dam/odyssey-eds/varied/unique_yacht_3.jpg',
      '/content/dam/odyssey-eds/varied/unique_yacht_4.jpg'
    ];

    // 4. Cards Items
    for (let index = 0; index < children.length; index++) {
      const dest = children[index];
      const destUrl = `${pagePath}/${dest.id}`;
      
      // Fleet cards format uses a list to render specs correctly
      const textHtml = `
        <p>${parentData.hero.title}</p>
        <h3><a href="${destUrl}">${dest.name}</a></h3>
        <ul>
          <li>Eslora: ${dest.length}</li>
          <li>Huéspedes: ${dest.guests}</li>
        </ul>
        <p>Desde / sem.</p>
        <p>${dest.price}</p>
      `;
      
      const imgPath = imagePool[index % imagePool.length];
      
      const itemPath = `${cardsPath}/item_${index + 1}`;
      await updateNode(itemPath, {
        "jcr:primaryType": "nt:unstructured",
        "sling:resourceType": "core/franklin/components/block/v1/block/item",
        "model": "card",
        "modelFields": ["image@reference", "text@richtext"],
        "image": imgPath,
        "text": textHtml
      });
      await delay(100);
    }
  }
  
  console.log("\n✅ Fleet Parent Pages Migration completed successfully!");
}

run();
