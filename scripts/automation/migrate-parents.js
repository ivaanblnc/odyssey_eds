import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const AEM_HOST = process.env.AEM_HOST;
const AEM_ACCESS_TOKEN = process.env.AEM_ACCESS_TOKEN;

if (!AEM_HOST || !AEM_ACCESS_TOKEN) {
  console.error("Missing AEM_HOST or AEM_ACCESS_TOKEN in .env");
  process.exit(1);
}

const parents = [
  {
    path: '/content/odyssey-eds/destinos/mediterraneo',
    hero: {
      image: '/content/dam/odyssey-eds/mallorca.png',
      imageAlt: 'Mar Mediterráneo',
      eyebrow: 'Destinos Odyssey',
      title: 'Mar Mediterráneo',
      content: 'Navega por las aguas más exclusivas de Europa. Desde las calas escondidas de las Baleares hasta la vibrante Riviera Francesa y la Costa Amalfitana.',
      destLabel: 'Destinos', destVal: '09',
      routesLabel: 'Rutas', routesVal: '24',
      depLabel: 'Embarcaciones', depVal: '14',
      guestLabel: 'Clima', guestVal: 'Óptimo'
    },
    manifesto: {
      image: '/content/dam/odyssey-eds/monaco.png',
      text: '<h2>La Cuna del Yachting</h2><p>El Mediterráneo ofrece una combinación inigualable de historia, gastronomía y lujo. Cada puerto cuenta una historia diferente, invitándote a descubrir sus secretos desde la cubierta de tu yate privado.</p>'
    },
    destinations: [
      { id: 'ibiza', name: 'Ibiza', region: 'Baleares', price: '12.000 €' },
      { id: 'mallorca', name: 'Mallorca', region: 'Baleares', price: '15.000 €' },
      { id: 'costa-del-sol', name: 'Costa del Sol', region: 'Andalucía', price: '10.000 €' },
      { id: 'mykonos', name: 'Mykonos', region: 'Cícladas', price: '18.000 €' },
      { id: 'corfu', name: 'Corfú', region: 'Jónicas', price: '14.000 €' },
      { id: 'monaco', name: 'Mónaco', region: 'Costa Azul', price: '25.000 €' },
      { id: 'costa-amalfina', name: 'Costa Amalfitana', region: 'Campania', price: '22.000 €' },
      { id: 'cerdena', name: 'Cerdeña', region: 'Costa Smeralda', price: '19.000 €' },
      { id: 'corcega', name: 'Córcega', region: 'Francia', price: '16.000 €' }
    ]
  },
  {
    path: '/content/odyssey-eds/destinos/caribe',
    hero: {
      image: '/content/dam/odyssey-eds/bahamas.png',
      imageAlt: 'El Caribe',
      eyebrow: 'Destinos Odyssey',
      title: 'El Caribe',
      content: 'Aguas cristalinas, playas de arena blanca y un clima perfecto durante todo el año. El paraíso definitivo para el yachting de lujo.',
      destLabel: 'Destinos', destVal: '04',
      routesLabel: 'Rutas', routesVal: '12',
      depLabel: 'Embarcaciones', depVal: '08',
      guestLabel: 'Clima', guestVal: 'Tropical'
    },
    manifesto: {
      image: '/content/dam/odyssey-eds/islas-exumas.png',
      text: '<h2>El Paraíso Tropical</h2><p>Sumérgete en un entorno donde el tiempo parece detenerse. Explora arrecifes de coral vibrantes y relájate en playas desiertas accesibles únicamente por mar.</p>'
    },
    destinations: [
      { id: 'bahamas', name: 'Bahamas', region: 'Atlántico', price: '20.000 €' },
      { id: 'islas-virgenes-britanicas', name: 'Islas Vírgenes B.', region: 'Mar Caribe', price: '24.000 €' },
      { id: 'san-bartolome', name: 'San Bartolomé', region: 'Antillas', price: '30.000 €' },
      { id: 'islas-exumas', name: 'Islas Exumas', region: 'Bahamas', price: '28.000 €' }
    ]
  },
  {
    path: '/content/odyssey-eds/destinos/indico',
    hero: {
      image: '/content/dam/odyssey-eds/maldivas.png',
      imageAlt: 'Océano Índico',
      eyebrow: 'Destinos Odyssey',
      title: 'Océano Índico',
      content: 'Atolones remotos y privacidad absoluta en el fin del mundo. Descubre los santuarios marinos más espectaculares del planeta.',
      destLabel: 'Destinos', destVal: '02',
      routesLabel: 'Rutas', routesVal: '06',
      depLabel: 'Embarcaciones', depVal: '04',
      guestLabel: 'Clima', guestVal: 'Ecuatorial'
    },
    manifesto: {
      image: '/content/dam/odyssey-eds/seychelles.png',
      text: '<h2>Santuarios Ocultos</h2><p>Experimenta el aislamiento total y reconecta con la naturaleza en su estado más prístino. Un destino reservado para los viajeros más exigentes.</p>'
    },
    destinations: [
      { id: 'maldivas', name: 'Maldivas', region: 'Asia', price: '35.000 €' },
      { id: 'seychelles', name: 'Seychelles', region: 'África', price: '32.000 €' }
    ]
  }
];

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

