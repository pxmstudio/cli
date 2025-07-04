#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, readdirSync, statSync, unlinkSync, rmSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import minimist from 'minimist'
import prompts from 'prompts'
import { red, green, cyan, yellow, reset } from 'kolorist'

const __dirname = dirname(fileURLToPath(import.meta.url))

type Template = {
  name: string
  display: string
  color: (str: string) => string
  description: string
}

const WEBFLOW_WEBSITE_TEMPLATES: Template[] = [
  {
    name: 'basic-workers',
    display: 'Vite',
    color: cyan,
    description: 'Basic Vite setup with Cloudflare Workers backend'
  },
  {
    name: 'basic-vercel',
    display: 'Vite + Vercel',
    color: green,
    description: 'Basic Vite setup with Vercel Edge Functions backend'
  },
  {
    name: 'workers-d1',
    display: 'Vite + D1',
    color: yellow,
    description: 'Vite with Cloudflare D1 database'
  },
  {
    name: 'workers-d1-drizzle',
    display: 'Vite + D1 + Drizzle',
    color: yellow,
    description: 'Vite with Cloudflare D1 database and Drizzle ORM'
  },
  {
    name: 'workers-supabase',
    display: 'Vite + Supabase',
    color: green,
    description: 'Vite with Supabase database'
  },
  {
    name: 'workers-supabase-drizzle',
    display: 'Vite + Supabase + Drizzle',
    color: green,
    description: 'Vite with Supabase database and Drizzle ORM'
  }
]

const PLATFORMS = [
  { value: 'webflow', title: 'Webflow', color: cyan },
  { value: 'shopify', title: 'Shopify', color: green }
]

const WEBFLOW_PROJECT_TYPES = [
  { value: 'website', title: 'Website', color: cyan },
  { value: 'app', title: 'App', color: yellow }
]

type AddonPackage = {
  name: string
  packageName: string
  version: string
  description: string
}

function copyDir(src: string, dest: string) {
  mkdirSync(dest, { recursive: true })
  
  for (const file of readdirSync(src, { withFileTypes: true })) {
    const srcFile = join(src, file.name)
    const destFile = join(dest, file.name)
    
    if (file.isDirectory()) {
      copyDir(srcFile, destFile)
    } else {
      copyFileSync(srcFile, destFile)
    }
  }
}

function updatePackageJson(projectPath: string, projectName: string) {
  const packageJsonPath = join(projectPath, 'package.json')
  if (existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
    packageJson.name = projectName
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  }
}

function updateReadme(projectPath: string, projectName: string) {
  const readmePath = join(projectPath, 'README.md')
  if (existsSync(readmePath)) {
    let readme = readFileSync(readmePath, 'utf-8')
    // Replace the default project name with the actual project name
    readme = readme.replace(/webflow-starter/g, projectName)
    writeFileSync(readmePath, readme)
  }
}

async function addOptionalPackages(
  projectPath: string, 
  options: { installGsap?: boolean; installSwiper?: boolean; installPixelmakers?: boolean }
) {
  const packageJsonPath = join(projectPath, 'package.json')
  if (!existsSync(packageJsonPath)) return

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
  
  if (!packageJson.dependencies) {
    packageJson.dependencies = {}
  }

  if (options.installGsap) {
    packageJson.dependencies['gsap'] = '^3.13.0'
  }
  
  if (options.installSwiper) {
    packageJson.dependencies['swiper'] = '^11.1.0'
  }
  
  if (options.installPixelmakers) {
    packageJson.dependencies['@pixelmakers/elements'] = '^0.1.17'
  }

  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
}

