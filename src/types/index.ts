/**
 * Type definitions for EcoAlert
 */

export type Timeframe = 'hour' | 'day' | 'week' | 'month' | 'decade';
export type ImpactDirection = 'positive' | 'negative' | 'neutral';
export type ForceDirection = 'accelerating' | 'decelerating' | 'stable';
export type ForceCategory = 'economic' | 'social' | 'political';
export type PatternDirection = 'bullish' | 'bearish' | 'neutral';

export type ScoreRange = number; // 0-100

export interface ConfidenceMetrics {
  overall: ScoreRange;
  pattern: ScoreRange;
  structural: ScoreRange;
  events: ScoreRange;
  contrarian: ScoreRange;
}

export interface ProbabilityDistribution {
  bullish: ScoreRange; // 0-100
  bearish: ScoreRange; // 0-100
  neutral: ScoreRange; // 0-100
}

export interface ForecastMetadata {
  id: string;
  timestamp: Date;
  domain: string;
  version: string;
  engine: string;
}
