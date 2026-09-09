const severityRank = { HIGH: 0, MEDIUM: 1, LOW: 2 };

const auditRules = {
  'render-blocking-resources': {
    issue: 'Render-blocking resources delay first paint.', severity: 'HIGH', impact: 'Critical CSS and JavaScript are delaying visual content.',
    recommendation: 'Inline critical CSS, defer non-critical styles and scripts, and preload only essential resources.',
  },
  'unused-javascript': {
    issue: 'Unused JavaScript was detected.', severity: 'MEDIUM', impact: 'Unneeded code increases download, parse, and execution time.',
    recommendation: 'Remove unused JavaScript, split bundles, lazy-load non-critical modules, and review third-party scripts.',
  },
  'unused-css-rules': {
    issue: 'Unused CSS was detected.', severity: 'LOW', impact: 'Unused styles increase render-blocking payload.',
    recommendation: 'Remove unused selectors, split page-level styles, and avoid loading component CSS that is not needed initially.',
  },
  'uses-optimized-images': {
    issue: 'Images are not efficiently encoded.', severity: 'HIGH', impact: 'Image bytes are increasing LCP and network transfer time.',
    recommendation: 'Serve correctly sized images in AVIF or WebP, compress source assets, and provide responsive srcset variants.',
  },
  'uses-responsive-images': {
    issue: 'Images are larger than their rendered size.', severity: 'MEDIUM', impact: 'Visitors download unnecessary image bytes.',
    recommendation: 'Use responsive images with srcset and sizes so each viewport receives an appropriately sized asset.',
  },
  'uses-text-compression': {
    issue: 'Text assets are not compressed.', severity: 'HIGH', impact: 'HTML, CSS, and JavaScript transfers are larger than necessary.',
    recommendation: 'Enable Brotli or gzip compression for text responses and verify your CDN preserves content-encoding.',
  },
  'uses-long-cache-ttl': {
    issue: 'Static assets have inefficient cache lifetimes.', severity: 'MEDIUM', impact: 'Returning visitors repeatedly download unchanged resources.',
    recommendation: 'Set long immutable cache-control headers for versioned static assets and use cache-busting file names on deploy.',
  },
  'dom-size': {
    issue: 'The page has an excessive DOM size.', severity: 'MEDIUM', impact: 'Large DOM trees make style calculation and layout more expensive.',
    recommendation: 'Remove unnecessary nodes, virtualize long lists, and avoid deeply nested layout wrappers.',
  },
  'mainthread-work-breakdown': {
    issue: 'Main-thread work is too expensive.', severity: 'HIGH', impact: 'Long main-thread tasks delay interaction and visual updates.',
    recommendation: 'Break up long tasks, reduce JavaScript work, move suitable calculations to workers, and defer non-critical scripts.',
  },
  'bootup-time': {
    issue: 'JavaScript execution time is high.', severity: 'MEDIUM', impact: 'Slow script evaluation harms responsiveness and Total Blocking Time.',
    recommendation: 'Reduce bundle size, code-split routes, remove expensive libraries, and defer third-party JavaScript.',
  },
  'total-byte-weight': {
    issue: 'Network payload is too large.', severity: 'MEDIUM', impact: 'Large transfers slow loading, especially on constrained networks.',
    recommendation: 'Set performance budgets, compress assets, remove unused resources, and lazy-load non-critical media.',
  },
};

function hasPoorScore(audit) {
  return audit && typeof audit.score === 'number' && audit.score < 0.9;
}

function metricRecommendation(auditId, audit, threshold, mediumThreshold, copy) {
  if (!audit || typeof audit.numericValue !== 'number' || audit.numericValue <= threshold) return null;
  return {
    auditId,
    severity: audit.numericValue > mediumThreshold ? 'HIGH' : 'MEDIUM',
    ...copy,
  };
}

export function generateRecommendations(audits = {}) {
  const recommendations = [];
  const lcp = metricRecommendation('largest-contentful-paint', audits['largest-contentful-paint'], 2500, 4000, {
    issue: 'Largest Contentful Paint is above the recommended threshold.',
    impact: 'The main page content is appearing too late for visitors.',
    recommendation: 'Optimize the LCP element, preload critical assets, reduce render-blocking CSS/JS, and improve server response time.',
  });
  const fcp = metricRecommendation('first-contentful-paint', audits['first-contentful-paint'], 1800, 3000, {
    issue: 'First Contentful Paint is slow.',
    impact: 'Visitors wait too long before seeing the first page content.',
    recommendation: 'Reduce server response time, remove render-blocking resources, and prioritize critical content and fonts.',
  });
  const tbt = metricRecommendation('total-blocking-time', audits['total-blocking-time'], 200, 600, {
    issue: 'Total Blocking Time is high.',
    impact: 'Long JavaScript tasks can make the page feel unresponsive.',
    recommendation: 'Split long tasks, reduce JavaScript execution, defer non-critical scripts, and limit third-party code.',
  });
  const cls = metricRecommendation('cumulative-layout-shift', audits['cumulative-layout-shift'], 0.1, 0.25, {
    issue: 'Cumulative Layout Shift exceeds the recommended threshold.',
    impact: 'Unexpected layout movement can cause misclicks and a poor user experience.',
    recommendation: 'Reserve dimensions for images and embeds, avoid injecting content above existing content, and stabilize web-font loading.',
  });

  [lcp, fcp, tbt, cls].filter(Boolean).forEach((item) => recommendations.push(item));

  Object.entries(auditRules).forEach(([auditId, rule]) => {
    if (hasPoorScore(audits[auditId])) recommendations.push({ auditId, ...rule });
  });

  return recommendations
    .sort((left, right) => severityRank[left.severity] - severityRank[right.severity])
    .slice(0, 12);
}

