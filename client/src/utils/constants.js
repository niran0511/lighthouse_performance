/**
 * Application-wide constants
 */

export const SCAN_STATUS = {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
};

export const SCORE_THRESHOLDS = {
  GOOD: 90,
  NEEDS_IMPROVEMENT: 50,
  POOR: 0,
};

export const SEVERITY_LEVELS = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
};

export const SEVERITY_COLORS = {
  HIGH: '#ef4444',
  MEDIUM: '#f59e0b',
  LOW: '#3b82f6',
};

export const METRIC_THRESHOLDS = {
  FCP: { good: 1.8, needsImprovement: 3.0 },
  LCP: { good: 2.5, needsImprovement: 4.0 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  TBT: { good: 200, needsImprovement: 600 },
  SPEED_INDEX: { good: 3.4, needsImprovement: 5.8 },
};
