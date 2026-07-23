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

const yachtImages = {
  'megayates': 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2070&auto=format&fit=crop',
  'catamaranes': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop',
  'deportivos': 'https://images.unsplash.com/photo-1588667610660-f43cce1121d4?q=80&w=2070&auto=format&fit=crop',
  'clasicos': 'https://images.unsplash.com/photo-1500462006325-17730e23da91?q=80&w=2070&auto=format&fit=crop'
};

const allImages = { ...destinationImages, ...yachtImages };

async function uploadAsset(name, url) {
  const fallbackUrl = 'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?q=80&w=2070&auto=format&fit=crop';
  try {
    console.log(`Downloading ${name} from Unsplash...`);
    let res = await fetch(url);
    if (!res.ok) {
        console.log(`Failed to download ${name} (${res.status}), trying fallback...`);
        res = await fetch(fallbackUrl);
        if (!res.ok) throw new Error(`Fallback failed: ${res.status}`);
    }
    const arrayBuffer = await res.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
    
    console.log(`Uploading ${name}.jpg to AEM DAM...`);
    const formData = new FormData();
    formData.append('name', `${name}.jpg`);
    formData.append('file', blob, `${name}.jpg`);

    const uploadUrl = `${AEM_HOST}/api/assets/odyssey-eds/*`;
    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: authHeader
      },
      body: formData
    });

    if (uploadRes.ok) {
      console.log(`✅ Successfully uploaded ${name}.jpg`);
    } else {
      const errText = await uploadRes.text();
      if (uploadRes.status === 409) {
          console.log(`ℹ️ ${name}.jpg already exists.`);
      } else {
          console.error(`❌ Failed to upload ${name}.jpg: ${uploadRes.status} - ${errText}`);
      }
    }
    
    // Fix metadata for Content Advisor
    console.log(`Setting dc:format metadata for ${name}.jpg...`);
    const metaRes = await fetch(`${AEM_HOST}/content/dam/odyssey-eds/${name}.jpg`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        './jcr:content/metadata/dc:format': 'image/jpeg'
      })
    });
    if (metaRes.ok) {
      console.log(`✅ Fixed metadata for ${name}.jpg`);
    } else {
      console.error(`❌ Failed to fix metadata for ${name}.jpg: ${metaRes.status}`);
    }
  } catch (e) {
    console.error(`❌ Error processing ${name}:`, e.message);
  }
}

async function run() {
  for (const [name, url] of Object.entries(allImages)) {
    await uploadAsset(name, url);
  }
  console.log("Done uploading all assets!");
}

run();
