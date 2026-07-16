#!/usr/bin/env node

/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */

/**
 * AEM Page Tree Automation Script
 * Reads taxonomy.json and recursively creates cq:Page nodes in AEM via Sling POST API.
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to __dirname equivalent in ES Modules
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Environment Configuration (AEM as a Cloud Service)
const {
  AEM_HOST = 'https://author-pXXXX-eXXXX.adobeaemcloud.com',
  AEM_ACCESS_TOKEN,
  AEM_BASE_PATH = '/content/odyssey/es',
  AEM_TEMPLATE_BASE = '/conf/odyssey/settings/wcm/templates',
} = process.env;

// Load taxonomy
const taxonomyPath = path.join(dirname, 'taxonomy.json');
const taxonomy = JSON.parse(fs.readFileSync(taxonomyPath, 'utf8'));

if (!AEM_ACCESS_TOKEN) {
  console.error('❌ ERROR CRÍTICO: La variable de entorno AEM_ACCESS_TOKEN no está definida.');
  console.error('Para AEM as a Cloud Service necesitas proveer un Developer Token válido.');
  process.exit(1);
}

// Auth header for AEMaaCS
const authHeader = `Bearer ${AEM_ACCESS_TOKEN}`;

// Helper: Delay to prevent overwhelming AEM Tomcat thread pool
const delay = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

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

/**
 * Creates a single cq:Page node via Sling POST API
 * @param {string} parentPath - The parent node path in JCR (e.g., /content/odyssey/es/flota)
 * @param {string} name - The node name (e.g., megayates)
 * @param {string} title - The page title
 * @param {string} templateName - The template to use
 */
async function createAEMPage(parentPath, name, title, templateName = 'content-page') {
  const fullPath = `${parentPath}/${name}`;
  const url = `${AEM_HOST}${fullPath}`;

  // Sling POST parameters for a standard cq:Page creation
  const params = new URLSearchParams();
  params.append('jcr:primaryType', 'cq:Page');
  params.append('jcr:content/jcr:primaryType', 'cq:PageContent');
  params.append('jcr:content/jcr:title', title);
  params.append('jcr:content/cq:template', `${AEM_TEMPLATE_BASE}/${templateName}`);
  params.append('jcr:content/sling:resourceType', 'core/franklin/components/page/v1/page');
  
  // Explicitly create the root and section since raw Sling POST doesn't copy from the template
  params.append('jcr:content/root/jcr:primaryType', 'nt:unstructured');
  params.append('jcr:content/root/sling:resourceType', 'core/franklin/components/root/v1/root');
  params.append('jcr:content/root/section/jcr:primaryType', 'nt:unstructured');
  params.append('jcr:content/root/section/sling:resourceType', 'core/franklin/components/section/v1/section');

  // Inject default blocks based on the dictionary
  const defaultBlocks = INITIAL_CONTENT_MAP[templateName] || [];
  defaultBlocks.forEach((blockName, index) => {
    const nodeName = `${blockName}_${index}`;
    params.append(`jcr:content/root/section/${nodeName}/jcr:primaryType`, 'nt:unstructured');
    params.append(`jcr:content/root/section/${nodeName}/sling:resourceType`, `core/franklin/components/block/v1/block`);
    params.append(`jcr:content/root/section/${nodeName}/model`, blockName);
    params.append(`jcr:content/root/section/${nodeName}/name`, blockName);
  });

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
      console.log(`[SUCCESS] Page created: ${fullPath} ("${title}")`);
    } else {
      console.error(`[ERROR] Failed to create ${fullPath}. Status: ${response.status}`);
      const text = await response.text();
      console.error(text.substring(0, 200)); // Log part of the error
    }
  } catch (error) {
    console.error(`[NETWORK ERROR] Could not reach AEM at ${url}:`, error.message);
  }
}

/**
 * Recursively process the taxonomy tree
 * @param {Array} nodes - Array of taxonomy node objects
 * @param {string} currentPath - The cumulative JCR path
 */
async function processTree(nodes, currentPath) {
  for (const node of nodes) {
    // Create the current node
    await createAEMPage(currentPath, node.name, node.title, node.template);

    // Throttle requests
    await delay(150);

    // If node has children, process them recursively with the new path
    if (node.children && node.children.length > 0) {
      const newPath = `${currentPath}/${node.name}`;
      await processTree(node.children, newPath);
    }
  }
}

// Main execution block
async function run() {
  console.log('=============================================');
  console.log('🚀 Starting AEM Page Tree Automation');
  console.log(`🌐 Target AEM: ${AEM_HOST}`);
  console.log(`📁 Base Path: ${AEM_BASE_PATH}`);
  console.log('=============================================\n');

  try {
    await processTree(taxonomy, AEM_BASE_PATH);
    console.log('\n✅ Page Tree generation completed successfully!');
  } catch (err) {
    console.error('\n❌ Automation failed:', err);
  }
}

run();
