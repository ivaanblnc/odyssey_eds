import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
dotenv.config({ path: path.join(dirname, '../../.env') });

const AEM_HOST = process.env.AEM_HOST;
const AEM_ACCESS_TOKEN = process.env.AEM_ACCESS_TOKEN;
const authHeader = `Bearer ${AEM_ACCESS_TOKEN}`;

const taxonomyPath = path.resolve('./scripts/automation/taxonomy.json');
const taxonomy = JSON.parse(fs.readFileSync(taxonomyPath, 'utf8'));

async function deleteNode(nodePath) {
  const url = `${AEM_HOST}${nodePath}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: authHeader, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: ':operation=delete'
  });
  if (response.ok) {
    console.log(`[DELETED] ${nodePath}`);
  } else {
    console.log(`[FAILED] ${nodePath} - ${response.status}`);
  }
}

async function run() {
  const destinos = taxonomy.find(t => t.name === 'destinos');
  for (const region of destinos.children) {
    if (!region.children) continue;
    for (const dest of region.children) {
      const basePath = `/content/odyssey-eds/destinos/${region.name}/${dest.name}/jcr:content/root`;
      await deleteNode(`${basePath}/section/hero`);
      await deleteNode(`${basePath}/section/manifesto`);
      await deleteNode(`${basePath}/section/hero_1`);
      await deleteNode(`${basePath}/section/manifesto_2`);
    }
  }
}
run();
