/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */

/**
 * AEM Templates Automation Script
 * Creates cq:Template structures in AEM via Sling POST API, injecting default components.
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Environment Configuration (AEM as a Cloud Service)
const {
  AEM_HOST = 'https://author-pXXXX-eXXXX.adobeaemcloud.com',
  AEM_ACCESS_TOKEN,
  AEM_TEMPLATE_BASE = '/conf/odyssey/settings/wcm/templates',
} = process.env;

if (!AEM_ACCESS_TOKEN) {
  console.error('❌ ERROR CRÍTICO: La variable de entorno AEM_ACCESS_TOKEN no está definida en el .env');
  process.exit(1);
}

const authHeader = `Bearer ${AEM_ACCESS_TOKEN}`;

// Dictionary mapping templates to their initial default components
const INITIAL_CONTENT_MAP = {
  'hub-page': ['hero', 'cards'],
  'category-page': ['hero', 'cards'],
  'yacht-detail': ['hero', 'columns'],
  'destination-page': ['hero', 'columns'],
  'experience-page': ['hero', 'columns'],
  'auth-page': ['auth-form'],
  'profile-page': ['client-profile'],
  'content-page': [],
};

// Helper: Delay to prevent overwhelming AEM
const delay = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

/**
 * Extracts unique templates from the taxonomy tree
 */
function getUniqueTemplates(nodes, templates = new Set()) {
  for (const node of nodes) {
    if (node.template) {
      templates.add(node.template);
    }
    if (node.children && node.children.length > 0) {
      getUniqueTemplates(node.children, templates);
    }
  }
  return Array.from(templates);
}

/**
 * Creates a cq:Template with initial, policies, and structure nodes in a single POST
 */
async function createAEMTemplate(templateName) {
  const url = `${AEM_HOST}${AEM_TEMPLATE_BASE}/${templateName}`;
  const title = templateName.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const params = new URLSearchParams();
  // Base Template Node
  params.append('jcr:primaryType', 'cq:Template');
  params.append('jcr:title', title);
  params.append('status', 'enabled'); // Make it available right away

  // Initial Content Node (What gets copied to the page)
  params.append('initial/jcr:primaryType', 'cq:Page');
  params.append('initial/jcr:content/jcr:primaryType', 'cq:PageContent');
  params.append('initial/jcr:content/sling:resourceType', 'core/franklin/components/page/v1/page');
  params.append('initial/jcr:content/root/jcr:primaryType', 'nt:unstructured');
  params.append('initial/jcr:content/root/sling:resourceType', 'core/franklin/components/root/v1/root');

  // Inject a section
  params.append('initial/jcr:content/root/section/jcr:primaryType', 'nt:unstructured');
  params.append('initial/jcr:content/root/section/sling:resourceType', 'core/franklin/components/section/v1/section');

  // Inject default blocks based on the dictionary
  const defaultBlocks = INITIAL_CONTENT_MAP[templateName] || [];
  defaultBlocks.forEach((blockName, index) => {
    const nodeName = `${blockName}_${index}`;
    params.append(`initial/jcr:content/root/section/${nodeName}/jcr:primaryType`, 'nt:unstructured');
    params.append(`initial/jcr:content/root/section/${nodeName}/sling:resourceType`, `core/franklin/components/block/v1/block`);
    params.append(`initial/jcr:content/root/section/${nodeName}/model`, blockName);
    params.append(`initial/jcr:content/root/section/${nodeName}/name`, blockName);
  });

  // Policies Node
  params.append('policies/jcr:primaryType', 'cq:Page');
  params.append('policies/jcr:content/jcr:primaryType', 'cq:PageContent');
  params.append('policies/jcr:content/sling:resourceType', 'core/franklin/components/page/v1/page');

  // Structure Node
  params.append('structure/jcr:primaryType', 'cq:Page');
  params.append('structure/jcr:content/jcr:primaryType', 'cq:PageContent');
  params.append('structure/jcr:content/sling:resourceType', 'core/franklin/components/page/v1/page');
  params.append('structure/jcr:content/root/jcr:primaryType', 'nt:unstructured');

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

    if (response.ok || response.status === 201 || response.status === 200) {
      console.log(`[SUCCESS] Template created: ${templateName} (Initial Blocks: ${defaultBlocks.join(', ') || 'None'})`);
    } else {
      console.error(`[ERROR] Failed to create template ${templateName}. Status: ${response.status}`);
      const text = await response.text();
      console.error(text.substring(0, 200));
    }
  } catch (error) {
    console.error(`[NETWORK ERROR] Could not reach AEM at ${url}:`, error.message);
  }
}

// Main execution block
async function run() {
  const taxonomyPath = path.join(dirname, 'taxonomy.json');
  const taxonomy = JSON.parse(fs.readFileSync(taxonomyPath, 'utf8'));

  const uniqueTemplates = getUniqueTemplates(taxonomy);

  console.log('=============================================');
  console.log('🚀 Starting AEM Templates Automation');
  console.log(`🌐 Target AEM: ${AEM_HOST}`);
  console.log(`🧩 Templates found in Taxonomy: ${uniqueTemplates.length}`);
  console.log('=============================================\n');

  try {
    for (const tpl of uniqueTemplates) {
      await createAEMTemplate(tpl);
      await delay(200); // Throttle
    }
    console.log('\n✅ Templates creation completed successfully!');
    console.log('👉 Next Step: Run create-aem-tree.js to generate the pages using these templates.');
  } catch (err) {
    console.error('\n❌ Automation failed:', err);
  }
}

run();