async function runSupabaseInit(projectPath: string) {
  try {
    console.log(`\n${cyan('🚀 Initializing Supabase...')}`)
    
    // Copy dev.vars.example to dev.vars
    const devVarsExamplePath = join(projectPath, 'dev.vars.example')
    const devVarsPath = join(projectPath, 'dev.vars')
    
    if (existsSync(devVarsExamplePath)) {
      copyFileSync(devVarsExamplePath, devVarsPath)
      console.log(`${green('✓')} Created dev.vars with local Supabase configuration`)
    }

    // Initialize Supabase project with interactive prompts
    const { spawn } = await import('child_process')
    
    console.log(`${cyan('Running:')} supabase init`)
    
    const child = spawn('supabase', ['init'], {
      cwd: projectPath,
      stdio: 'inherit', // Allow user to interact with prompts
    })

    await new Promise((resolve, reject) => {
      child.on('close', (code) => {
        if (code === 0) {
          console.log(`${green('✓')} Supabase project initialized`)
          resolve(undefined)
        } else {
          reject(new Error(`Supabase init failed with code ${code}`))
        }
      })
      
      child.on('error', (error) => {
        reject(error)
      })
    })
    
  } catch (error: any) {
    console.log(`${yellow('⚠')} Note: Could not auto-initialize Supabase. Make sure Supabase CLI is installed.`)
    console.log(`${yellow('  Run:')} supabase init`)
    console.log(`${yellow('  Then:')} supabase start`)
  }
}

