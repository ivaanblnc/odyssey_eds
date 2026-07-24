import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import FormData from 'form-data';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const AEM_HOST = process.env.AEM_HOST;
const AEM_ACCESS_TOKEN = process.env.AEM_ACCESS_TOKEN;
const folderUrl = `${AEM_HOST}/content/dam/odyssey-eds/varied.createasset.html`;

const brainDir = '/Users/ivandelllanoblanco/.gemini/antigravity-ide/brain/7db2b89c-057a-423d-8e2a-177b0fbe13dd';

async function uploadImages() {
  const files = fs.readdirSync(brainDir);
  for (const file of files) {
    if (file.endsWith('.png')) {
      const parts = file.split('_');
      // For example: mediterraneo_hero_12345.png -> mediterraneo_hero.png
      if (parts.length < 3) continue;
      const finalName = `${parts[0]}_${parts[1]}.png`;
      
      const filePath = path.join(brainDir, file);
      
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      form.append('fileName', finalName);
      
      console.log(`Uploading ${finalName}...`);
      try {
        const response = await fetch(folderUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${AEM_ACCESS_TOKEN}`
          },
          body: form
        });
        console.log(`${finalName} upload status:`, response.status);
      } catch (e) {
        console.error(`Error uploading ${finalName}:`, e);
      }
    }
  }
}

uploadImages();
