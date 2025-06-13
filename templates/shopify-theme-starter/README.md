# PXM Shopify Starter

A modern Shopify theme development starter template built with Vite, Cloudflare Workers, and TailwindCSS.

[![Build status](https://github.com/pixelmakers/cli/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/pixelmakers/cli/actions/workflows/ci.yml?query=branch%3Amain)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?color=informational)](/.github/CONTRIBUTING.md)

[Getting Started](#getting-started) |
[Features](#features) |
[Development](#development) |
[Deployment](#deployment) |
[Contributing](#contributing) |
[License](#license)

## Features

- ⚡️ **Vite** - Next Generation Frontend Tooling
- 🎨 **TailwindCSS** - A utility-first CSS framework
- 🚀 **Cloudflare Workers** - Edge computing platform
- 🔥 **Hot Module Replacement (HMR)** - Instant feedback during development
- 📦 **Modern Build System** - Optimized for production
- 🛠 **TypeScript** - Type safety and better developer experience
- 🎯 **Shopify Vite Plugin** - Seamless Shopify theme development

## Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm 8.x or later
- Shopify CLI 3.x or later
- A Shopify Partner account and development store

### Installation

1. Clone this repository:
```bash
git clone https://github.com/your-username/pxm-wf-starter.git
cd pxm-wf-starter
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your Shopify store credentials.

### Development

1. Start the development server:
```bash
pnpm dev
```

This will:
- Start the Vite development server
- Watch for file changes
- Enable HMR for instant feedback
- Proxy requests to your Shopify store

2. Access your development store at the URL provided in the terminal.

### Building for Production

To build your theme for production:

```bash
pnpm build
```

This will:
- Compile and optimize your assets
- Generate production-ready files
- Create a distribution package

## Deployment

### Deploying to Shopify

1. Build your theme:
```bash
pnpm build
```

2. Deploy using Shopify CLI:
```bash
shopify theme push
```

### Deploying to Cloudflare Workers

The project is configured for easy deployment to Cloudflare Workers through GitHub integration:

1. Connect your GitHub repository to Cloudflare Workers:
   - Go to Cloudflare Dashboard > Workers & Pages
   - Click "Create application" > "Pages"
   - Connect your GitHub repository
   - Select the repository containing this project

2. **Deploy via GitHub Integration:**
   - Push your code to a GitHub repository
   - In the Cloudflare Dashboard, go to Compute (Workers) > your Worker > Create
   - Under "Workers", click "Import a repository"
   - Select your repository and branch
   - Cloudflare will automatically deploy your Worker when you push changes
   - Add the following environment variable:
     - `VITE_API_URL`: Your Shopify store URL (e.g., `https://your-store.myshopify.com`)

3. Deploy:
   - Cloudflare will automatically deploy your worker when you push to the main branch
   - You can also trigger manual deployments from the Cloudflare Dashboard

Your site will be available at `https://your-project.workers.dev` after deployment.

## Project Structure

```
├── src/                    # Source files
│   ├── assets/            # Static assets
│   ├── components/        # React components
│   ├── styles/           # Global styles and Tailwind config
│   └── vite/             # Vite configuration
├── templates/             # Shopify theme templates
├── dist/                  # Build output
└── public/               # Public static files
```

## License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.
