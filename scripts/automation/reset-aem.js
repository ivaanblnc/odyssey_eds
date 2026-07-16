import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
dotenv.config({ path: path.resolve(dirname, '../../.env') });

const AEM_HOST = process.env.AEM_HOST;
const AEM_ACCESS_TOKEN = process.env.AEM_ACCESS_TOKEN;
const AEM_BASE_PATH = process.env.AEM_BASE_PATH || '/content/odyssey-eds';

const pagesToDelete = ['flota', 'destinos', 'experiencias', 'login', 'register', 'profile', 'legal'];

async function deletePages() {
  for (const page of pagesToDelete) {
    const url = `${AEM_HOST}${AEM_BASE_PATH}/${page}`;
    const params = new URLSearchParams();
    params.append(':operation', 'delete');
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AEM_ACCESS_TOKEN}`
        },
        body: params
      });
      console.log(`[DELETED] ${url}`);
    } catch (e) {
      console.error(e);
    }
  }
}

deletePages();
