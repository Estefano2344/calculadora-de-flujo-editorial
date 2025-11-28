import { ProjectConfig, TeamConfig, RateConfig, CalculationResult, StageResult } from './types';
import { STAGE_COLORS } from './constants';

export const calculateTimeline = (
  project: ProjectConfig,
  team: TeamConfig,
  rates: RateConfig
): CalculationResult => {
  const totalPages = project.numberOfBooks * project.pagesPerBook;
  const totalBooks = project.numberOfBooks;

  // Helper to calculate duration in working days (avoiding division by zero)
  const calcDuration = (workload: number, rate: number, people: number) => {
    if (people <= 0 || rate <= 0) return 0;
    const dailyThroughput = rate * people;
    return Math.ceil(workload / dailyThroughput);
  };

  // Helper for fixed per-book duration tasks
  const calcFixedDuration = (daysPerBook: number, books: number, people: number) => {
    if (people <= 0) return 0;
    // Total man-days needed
    const totalManDays = daysPerBook * books;
    // Calendar days = man-days / people
    return Math.ceil(totalManDays / people);
  };

  const stages: StageResult[] = [];
  let currentDay = 0;

  // 1. Content Development
  const contentDays = calcDuration(totalPages, rates.contentPagesPerDay, team.contentDev);
  stages.push({
    id: 'content',
    name: 'Desarrollo de Contenidos',
    durationDays: contentDays,
    startDate: currentDay,
    endDate: currentDay + contentDays,
    color: STAGE_COLORS.content,
  });
  currentDay += contentDays;

  // 2. Illustration / Images
  const illustrationDays = calcFixedDuration(rates.illustrationDaysPerBook, totalBooks, team.illustration);
  stages.push({
    id: 'illustration',
    name: 'Elaboración de Imágenes',
    durationDays: illustrationDays,
    startDate: currentDay,
    endDate: currentDay + illustrationDays,
    color: STAGE_COLORS.illustration,
  });
  currentDay += illustrationDays;

  // 3. Design (Diagramación)
  const designDays = calcDuration(totalPages, rates.designPagesPerDay, team.design);
  stages.push({
    id: 'design',
    name: 'Diagramación',
    durationDays: designDays,
    startDate: currentDay,
    endDate: currentDay + designDays,
    color: STAGE_COLORS.design,
  });
  currentDay += designDays;

  // 4. Review
  const reviewDays = calcDuration(totalPages, rates.reviewPagesPerDay, team.review);
  stages.push({
    id: 'review',
    name: 'Revisión',
    durationDays: reviewDays,
    startDate: currentDay,
    endDate: currentDay + reviewDays,
    color: STAGE_COLORS.review,
  });
  currentDay += reviewDays;

  // 5. Corrections (Second Diagramming)
  const correctionDays = calcDuration(totalPages, rates.correctionPagesPerDay, team.corrections);
  stages.push({
    id: 'corrections',
    name: 'Segunda Diagramación (Cambios)',
    durationDays: correctionDays,
    startDate: currentDay,
    endDate: currentDay + correctionDays,
    color: STAGE_COLORS.corrections,
  });
  currentDay += correctionDays;

  // 6. Final Review
  const finalReviewDays = calcFixedDuration(rates.finalReviewDaysPerBook, totalBooks, team.finalReview);
  stages.push({
    id: 'final',
    name: 'Revisión Final',
    durationDays: finalReviewDays,
    startDate: currentDay,
    endDate: currentDay + finalReviewDays,
    color: STAGE_COLORS.final,
  });
  currentDay += finalReviewDays;

  return {
    stages,
    totalDays: currentDay,
    totalWeeks: parseFloat((currentDay / 5).toFixed(1)), // Assuming 5-day work week
    totalMonths: parseFloat((currentDay / 21.6).toFixed(1)), // Avg working days in month
  };
};