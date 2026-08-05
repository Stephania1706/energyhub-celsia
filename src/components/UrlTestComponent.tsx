import React, { useEffect, useState } from 'react';
import { 
  getCelsiaLogoUrl, 
  getCelsiaLogoUrlForPDF, 
  getBaseUrl, 
  getBasePath, 
  debugUrls,
  getDeploymentEnvironment,
  getUrlEnvironmentVariables 
} from '@/lib/url-utils';

/**
 * Test component to verify URL utility functionality
 * This component can be temporarily added to any page to test URL generation
 */
export default function UrlTestComponent() {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    // Debug URLs in development
    debugUrls('URL Test Component');
  }, []);

  const testLogoUrl = getCelsiaLogoUrl();
  const testPdfLogoUrl = getCelsiaLogoUrlForPDF();
  const baseUrl = getBaseUrl();
  const basePath = getBasePath();
  const deploymentEnv = getDeploymentEnvironment();
  const envVars = getUrlEnvironmentVariables();

  return (
    <div className="fixed top-4 left-4 z-50 bg-background/95 backdrop-blur-md border border-border/60 rounded-lg p-4 shadow-lg max-w-md">
      <h3 className="text-sm font-semibold mb-2">URL Test Component</h3>
      
      <div className="space-y-2 text-xs">
        <div>
          <strong>Base URL:</strong> {baseUrl}
        </div>
        <div>
          <strong>Base Path:</strong> {basePath}
        </div>
        <div>
          <strong>Deployment:</strong> {deploymentEnv}
        </div>
        <div>
          <strong>Logo URL:</strong> {testLogoUrl}
        </div>
        <div>
          <strong>PDF Logo URL:</strong> {testPdfLogoUrl}
        </div>
      </div>

      {/* Test Celsia Logo Loading */}
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <img 
            src={testLogoUrl}
            alt="Celsia Logo Test"
            className="h-6 w-6 object-contain border border-border rounded"
            onLoad={() => {
              setLogoLoaded(true);
              setLogoError(false);
              console.log('Test Component - Logo loaded successfully');
            }}
            onError={(e) => {
              setLogoLoaded(false);
              setLogoError(true);
              console.error('Test Component - Logo failed to load:', e);
            }}
          />
          <span className="text-xs">
            {logoLoaded ? '✅ Loaded' : logoError ? '❌ Failed' : '⏳ Loading...'}
          </span>
        </div>
      </div>

      {/* Environment Variables */}
      <div className="mt-4">
        <details className="text-xs">
          <summary className="cursor-pointer font-semibold">Environment Variables</summary>
          <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
            {JSON.stringify(envVars, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}
