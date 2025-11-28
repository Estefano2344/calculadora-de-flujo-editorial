import { RateConfig } from './types';

// Derived from user prompt: "22 pages daily"
export const RATES_SIMPLE: RateConfig = {
  contentPagesPerDay: 22,
  illustrationDaysPerBook: 1, 
  designPagesPerDay: 12,
  reviewPagesPerDay: 34, // ~170 pages / 5 days (1 week)
  correctionPagesPerDay: 30, // Estimated for "Segunda Diagramación" (faster than first)
  finalReviewDaysPerBook: 0.5,
};

// Derived from user prompt: "Up to 4 days" for content (approx 1/4 speed of simple), etc.
export const RATES_COMPLEX: RateConfig = {
  contentPagesPerDay: 5.5, // 22 pages / 4 days
  illustrationDaysPerBook: 3,
  designPagesPerDay: 8,
  reviewPagesPerDay: 34, // Review time assumed constant per page volume unless specified
  correctionPagesPerDay: 20,
  finalReviewDaysPerBook: 0.5,
};

export const STAGE_COLORS = {
  content: '#3b82f6', // blue-500
  illustration: '#a855f7', // purple-500
  design: '#eab308', // yellow-500
  review: '#f97316', // orange-500
  corrections: '#ef4444', // red-500
  final: '#10b981', // emerald-500
};