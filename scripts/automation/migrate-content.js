import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load .env relative to this script
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
dotenv.config({ path: path.join(dirname, '../../.env') });

const AEM_HOST = process.env.AEM_HOST || 'http://localhost:4502';
const AEM_ACCESS_TOKEN = process.env.AEM_ACCESS_TOKEN;

if (!AEM_ACCESS_TOKEN) {
  console.error('❌ ERROR CRÍTICO: La variable de entorno AEM_ACCESS_TOKEN no está definida.');
  process.exit(1);
}

const authHeader = `Bearer ${AEM_ACCESS_TOKEN}`;

// Helper: Delay to prevent overwhelming AEM Tomcat thread pool
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function updateNode(nodePath, data) {
  const url = `${AEM_HOST}${nodePath}`;
  const params = new URLSearchParams();

  // Map JSON properties to Sling POST parameters
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      // Handle multifields or item lists (e.g. Gallery)
      // This logic will be handled outside if it requires child nodes, but if it's a simple array property:
      value.forEach(v => params.append(key, v));
    } else if (typeof value === 'object') {
      // It's a block. We don't POST block objects directly, handled by caller
    } else {
      // Simple string/number property
      params.append(key, value);
    }
  }

  // Force update
  params.append(':cq:action', 'default');
  
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

async function createGalleryItems(blockPath, images) {
  // First, we need to create child nodes for each image
  for (let i = 0; i < images.length; i++) {
    const itemNode = `item_${i + 1}`;
    const url = `${AEM_HOST}${blockPath}/${itemNode}`;
    const params = new URLSearchParams();
    
    params.append('jcr:primaryType', 'nt:unstructured');
    params.append('sling:resourceType', 'core/franklin/components/block/v1/block/item');
    params.append('image', images[i]);
    
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
        console.log(`[SUCCESS] Added gallery item: ${blockPath}/${itemNode}`);
      } else {
        console.error(`[ERROR] Failed to add gallery item. Status: ${response.status}`);
      }
    } catch (error) {
      console.error(`[NETWORK ERROR] Could not add gallery item:`, error.message);
    }
    await delay(100);
  }
}

async function run() {
  console.log('=============================================');
  console.log('🚀 Starting AEM Content Migration');
  console.log(`🌐 Target AEM: ${AEM_HOST}`);
  console.log('=============================================\n');

  const contentPath = path.join(dirname, 'yachts-content.json');
  const yachtsContent = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

  for (const [yachtPath, sections] of Object.entries(yachtsContent)) {
    console.log(`\nMigrating content for: /content/${yachtPath}`);
    
    // The base path to the page's jcr:content
    const basePath = `/content/${yachtPath}/jcr:content/root`;

    for (const [sectionName, blocks] of Object.entries(sections)) {
      for (const [blockName, blockData] of Object.entries(blocks)) {
        const blockPath = `${basePath}/${sectionName}/${blockName}`;
        
        if (blockName === 'gallery' && Array.isArray(blockData)) {
          console.log(`-> Processing gallery for ${yachtPath}`);
          await createGalleryItems(blockPath, blockData);
        } else {
          console.log(`-> Updating block ${blockName}`);
          await updateNode(blockPath, blockData);
        }
        await delay(200);
      }
    }
  }
  
  console.log('\n✅ Content Migration completed successfully!');
}

run();
