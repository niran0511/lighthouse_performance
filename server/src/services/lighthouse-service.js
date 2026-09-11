import { launch as launchChrome } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { config } from '../config/env.js';
import { AppError } from '../utils/app-error.js';
import { percentageScore } from '../utils/score.js';

const importantAuditIds = [
  'first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'speed-index', 'cumulative-layout-shift',
  'render-blocking-resources', 'uses-optimized-images', 'uses-responsive-images', 'unused-javascript', 'unused-css-rules',
  'uses-long-cache-ttl', 'uses-text-compression', 'dom-size', 'mainthread-work-breakdown', 'bootup-time', 'total-byte-weight',
];

function numericAudit(audits, id, divisor = 1) {
  const value = audits[id]?.numericValue;
  return typeof value === 'number' ? Number((value / divisor).toFixed(3)) : null;
}

export function normalizeLighthouseResult(lhr) {
  const audits = lhr?.audits || {};
  const categories = lhr?.categories || {};
  return {
    performanceScore: percentageScore(categories.performance?.score),
    accessibilityScore: percentageScore(categories.accessibility?.score),
    bestPracticesScore: percentageScore(categories['best-practices']?.score),
    seoScore: percentageScore(categories.seo?.score),
    pwaScore: percentageScore(categories.pwa?.score),
    metrics: {
      fcp: numericAudit(audits, 'first-contentful-paint', 1000),
      lcp: numericAudit(audits, 'largest-contentful-paint', 1000),
      cls: numericAudit(audits, 'cumulative-layout-shift'),
      tbt: numericAudit(audits, 'total-blocking-time'),
      speedIndex: numericAudit(audits, 'speed-index', 1000),
    },
    audits: importantAuditIds
      .filter((id) => audits[id])
      .map((id) => ({
        id,
        title: audits[id].title,
        score: typeof audits[id].score === 'number' ? audits[id].score : null,
        numericValue: typeof audits[id].numericValue === 'number' ? audits[id].numericValue : null,
        displayValue: audits[id].displayValue || null,
      })),
    lighthouseVersion: lhr.lighthouseVersion || 'Unknown',
    rawAudits: audits,
  };
}

export async function executeLighthouse(url, dependencies = {}) {
  const chromeLauncher = dependencies.launchChrome || launchChrome;
  const runLighthouse = dependencies.runLighthouse || lighthouse;
  let chrome;
  let result;
  let timeoutHandle;
  
  try {
    chrome = await chromeLauncher({
      chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
      userDataDir: false,
    });
    
    // Set up timeout that will forcefully kill Chrome
    const timeoutPromise = new Promise((_, reject) => {
      timeoutHandle = setTimeout(async () => {
        console.warn('[WARN] Lighthouse timeout reached, forcefully killing Chrome...');
        if (chrome) {
          try {
            await chrome.kill();
          } catch (e) {
            console.error('[ERROR] Failed to kill Chrome on timeout:', e.message);
          }
        }
        reject(new AppError('Lighthouse scan timed out.', 504, 'LIGHTHOUSE_TIMEOUT'));
      }, config.lighthouseTimeoutMs);
    });
    
    result = await Promise.race([
      runLighthouse(url, {
        port: chrome.port,
        output: 'json',
        logLevel: 'error',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
        formFactor: 'desktop',
        screenEmulation: { disabled: true },
      }),
      timeoutPromise,
    ]);
    
    // Clear timeout if scan completed successfully
    if (timeoutHandle) clearTimeout(timeoutHandle);
    
    if (!result?.lhr) throw new AppError('Lighthouse did not return a report.', 502, 'LIGHTHOUSE_SCAN_FAILED');
    
    // Clean up Chrome before returning
    if (chrome) {
      try {
        await chrome.kill();
      } catch (cleanupError) {
        console.warn('[WARN] Chrome cleanup failed (non-critical):', cleanupError.message);
      }
    }
    
    return normalizeLighthouseResult(result.lhr);
  } catch (error) {
    // Clear timeout on error
    if (timeoutHandle) clearTimeout(timeoutHandle);
    
    // Clean up Chrome on error
    if (chrome) {
      try {
        await chrome.kill();
      } catch (cleanupError) {
        console.warn('[WARN] Chrome cleanup failed during error handling:', cleanupError.message);
      }
    }
    
    if (error instanceof AppError) throw error;
    throw new AppError('Unable to analyze the provided URL.', 502, 'LIGHTHOUSE_SCAN_FAILED');
  }
}

