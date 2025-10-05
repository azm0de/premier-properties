#!/usr/bin/env node

/**
 * Build script for Premier Properties
 * Injects Google Maps API key from environment variables into properties.js
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env file if it exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

// Get API key from environment
const apiKey = process.env.PUBLIC_GOOGLE_MAPS_API_KEY;

if (!apiKey) {
    console.error('❌ ERROR: PUBLIC_GOOGLE_MAPS_API_KEY not found in environment variables');
    console.error('Please set it in .env file or as an environment variable');
    process.exit(1);
}

console.log('🔑 Found Google Maps API key');
console.log('📝 Injecting API key into properties.js...');

// Read properties.js.template
const templatePath = path.join(__dirname, 'properties.js.template');
const outputPath = path.join(__dirname, 'properties.js');

if (!fs.existsSync(templatePath)) {
    console.error('❌ ERROR: properties.js.template not found');
    process.exit(1);
}

let content = fs.readFileSync(templatePath, 'utf8');

// Replace placeholder with actual API key
content = content.replace('YOUR_GOOGLE_MAPS_API_KEY_HERE', apiKey);

// Write to properties.js
fs.writeFileSync(outputPath, content, 'utf8');

console.log('✅ Build complete! API key injected into properties.js');
console.log('⚠️  Remember: properties.js is git-ignored. Only commit properties.js.template');
