# URL Configuration for EnergyHub

This document explains how to configure URLs for different deployment environments in EnergyHub.

## Environment Variables

The application uses the following environment variables to determine the correct URLs:

### Required Variables

- `NEXT_PUBLIC_BASE_URL`: The base URL for your application
- `NEXT_PUBLIC_BASE_PATH`: The base path for your application (if deployed in a subdirectory)

### Optional Variables

- `GITHUB_PAGES_URL`: GitHub Pages specific URL
- `VERCEL_URL`: Vercel deployment URL (automatically set)
- `NETLIFY_URL`: Netlify deployment URL (automatically set)

## Configuration Examples

### GitHub Pages Deployment

```bash
NEXT_PUBLIC_BASE_URL=https://edcalderon.github.io
NEXT_PUBLIC_BASE_PATH=/EnergyHub
GITHUB_PAGES_URL=https://edcalderon.github.io
NODE_ENV=production
```

### Vercel Deployment

```bash
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
NEXT_PUBLIC_BASE_PATH=
NODE_ENV=production
```

### Local Development

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_BASE_PATH=
NODE_ENV=development
```

## How It Works

The URL utility (`src/lib/url-utils.ts`) automatically detects the deployment environment and generates the correct URLs for:

1. **Asset URLs**: Images, logos, and other static assets
2. **Internal Links**: Navigation between pages
3. **External Links**: Links to external websites

## Usage in Components

```typescript
import { getCelsiaLogoUrl, getInternalUrl, getAssetUrl } from '@/lib/url-utils';

// Get Celsia logo URL
const logoUrl = getCelsiaLogoUrl();

// Get internal page URL
const dashboardUrl = getInternalUrl('/dashboard');

// Get any asset URL
const imageUrl = getAssetUrl('/images/hero.jpg');
```

## Debugging

In development mode, the utility will log URL information to the console:

```typescript
import { debugUrls } from '@/lib/url-utils';

// This will log URL configuration in development
debugUrls('My Component');
```

## Production Deployment

For GitHub Pages deployment, the application automatically detects the production environment and uses the correct base path (`/EnergyHub`) for all URLs.

The Celsia logos and other assets will be properly loaded from the correct paths in production.