async function updateParentContent(parentData) {
  const { path: pagePath, hero, manifesto, destinations } = parentData;
  console.log(`\nMigrating content for: ${pagePath}`);

  // 1. Hero Block
  const heroPath = `${pagePath}/jcr:content/root/section/hero_1`;
  await updateNode(heroPath, {
    "jcr:primaryType": "nt:unstructured",
    "sling:resourceType": "core/franklin/components/block/v1/block",
    "model": "hero",
    "image": hero.image,
    "imageAlt": hero.imageAlt,
    "eyebrow": hero.eyebrow,
    "content": `<h2>${hero.title}</h2><p>${hero.content}</p>`,
    "destinationLabel": hero.destLabel,
    "destinationValue": hero.destVal,
    "routesLabel": hero.routesLabel,
    "routesValue": hero.routesVal,
    "departureLabel": hero.depLabel,
    "departureValue": hero.depVal,
    "guestsLabel": hero.guestLabel,
    "guestsValue": hero.guestVal
  });
  await delay(200);

  // 2. Manifesto Block
  const manifestoPath = `${pagePath}/jcr:content/root/section/manifesto_2`;
  await updateNode(manifestoPath, {
    "jcr:primaryType": "nt:unstructured",
    "sling:resourceType": "core/franklin/components/block/v1/block",
    "model": "manifesto",
    "image": manifesto.image,
    "text": manifesto.text
  });
  await delay(200);

  // 3. Cards Block Container
  const cardsPath = `${pagePath}/jcr:content/root/section/cards_3`;
  await updateNode(cardsPath, {
    "jcr:primaryType": "nt:unstructured",
    "sling:resourceType": "core/franklin/components/block/v1/block",
    "model": "cards",
    "classes": "destinations"
  });
  await delay(200);

  // 4. Cards Items
  for (let index = 0; index < destinations.length; index++) {
    const dest = destinations[index];
    const destUrl = `${pagePath}/${dest.id}`;
    const textHtml = `<p>${dest.region}</p><h3><a href="${destUrl}">${dest.name}</a></h3><p>Desde</p><p>${dest.price}</p>`;
    
    const itemPath = `${cardsPath}/item_${index + 1}`;
    await updateNode(itemPath, {
      "jcr:primaryType": "nt:unstructured",
      "sling:resourceType": "core/franklin/components/block/v1/block/item",
      "image": `/content/dam/odyssey-eds/${dest.id}.png`,
      "text": textHtml
    });
    await delay(100);
  }
}

async function run() {
  console.log("=============================================");
  console.log("🚀 Starting AEM Parent Pages Migration");
  console.log(`🌐 Target AEM: ${AEM_HOST}`);
  console.log("=============================================");

  for (const p of parents) {
    await updateParentContent(p);
  }
  
  console.log("\n✅ Parent Pages Migration completed successfully!");
}

run();
