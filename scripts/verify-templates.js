import { existsSync, readdirSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const templatesDir = join(__dirname, '..', 'templates')

// Helper function to check for file with multiple possible extensions
function checkFileExists(dir, baseName, extensions) {
  return extensions.some(ext => existsSync(join(dir, baseName + ext)))
}

// Required files and folders for each template
const requiredFiles = {
  // Webflow Website templates
  'basic-workers': ['worker', 'src', 'public', 'package.json', 'vite.config.ts', 'wrangler.jsonc'],
  'workers-d1': ['worker', 'src', 'public', 'package.json', 'vite.config.ts', 'wrangler.jsonc'],
  'workers-d1-drizzle': ['worker', 'src', 'public', 'package.json', 'vite.config.ts', 'wrangler.jsonc'],
  'workers-supabase': ['worker', 'src', 'public', 'package.json', 'vite.config.ts', 'wrangler.jsonc'],
  'workers-supabase-drizzle': ['worker', 'src', 'public', 'package.json', 'vite.config.ts', 'wrangler.jsonc'],
  
  // Webflow App template
  'webflow-app-starter': ['src', 'public', 'package.json', 'vite.config.ts'],
  
  // Shopify template
  'shopify-theme-starter': ['worker', 'src', 'public', 'package.json', 'wrangler.jsonc']
}

// Check if templates directory exists
if (!existsSync(templatesDir)) {
  console.error('❌ Templates directory not found!')
  process.exit(1)
}

// Get all template directories
const templates = readdirSync(templatesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)

// Verify each template
let hasErrors = false

for (const template of templates) {
  const templateDir = join(templatesDir, template)
  const required = requiredFiles[template] || []
  
  console.log(`\nChecking template: ${template}`)
  
  for (const file of required) {
    let exists = false
    if (file === 'vite.config.ts') {
      // Check for both .ts and .js extensions
      exists = checkFileExists(templateDir, 'vite.config', ['.ts', '.js'])
    } else {
      exists = existsSync(join(templateDir, file))
    }
    
    if (!exists) {
      console.error(`❌ Missing required file/folder: ${file} in ${template}`)
      hasErrors = true
    } else {
      console.log(`✓ Found ${file}`)
    }
  }
}

if (hasErrors) {
  console.error('\n❌ Template verification failed! Please fix the missing files before publishing.')
  process.exit(1)
} else {
  console.log('\n✓ All templates verified successfully!')
} 