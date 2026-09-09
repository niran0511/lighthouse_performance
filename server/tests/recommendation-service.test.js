import { describe, expect, it } from 'vitest';
import { generateRecommendations } from '../src/services/recommendation-service.js';

describe('recommendation service', () => {
  it('creates a high-severity LCP recommendation for a poor audit', () => {
    const recommendations = generateRecommendations({
      'largest-contentful-paint': { numericValue: 4800, score: 0.1 },
    });
    expect(recommendations[0]).toMatchObject({
      auditId: 'largest-contentful-paint',
      severity: 'HIGH',
    });
    expect(recommendations[0].recommendation).toMatch(/LCP element/i);
  });

  it('sorts high-impact work before medium-impact audit findings', () => {
    const recommendations = generateRecommendations({
      'unused-javascript': { score: 0.1 },
      'render-blocking-resources': { score: 0 },
    });
    expect(recommendations.map((item) => item.severity)).toEqual(['HIGH', 'MEDIUM']);
  });

  it('does not suggest work for passing audits', () => {
    expect(generateRecommendations({ 'unused-javascript': { score: 1 } })).toEqual([]);
  });
});

