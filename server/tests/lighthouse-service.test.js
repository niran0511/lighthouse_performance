import { describe, expect, it } from 'vitest';
import { normalizeLighthouseResult } from '../src/services/lighthouse-service.js';
import { lighthouseFixture } from '../../tests/fixtures/lighthouse-result.js';

describe('Lighthouse normalization', () => {
  it('extracts stable score and metric values without assuming optional audits', () => {
    const report = normalizeLighthouseResult(lighthouseFixture.lhr);
    expect(report).toMatchObject({
      performanceScore: 42,
      accessibilityScore: 93,
      metrics: { fcp: 2.2, lcp: 4.9, tbt: 880, cls: 0.18, speedIndex: 3.5 },
      lighthouseVersion: '12.0.0',
    });
    expect(report.audits).toHaveLength(7);
  });
});

