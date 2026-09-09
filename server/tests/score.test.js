import { describe, expect, it } from 'vitest';
import { classifyScore, percentageScore } from '../src/utils/score.js';

describe('score utilities', () => {
  it.each([[90, 'GOOD'], [50, 'NEEDS_IMPROVEMENT'], [49, 'POOR'], [null, 'UNKNOWN']])('classifies %s as %s', (score, expected) => {
    expect(classifyScore(score)).toBe(expected);
  });

  it('turns Lighthouse fractions into percentages', () => {
    expect(percentageScore(0.924)).toBe(92);
    expect(percentageScore(null)).toBeNull();
  });
});

