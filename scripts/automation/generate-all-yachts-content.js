import fs from 'fs';
import path from 'path';

const taxonomyPath = path.resolve('./scripts/automation/taxonomy.json');
const taxonomy = JSON.parse(fs.readFileSync(taxonomyPath, 'utf8'));

const outPath = path.resolve('./scripts/automation/yachts-content.json');

const content = {};

const images = {
  'megayates': 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2070&auto=format&fit=crop',
  'catamaranes': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop',
  'deportivos': 'https://images.unsplash.com/photo-1588667610660-f43cce1121d4?q=80&w=2070&auto=format&fit=crop',
  'clasicos': 'https://images.unsplash.com/photo-1500462006325-17730e23da91?q=80&w=2070&auto=format&fit=crop'
};

const prices = {
  'megayates': '65.000 € / semana',
  'catamaranes': '25.000 € / semana',
  'deportivos': '14.000 € / semana',
  'clasicos': '35.000 € / semana'
};

const locations = {
  'megayates': 'Mónaco, Francia',
  'catamaranes': 'Ibiza, Baleares',
  'deportivos': 'Mallorca, Baleares',
  'clasicos': 'Corfú, Grecia'
};

function processCategory(catName, children) {
  children.forEach(yacht => {
    const yachtPath = `odyssey-eds/flota/${catName}/${yacht.name}`;
    const img = images[catName] || images['megayates'];
    const price = prices[catName] || '20.000 € / semana';
    const loc = locations[catName] || 'Ibiza, Baleares';
    
    content[yachtPath] = {
      "section": {
        "yacht-header_1": {
          "eyebrow": catName.toUpperCase(),
          "title": `<h1>${yacht.title}</h1>`,
          "priceLabel": "Tarifa desde",
          "price": price,
          "location": loc
        },
        "yacht-overview_3": {
          "eyebrow": "Resumen",
          "title": `Descubre el ${yacht.title}`,
          "description": `<p><img src="${img}" alt="${yacht.title}" width="100%" style="border-radius:12px; margin-bottom:20px;"/></p><p>El ${yacht.title} es una maravilla de la ingeniería naval moderna, ofreciendo la máxima expresión de lujo en el mar. Experimenta un confort sin igual y atención al detalle en cada rincón.</p>`,
          "tags": "Luxury, Crew, Chef, Jacuzzi",
          "alertText": "Disponible esta temporada.",
          "bookingForm": `<h2>Reserva tu experiencia</h2><table><tr><th>Salida</th><th>Precio</th></tr><tr><td>Semana</td><td>${price}</td></tr></table><br/><a href="#">Solicitar Reserva</a>`
        }
      },
      "section_1": {
        "yacht-specs_0": {
          "eyebrow": "Especificaciones",
          "title": "Ficha Técnica",
          "specs": `<table><tr><td>Eslora</td><td>35m</td></tr><tr><td>Huéspedes</td><td>10-12</td></tr><tr><td>Categoría</td><td>${catName}</td></tr></table>`
        }
      }
    };
  });
}

const flota = taxonomy.find(t => t.name === 'flota');
if (flota && flota.children) {
  flota.children.forEach(category => {
    if (category.children) {
      processCategory(category.name, category.children);
    }
  });
}

fs.writeFileSync(outPath, JSON.stringify(content, null, 2));
console.log(`Updated content generated for ${Object.keys(content).length} yachts!`);
