export enum Complexity {
  SIMPLE = 'Sencillo',
  COMPLEX = 'Complejo',
}

export interface ProjectConfig {
  name: string;
  subject: string;
  complexity: Complexity;
  numberOfBooks: number;
  pagesPerBook: number;
}

export interface TeamConfig {
  contentDev: number;
  illustration: number;
  design: number;
  review: number;
  corrections: number;
  finalReview: number;
}

export interface RateConfig {
  contentPagesPerDay: number;
  illustrationDaysPerBook: number;
  designPagesPerDay: number;
  reviewPagesPerDay: number; // Normalized from "1 week per 160-180 pages"
  correctionPagesPerDay: number;
  finalReviewDaysPerBook: number;
}

export interface StageResult {
  id: string;
  name: string;
  durationDays: number;
  startDate: number; // Relative day
  endDate: number;   // Relative day
  color: string;
}

export interface CalculationResult {
  stages: StageResult[];
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
}