import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
dotenv.config({ path: path.resolve(dirname, '../../.env') });

const { AEM_HOST, AEM_ACCESS_TOKEN } = process.env;
const authHeader = `Bearer ${AEM_ACCESS_TOKEN}`;

async function run() {
  const url = `${AEM_HOST}/content/odyssey-eds/index/jcr:content/root`;

  // Create Section 1 for Hero
  const section1Url = `${url}/section-1`;
  const s1Params = new URLSearchParams();
  s1Params.append('jcr:primaryType', 'nt:unstructured');
  s1Params.append('sling:resourceType', 'core/franklin/components/section/v1/section');
  await fetch(section1Url, { method: 'POST', headers: { Authorization: authHeader }, body: s1Params });

  // Add Hero block to Section 1
  const heroUrl = `${section1Url}/hero`;
  const heroParams = new URLSearchParams();
  heroParams.append('jcr:primaryType', 'nt:unstructured');
  heroParams.append('sling:resourceType', 'core/franklin/components/block/v1/block');
  heroParams.append('classes', 'hero');
  heroParams.append('image', 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=3540&auto=format&fit=crop');
  heroParams.append('title', 'El mar,\nsin ruido.');
  heroParams.append('subtitle', 'CHÁRTERS PRIVADOS · 2026');
  await fetch(heroUrl, { method: 'POST', headers: { Authorization: authHeader }, body: heroParams });

  // Create Section 2 for Cards
  const section2Url = `${url}/section-2`;
  const s2Params = new URLSearchParams();
  s2Params.append('jcr:primaryType', 'nt:unstructured');
  s2Params.append('sling:resourceType', 'core/franklin/components/section/v1/section');
  await fetch(section2Url, { method: 'POST', headers: { Authorization: authHeader }, body: s2Params });

  // Add Cards block to Section 2
  const cardsUrl = `${section2Url}/cards`;
  const cardsParams = new URLSearchParams();
  cardsParams.append('jcr:primaryType', 'nt:unstructured');
  cardsParams.append('sling:resourceType', 'core/franklin/components/block/v1/block');
  cardsParams.append('classes', 'cards');
  await fetch(cardsUrl, { method: 'POST', headers: { Authorization: authHeader }, body: cardsParams });

  console.log('✅ Index page populated successfully with Hero and Cards blocks!');
}

run();
