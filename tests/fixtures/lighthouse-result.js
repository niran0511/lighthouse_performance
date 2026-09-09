export const lighthouseFixture = {
  lhr: {
    lighthouseVersion: '12.0.0',
    categories: {
      performance: { score: 0.42 },
      accessibility: { score: 0.93 },
      'best-practices': { score: 0.86 },
      seo: { score: 0.95 },
    },
    audits: {
      'first-contentful-paint': { numericValue: 2200, displayValue: '2.2 s' },
      'largest-contentful-paint': { numericValue: 4900, displayValue: '4.9 s', score: 0.1, title: 'Largest Contentful Paint' },
      'total-blocking-time': { numericValue: 880, displayValue: '880 ms' },
      'speed-index': { numericValue: 3500, displayValue: '3.5 s' },
      'cumulative-layout-shift': { numericValue: 0.18, displayValue: '0.18' },
      'render-blocking-resources': { score: 0, title: 'Eliminate render-blocking resources', displayValue: 'Potential savings of 1,200 ms' },
      'unused-javascript': { score: 0.2, title: 'Reduce unused JavaScript', displayValue: 'Potential savings of 400 KiB' },
    },
  },
};

