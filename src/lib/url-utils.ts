/**
 * URL Utilities for EnergyHub
 * 
 * Handles proper URL generation for both development and production environments.
 * Production environment uses GitHub Pages with base path '/EnergyHub'.
 */

/**
 * Get the base URL for the current environment
 * @returns The base URL for assets and links
 */
export function getBaseUrl(): string {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Check for environment variables first
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  if (process.env.GITHUB_PAGES_URL) {
    return process.env.GITHUB_PAGES_URL;
  }
  
  // Fallback to environment-based detection
  if (process.env.NODE_ENV === 'production') {
    return 'https://edcalderon.github.io';
  }
  
  // Development
  return 'http://localhost:3000';
}

/**
 * Get the base path for the current environment
 * @returns The base path for assets and links
 */
export function getBasePath(): string {
  // Check for environment variables first
  if (process.env.NEXT_PUBLIC_BASE_PATH) {
    return process.env.NEXT_PUBLIC_BASE_PATH;
  }
  
  // Check if we're on GitHub Pages
  if (process.env.GITHUB_PAGES_URL || process.env.NODE_ENV === 'production') {
    return '/EnergyHub';
  }
  
  return '';
}

/**
 * Generate a proper asset URL that works in both development and production
 * @param path - The asset path (e.g., '/celsia-logo.png')
 * @returns The full URL for the asset
 */
export function getAssetUrl(path: string): string {
  // Ensure path starts with '/'
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  if (process.env.NODE_ENV === 'production') {
    return `${getBaseUrl()}${getBasePath()}${normalizedPath}`;
  }
  
  return `${getBaseUrl()}${normalizedPath}`;
}

/**
 * Generate a proper internal link URL that works in both development and production
 * @param path - The internal path (e.g., '/dashboard')
 * @returns The relative path for Next.js Link component
 */
export function getInternalUrl(path: string): string {
  // Ensure path starts with '/'
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // For Next.js Link component, we need to return the path relative to the base path
  // Next.js will automatically handle the base URL and basePath from next.config.js
  return normalizedPath;
}

/**
 * Generate a full internal URL (for use outside of Next.js Link components)
 * @param path - The internal path (e.g., '/dashboard')
 * @returns The full URL for the internal link
 */
export function getFullInternalUrl(path: string): string {
  // Ensure path starts with '/'
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  if (process.env.NODE_ENV === 'production') {
    return `${getBaseUrl()}${getBasePath()}${normalizedPath}`;
  }
  
  return `${getBaseUrl()}${normalizedPath}`;
}

/**
 * Get the Celsia logo URL for use in components
 * @returns The proper URL for the Celsia logo
 */
export function getCelsiaLogoUrl(): string {
  return getAssetUrl('/celsia-logo.png');
}

/**
 * Get the Celsia logo URL for use in PDF generation
 * @returns The proper URL for the Celsia logo in PDFs
 */
export function getCelsiaLogoUrlForPDF(): string {
  return getAssetUrl('/celsia.png');
}

/**
 * Get the full URL for external links (like Celsia website)
 * @param url - The external URL
 * @returns The external URL as-is
 */
export function getExternalUrl(url: string): string {
  return url;
}

/**
 * Check if we're in production environment
 * @returns True if in production, false otherwise
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Get the current environment name
 * @returns 'production' or 'development'
 */
export function getEnvironment(): string {
  return process.env.NODE_ENV || 'development';
}

/**
 * Utility to handle image loading with fallback
 * @param imageUrl - The image URL
 * @param fallbackText - Fallback text if image fails to load
 * @returns Object with image URL and fallback handling
 */
export function createImageWithFallback(imageUrl: string, fallbackText: string) {
  return {
    src: imageUrl,
    onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const target = e.currentTarget;
      target.style.display = 'none';
      const fallbackElement = target.nextElementSibling as HTMLElement;
      if (fallbackElement) {
        fallbackElement.classList.remove('hidden');
        fallbackElement.textContent = fallbackText;
      }
    }
  };
}

/**
 * Detect the deployment environment
 * @returns The detected deployment environment
 */
export function getDeploymentEnvironment(): 'github-pages' | 'vercel' | 'netlify' | 'local' | 'unknown' {
  // Check for specific deployment indicators
  if (process.env.GITHUB_PAGES_URL || process.env.NODE_ENV === 'production') {
    return 'github-pages';
  }
  
  if (process.env.VERCEL_URL) {
    return 'vercel';
  }
  
  if (process.env.NETLIFY_URL) {
    return 'netlify';
  }
  
  if (process.env.NODE_ENV === 'development') {
    return 'local';
  }
  
  return 'unknown';
}

/**
 * Get all environment variables related to URLs
 * @returns Object with all URL-related environment variables
 */
export function getUrlEnvironmentVariables(): Record<string, string | undefined> {
  return {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH,
    VERCEL_URL: process.env.VERCEL_URL,
    GITHUB_PAGES_URL: process.env.GITHUB_PAGES_URL,
    NETLIFY_URL: process.env.NETLIFY_URL,
  };
}

/**
 * Debug utility to log URL information
 * @param context - Context for the debug log
 */
export function debugUrls(context: string = 'URL Debug'): void {
  const debugInfo = {
    environment: getEnvironment(),
    deploymentEnvironment: getDeploymentEnvironment(),
    baseUrl: getBaseUrl(),
    basePath: getBasePath(),
    celsiaLogoUrl: getCelsiaLogoUrl(),
    celsiaLogoUrlForPDF: getCelsiaLogoUrlForPDF(),
    internalUrl: getInternalUrl('/dashboard'),
    fullInternalUrl: getFullInternalUrl('/dashboard'),
    isProduction: isProduction(),
    envVariables: getUrlEnvironmentVariables()
  };

  if (process.env.NODE_ENV === 'development') {
    console.log(`[${context}]`, debugInfo);
  } else {
    // In production, log minimal info for debugging
    console.log(`[${context}] URLs configured:`, {
      baseUrl: debugInfo.baseUrl,
      basePath: debugInfo.basePath,
      celsiaLogoUrl: debugInfo.celsiaLogoUrl
    });
  }
}