async function init() {
  const argv = minimist(process.argv.slice(2), { string: ['_'] })
  let targetDir = argv._[0]
  
  // Show help or list templates
  if (argv.help || argv.h) {
    console.log(`
${green('@pixelmakers/cli')} - Create Webflow projects with Vite + Cloudflare Workers

${cyan('Usage:')}
  pixelmakers [project-name] [options]

${cyan('Options:')}
  -h, --help     Show this help message
  -l, --list     List available templates

${cyan('Examples:')}
  pixelmakers my-app
  pixelmakers my-app --list
  pixelmakers .    # Create project in current directory
`)
    return
  }
  
  if (argv.list || argv.l) {
    console.log(`\n${green('Available options:')}\n`)
    console.log(`${cyan('Platforms:')}`)
    PLATFORMS.forEach((platform, index) => {
      const platformColor = platform.color
      console.log(`${index + 1}. ${platformColor(platform.title)}`)
    })
    console.log(`\n${cyan('Webflow Website Templates:')}`)
    WEBFLOW_WEBSITE_TEMPLATES.forEach((template, index) => {
      const templateColor = template.color
      console.log(`${index + 1}. ${templateColor(template.display)}`)
      console.log(`   ${template.description}`)
    })
    console.log()
    return
  }
  
  const defaultProjectName = targetDir === '.' ? 'webflow-project' : 'webflow-project'
  
  let result: {
    projectName?: string
    shouldOverwrite?: boolean
    packageName?: string
    platform?: string
    projectType?: string
    template?: string
    installGsap?: boolean
    installSwiper?: boolean
    installPixelmakers?: boolean
    initializeSupabase?: boolean
  } = {}

  try {
    result = await prompts(
      [
        {
          type: targetDir ? null : 'text',
          name: 'projectName',
          message: reset('Project name:'),
          initial: defaultProjectName,
          onState: (state: any) => {
            targetDir = String(state.value).trim() || defaultProjectName
          }
        },
        {
          type: () => !existsSync(targetDir) || isEmpty(targetDir) ? null : 'confirm',
          name: 'shouldOverwrite',
          message: () => {
            const dirForPrompt = targetDir === '.' ? 'Current directory' : `Target directory "${targetDir}"`
            return `${dirForPrompt} is not empty. Remove existing files and continue?`
          }
        },
        {
          type: (_: any, { shouldOverwrite }: { shouldOverwrite?: boolean }) => {
            if (shouldOverwrite === false) {
              throw new Error(red('✖') + ' Operation cancelled')
            }
            return null
          },
          name: 'overwriteChecker'
        },
        {
          type: () => (isValidPackageName(targetDir) ? null : 'text'),
          name: 'packageName',
          message: reset('Package name:'),
          initial: () => toValidPackageName(targetDir),
          validate: (dir: any) => isValidPackageName(dir) || 'Invalid package.json name'
        },
        {
          type: 'select',
          name: 'platform',
          message: reset('What platform are we building on today?'),
          initial: 0,
          choices: PLATFORMS.map((platform) => {
            const platformColor = platform.color
            return {
              title: platformColor(platform.title),
              value: platform.value
            }
          })
        },
        {
          type: (prev: string) => prev === 'webflow' ? 'select' : null,
          name: 'projectType',
          message: reset('What type of project?'),
          initial: 0,
          choices: WEBFLOW_PROJECT_TYPES.map((type) => {
            const typeColor = type.color
            return {
              title: typeColor(type.title),
              value: type.value
            }
          })
        },
        {
          type: (prev: string, values: any) => values.platform === 'webflow' && values.projectType === 'website' ? 'select' : null,
          name: 'template',
          message: reset('Select a template:'),
          initial: 0,
          choices: WEBFLOW_WEBSITE_TEMPLATES.map((template) => {
            const templateColor = template.color
            return {
              title: templateColor(template.display),
              description: template.description,
              value: template.name
            }
          })
        },
        {
          type: (prev: any, values: any) => (values.platform === 'webflow' && values.projectType === 'website') ? 'confirm' : null,
          name: 'installGsap',
          message: reset('Install GSAP?'),
          initial: false
        },
        {
          type: (prev: any, values: any) => (values.platform === 'webflow' && values.projectType === 'website') ? 'confirm' : null,
          name: 'installSwiper',
          message: reset('Install Swiper JS?'),
          initial: false
        },
        {
          type: (prev: any, values: any) => (values.platform === 'webflow' && values.projectType === 'website') ? 'confirm' : null,
          name: 'installPixelmakers',
          message: reset('Install @pixelmakers/elements?'),
          initial: false
        },
        {
          type: (prev: any, values: any) => (values.platform === 'webflow' && values.projectType === 'website' && values.template && values.template.includes('supabase')) ? 'confirm' : null,
          name: 'initializeSupabase',
          message: reset('Initialize Supabase now?'),
          initial: false
        }
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' Operation cancelled')
        }
      }
    )
  } catch (cancelled: any) {
    console.log(cancelled.message)
    return
  }

  const { projectName, shouldOverwrite, packageName, platform, projectType, template, installGsap, installSwiper, installPixelmakers, initializeSupabase } = result
  
  // Determine the template to use
  let selectedTemplate: string = ''
  
  if (platform === 'shopify') {
    selectedTemplate = 'shopify-theme-starter'
  } else if (platform === 'webflow' && projectType === 'app') {
    selectedTemplate = 'webflow-app-starter'
  } else if (platform === 'webflow' && projectType === 'website' && template) {
    selectedTemplate = template
  } else {
    console.log(red('✖') + ' No template selected')
    return
  }
  
  const root = targetDir === '.' ? process.cwd() : join(process.cwd(), targetDir)
  
  if (shouldOverwrite) {
    emptyDir(root)
  } else if (!existsSync(root)) {
    mkdirSync(root, { recursive: true })
  }

  console.log(`\n${cyan('🚀 Pixelmakers CLI')} - Scaffolding project in ${root}...`)

  const templateDir = join(__dirname, '..', 'templates', selectedTemplate)
  
  // Verify template structure
  const workerDir = join(templateDir, 'worker')
  const apiDir = join(templateDir, 'api')
  if (!existsSync(workerDir) && !existsSync(apiDir)) {
    console.error(red('✖') + ` Template "${selectedTemplate}" is missing the worker or api folder!`)
    console.error(yellow('  Please report this issue at: https://github.com/pxmstudio/cli/issues'))
    process.exit(1)
  }
  
  copyDir(templateDir, root)
  
  updatePackageJson(root, packageName || projectName || targetDir)
  updateReadme(root, packageName || projectName || targetDir)
  
  // Add optional packages for Webflow Website projects
  if (platform === 'webflow' && projectType === 'website') {
    await addOptionalPackages(root, { installGsap, installSwiper, installPixelmakers })
  }
  
  // Setup Supabase for Supabase templates
  if (selectedTemplate.includes('supabase')) {
    if (initializeSupabase) {
      await runSupabaseInit(root)
    } else {
      // Still create dev.vars even if not initializing
      const devVarsExamplePath = join(root, 'dev.vars.example')
      const devVarsPath = join(root, 'dev.vars')
      
      if (existsSync(devVarsExamplePath)) {
        copyFileSync(devVarsExamplePath, devVarsPath)
        console.log(`${green('✓')} Created dev.vars with local Supabase configuration`)
      }
    }
  }

  console.log(`\n${green('✓')} Done! Your Webflow project is ready! Now run:\n`)
  if (root !== process.cwd()) {
    console.log(`  cd ${targetDir}`)
  }
  console.log(`  npm install`)
  console.log(`  npm run dev`)
  
  // Template-specific instructions
  if (selectedTemplate.includes('d1')) {
    console.log(`\n${yellow('D1 Database Setup:')}`)
    console.log(`  npm run db:create`)
    console.log(`  npm run db:migrate`)
  }
  
  if (selectedTemplate.includes('supabase')) {
    console.log(`\n${green('Supabase Setup:')}`)
    if (initializeSupabase) {
      console.log(`  npm run supabase:start`)
      console.log(`  ${yellow('Note:')} Local Supabase instance will be available at http://localhost:54323`)
    } else {
      console.log(`  supabase init`)
      console.log(`  npm run supabase:start`)
      console.log(`  ${yellow('Note:')} Local Supabase instance will be available at http://localhost:54323`)
    }
  }
  
  if (selectedTemplate.includes('drizzle')) {
    console.log(`\n${cyan('Drizzle Setup:')}`)
    console.log(`  npm run db:generate`)
    console.log(`  npm run db:studio`)
  }
  
  if (selectedTemplate === 'basic-vercel') {
    console.log(`\n${green('Vercel Setup:')}`)
    console.log(`  1. Install Vercel CLI: npm install -g vercel`)
    console.log(`  2. Deploy to Vercel: vercel`)
    console.log(`  3. For production: vercel --prod`)
    console.log(`  ${yellow('Note:')} Your API will be available at your Vercel domain`)
  }
  
  if (platform === 'shopify') {
    console.log(`\n${green('Shopify Theme Setup:')}`)
    console.log(`  1. Install Shopify CLI: npm install -g @shopify/cli`)
    console.log(`  2. Connect to your store: shopify theme dev`)
  }
  
  if (platform === 'webflow' && projectType === 'app') {
    console.log(`\n${cyan('Webflow App Setup:')}`)
    console.log(`  1. Configure your app in the Webflow Developer Portal`)
    console.log(`  2. Update your app settings in wrangler.jsonc`)
  }
  
  if (platform === 'webflow' && projectType === 'website') {
    console.log(`\n${cyan('Webflow Setup:')}`)
    console.log(`  1. Open your Webflow project`)
    console.log(`  2. Go to Project Settings > Custom Code`)
    console.log(`  3. Add the following script to the "Footer Code" section:`)
    console.log(`     <script>`)
    console.log(`       (function () {`)
    console.log(`         const CONFIG = {`)
    console.log(`           localhost: 'http://localhost:5173',`)
    if (selectedTemplate === 'basic-vercel') {
      console.log(`           staging: 'https://your-project-staging.vercel.app', `)
      console.log(`           production: 'https://your-project.vercel.app'`)
    } else {
      console.log(`           staging: 'https://[deployment-id]-your-worker.workers.dev', `)
      console.log(`           production: 'https://your-worker.workers.dev'`)
    }
    console.log(`         };`)
    console.log(``)
    console.log(`         const PATHS = {`)
    console.log(`           localhost: ['@vite/client', 'src/main.ts'],`)
    console.log(`           build: ['/main.js']`)
    console.log(`         };`)
    console.log(``)
    console.log(`         function loadScripts(urls) {`)
    console.log(`           urls.forEach(url => {`)
    console.log(`             const script = document.createElement('script');`)
    console.log(`             script.src = url;`)
    console.log(`             script.type = "module";`)
    console.log(`             script.onerror = () => console.error('Failed to load:', url);`)
    console.log(`             document.body.appendChild(script);`)
    console.log(`           });`)
    console.log(``)
    console.log(`         function init() {`)
    console.log(`           // Try localhost first`)
    console.log(`           fetch(\`\${CONFIG.localhost}/\${PATHS.localhost[0]}\`, { method: 'HEAD', mode: 'no-cors' })`)
    console.log(`             .then(() => {`)
    console.log(`               // Localhost available`)
    console.log(`               console.log('🚀 Development mode');`)
    console.log(`               const urls = PATHS.localhost.map(path => \`\${CONFIG.localhost}/\${path}\`);`)
    console.log(`               loadScripts(urls);`)
    console.log(`             })`)
    console.log(`             .catch(() => {`)
    console.log(`               // Use staging or production`)
    console.log(`               const isStaging = window.location.href.includes('.webflow.io');`)
    console.log(`               const domain = isStaging ? CONFIG.staging : CONFIG.production;`)
    console.log(`               const env = isStaging ? 'staging' : 'production';`)
    console.log(``)
    console.log(`               console.log(\`🌐 \${env.charAt(0).toUpperCase() + env.slice(1)} mode\`);`)
    console.log(`               const urls = PATHS.build.map(path => domain + path);`)
    console.log(`               loadScripts(urls);`)
    console.log(`             });`)
    console.log(``)
    console.log(`         }`)
    console.log(``)
    console.log(`         // Start when ready`)
    console.log(`         document.readyState === 'loading' `)
    console.log(`           ? document.addEventListener('DOMContentLoaded', init)`)
    console.log(`           : init();`)
    console.log(`       })();`)
    console.log(`     </script>`)
    console.log(`  4. Update the CONFIG object with your ${selectedTemplate === 'basic-vercel' ? 'Vercel' : 'worker'} URLs:`)
    if (selectedTemplate === 'basic-vercel') {
      console.log(`     - staging: Your Vercel staging URL`)
      console.log(`     - production: Your Vercel production URL`)
    } else {
      console.log(`     - staging: Your Cloudflare Workers staging URL`)
      console.log(`     - production: Your Cloudflare Workers production URL`)
    }
    console.log(`  5. Save and publish your Webflow project`)
  }
  
  console.log(`\n${cyan('🎉 Happy coding!')} Made with ❤️  by ${cyan('Pixelmakers')}`)
  console.log(`${yellow('📚 Need help?')} Visit: https://github.com/pixelmakers/cli`)
  console.log()
}

function isEmpty(path: string) {
  const files = readdirSync(path)
  return files.length === 0 || (files.length === 1 && files[0] === '.git')
}

function emptyDir(dir: string) {
  if (!existsSync(dir)) {
    return
  }
  for (const file of readdirSync(dir, { withFileTypes: true })) {
    // Skip .git directory only
    if (file.name === '.git') {
      continue
    }
    const filePath = join(dir, file.name)
    if (file.isDirectory()) {
      rmSync(filePath, { recursive: true, force: true })
    } else {
      unlinkSync(filePath)
    }
  }
}

function isValidPackageName(projectName: string) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(projectName)
}

function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-')
}

init().catch((e) => {
  console.error(e)
  process.exit(1)
})