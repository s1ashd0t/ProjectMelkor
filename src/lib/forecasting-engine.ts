/**
 * Core prediction engine that synthesizes multiple data sources
 */

export interface HistoricalPattern {
  name: string;
  strength: number; // 0-1
  direction: 'bullish' | 'bearish' | 'neutral';
  relevance: number; // 0-1
}

export interface StructuralForce {
  name: string;
  category: 'economic' | 'social' | 'political';
  direction: 'accelerating' | 'decelerating' | 'stable';
  magnitude: number; // 0-1
  timeframe: string;
}

export interface CurrentEvent {
  title: string;
  date: Date;
  impact: 'positive' | 'negative' | 'neutral';
  magnitude: number; // 0-1
  relevance: number; // 0-1
}

export interface ContraryViewpoint {
  description: string;
  rationale: string;
  probability: number; // 0-1
  catalysts: string[];
}

export interface PredictionInput {
  domain: string;
  description: string;
  historicalPatterns: HistoricalPattern[];
  structuralForces: StructuralForce[];
  currentEvents: CurrentEvent[];
  contraryViewpoints: ContraryViewpoint[];
}

export interface TimeHorizonPrediction {
  timeframe: 'hour' | 'day' | 'week' | 'month' | 'decade';
  prediction: string;
  confidenceLevel: number; // 0-100
  bullishProbability: number; // 0-100
  bearishProbability: number; // 0-100
  neutralProbability: number; // 0-100
  reasoning: string;
  keyFactors: string[];
  riskFactors: string[];
  assumptions: string[];
}

export interface Prediction {
  id: string;
  timestamp: Date;
  input: PredictionInput;
  predictions: TimeHorizonPrediction[];
  overallConfidence: number; // 0-100
  methodology: string;
  limitations: string[];
}

/**
 * Synthesize multiple factors into a comprehensive prediction
 */
export class ForecastingEngine {
  private readonly timeframeWeights = {
    hour: { patterns: 0.3, structural: 0.1, events: 0.5, contrarian: 0.1 },
    day: { patterns: 0.35, structural: 0.15, events: 0.4, contrarian: 0.1 },
    week: { patterns: 0.4, structural: 0.2, events: 0.3, contrarian: 0.1 },
    month: { patterns: 0.45, structural: 0.3, events: 0.15, contrarian: 0.1 },
    decade: { patterns: 0.4, structural: 0.5, events: 0.05, contrarian: 0.05 },
  };

  /**
   * Calculate influence from historical patterns
   */
  private analyzeHistoricalPatterns(patterns: HistoricalPattern[]): {
    score: number;
    confidence: number;
    direction: string;
  } {
    if (patterns.length === 0) {
      return { score: 50, confidence: 20, direction: 'neutral' };
    }

    const bullishPatterns = patterns.filter(p => p.direction === 'bullish');
    const bearishPatterns = patterns.filter(p => p.direction === 'bearish');
    const neutralPatterns = patterns.filter(p => p.direction === 'neutral');

    const bullishScore = bullishPatterns.reduce((sum, p) => sum + (p.strength * p.relevance), 0) / Math.max(bullishPatterns.length, 1);
    const bearishScore = bearishPatterns.reduce((sum, p) => sum + (p.strength * p.relevance), 0) / Math.max(bearishPatterns.length, 1);
    const neutralScore = neutralPatterns.reduce((sum, p) => sum + p.relevance, 0) / Math.max(neutralPatterns.length, 1);

    const totalRelevance = patterns.reduce((sum, p) => sum + p.relevance, 0);
    const avgRelevance = totalRelevance / patterns.length;
    const confidence = Math.min(100, avgRelevance * 100);

    const netScore = (bullishScore * 100) - (bearishScore * 100) + 50;
    const clampedScore = Math.max(0, Math.min(100, netScore));

    let direction = 'neutral';
    if (bullishScore > bearishScore * 1.2) direction = 'bullish';
    else if (bearishScore > bullishScore * 1.2) direction = 'bearish';

    return { score: clampedScore, confidence, direction };
  }

  /**
   * Analyze structural economic/social/political forces
   */
  private analyzeStructuralForces(forces: StructuralForce[]): {
    score: number;
    confidence: number;
    impact: string;
  } {
    if (forces.length === 0) {
      return { score: 50, confidence: 20, impact: 'neutral' };
    }

    const accelerating = forces.filter(f => f.direction === 'accelerating');
    const decelerating = forces.filter(f => f.direction === 'decelerating');

    const acceleratingImpact = accelerating.reduce((sum, f) => sum + (f.magnitude * 100), 0) / Math.max(accelerating.length, 1);
    const deceleratingImpact = decelerating.reduce((sum, f) => sum + (f.magnitude * 100), 0) / Math.max(decelerating.length, 1);

    const avgMagnitude = forces.reduce((sum, f) => sum + f.magnitude, 0) / forces.length;
    const confidence = Math.min(100, avgMagnitude * 100 * 0.8 + 20);

    const netScore = acceleratingImpact - deceleratingImpact + 50;
    const clampedScore = Math.max(0, Math.min(100, netScore));

    let impact = 'neutral';
    if (acceleratingImpact > deceleratingImpact * 1.3) impact = 'accelerating';
    else if (deceleratingImpact > acceleratingImpact * 1.3) impact = 'decelerating';

    return { score: clampedScore, confidence, impact };
  }

  /**
   * Process current events and recent developments
   */
  private analyzeCurrentEvents(events: CurrentEvent[]): {
    score: number;
    confidence: number;
    direction: string;
    recencyBias: number;
  } {
    if (events.length === 0) {
      return { score: 50, confidence: 20, direction: 'neutral', recencyBias: 0 };
    }

    const now = new Date();
    const positiveEvents = events.filter(e => e.impact === 'positive');
    const negativeEvents = events.filter(e => e.impact === 'negative');

    const positiveScore = positiveEvents.reduce((sum, e) => sum + (e.magnitude * e.relevance), 0) / Math.max(positiveEvents.length, 1);
    const negativeScore = negativeEvents.reduce((sum, e) => sum + (e.magnitude * e.relevance), 0) / Math.max(negativeEvents.length, 1);

    // Apply recency bias - recent events have more weight
    const recencyWeights = events.map(e => {
      const daysAgo = (now.getTime() - e.date.getTime()) / (1000 * 60 * 60 * 24);
      return Math.exp(-daysAgo / 30); // Exponential decay over 30 days
    });

    const avgRelevance = events.reduce((sum, e) => sum + e.relevance, 0) / events.length;
    const confidence = Math.min(100, avgRelevance * 100 * 0.9);
    const recencyBias = recencyWeights.reduce((a, b) => a + b) / recencyWeights.length;

    const netScore = (positiveScore * 100) - (negativeScore * 100) + 50;
    const clampedScore = Math.max(0, Math.min(100, netScore));

    let direction = 'neutral';
    if (positiveScore > negativeScore * 1.2) direction = 'positive';
    else if (negativeScore > positiveScore * 1.2) direction = 'negative';

    return { score: clampedScore, confidence, direction, recencyBias };
  }

  /**
   * Incorporate contrarian perspectives
   */
  private analyzeContraryViewpoints(viewpoints: ContraryViewpoint[]): {
    score: number;
    confidence: number;
    highestProbabilityOutcome: string;
  } {
    if (viewpoints.length === 0) {
      return { score: 50, confidence: 10, highestProbabilityOutcome: 'consensus' };
    }

    const avgProbability = viewpoints.reduce((sum, v) => sum + v.probability, 0) / viewpoints.length;
    const rationalityScore = viewpoints.reduce((sum, v) => sum + (v.catalysts.length > 0 ? v.probability : 0), 0) / viewpoints.length;

    // Higher contrarian probability = potential opportunity/risk
    const contraryScore = 50 + (avgProbability * 100 * 0.3);
    const confidence = Math.min(100, rationalityScore * 100 * 0.5);

    const highestProbabilityViewpoint = viewpoints.reduce((prev, current) =>
      current.probability > prev.probability ? current : prev
    );

    return {
      score: Math.max(0, Math.min(100, contraryScore)),
      confidence,
      highestProbabilityOutcome: highestProbabilityViewpoint.description,
    };
  }

  /**
   * Generate prediction for a specific time horizon
   */
  private generateTimeHorizonPrediction(
    timeframe: 'hour' | 'day' | 'week' | 'month' | 'decade',
    patterns: { score: number; confidence: number; direction: string },
    structural: { score: number; confidence: number; impact: string },
    events: { score: number; confidence: number; direction: string; recencyBias: number },
    contrarian: { score: number; confidence: number; highestProbabilityOutcome: string },
    input: PredictionInput
  ): TimeHorizonPrediction {
    const weights = this.timeframeWeights[timeframe];

    // Weighted synthesis
    const synthesizedScore =
      patterns.score * weights.patterns +
      structural.score * weights.structural +
      events.score * weights.events +
      contrarian.score * weights.contrarian;

    const synthesizedConfidence = Math.min(
      100,
      (patterns.confidence * weights.patterns +
        structural.confidence * weights.structural +
        events.confidence * weights.events +
        contrarian.confidence * weights.contrarian) * 1.2
    );

    // Determine probabilities
    const bullishBias = (synthesizedScore - 50) / 50;
    const bullishProb = Math.max(5, Math.min(95, 50 + bullishBias * 45));
    const bearishProb = Math.max(5, Math.min(95, 50 - bullishBias * 45));
    const neutralProb = 100 - bullishProb - bearishProb;

    // Generate reasoning
    const reasoning = this.generateReasoning(
      timeframe,
      input,
      patterns,
      structural,
      events,
      contrarian,
      synthesizedScore,
      synthesizedConfidence
    );

    // Compile key factors
    const keyFactors = this.extractKeyFactors(input, timeframe);
    const riskFactors = this.extractRiskFactors(input);
    const assumptions = this.generateAssumptions(timeframe);

    // Generate prediction text
    const predictionText = this.generatePredictionText(
      synthesizedScore,
      bullishProb,
      bearishProb,
      timeframe
    );

    return {
      timeframe,
      prediction: predictionText,
      confidenceLevel: synthesizedConfidence,
      bullishProbability: bullishProb,
      bearishProbability: bearishProb,
      neutralProbability: 100 - bullishProb - bearishProb,
      reasoning,
      keyFactors,
      riskFactors,
      assumptions,
    };
  }

  /**
   * Generate prediction text based on scores
   */
  private generatePredictionText(
    score: number,
    bullish: number,
    bearish: number,
    timeframe: string
  ): string {
    const direction = score > 55 ? 'bullish' : score < 45 ? 'bearish' : 'neutral';
    const strength = Math.abs(score - 50) / 50;
    const strengthText = strength > 0.6 ? 'strong' : strength > 0.3 ? 'moderate' : 'slight';

    const articles: { [key: string]: { [key: string]: string[] } } = {
      bullish: {
        strong: ['Strongly expect upward momentum', 'Significantly bullish outlook expected', 'High probability of positive movement'],
        moderate: ['Expect favorable conditions', 'Moderately positive trajectory anticipated', 'Lean toward positive outcomes'],
        slight: ['Slightly favor positive direction', 'Marginally bullish posture', 'Modest upside potential'],
      },
      bearish: {
        strong: ['Strongly expect downward pressure', 'Significantly bearish outlook expected', 'High probability of negative movement'],
        moderate: ['Expect challenging conditions', 'Moderately negative trajectory anticipated', 'Lean toward negative outcomes'],
        slight: ['Slightly favor negative direction', 'Marginally bearish posture', 'Modest downside risk'],
      },
      neutral: {
        slight: ['Expect mixed signals and balance', 'No clear directional bias at this timeframe', 'Equilibrium between forces'],
        moderate: ['Uncertain direction with conflicting signals', 'Balanced risk and opportunity', 'Cautiously neutral outlook'],
        strong: ['Highly uncertain trajectory', 'Multiple competing dynamics', 'Neutral stance strongly supported'],
      },
    };

    const options = articles[direction][strengthText];
    return options[Math.floor(Math.random() * options.length)];
  }

  /**
   * Extract and synthesize key factors
   */
  private extractKeyFactors(input: PredictionInput, timeframe: string): string[] {
    const factors: string[] = [];

    // Add strongest patterns
    const topPatterns = input.historicalPatterns
      .sort((a, b) => (b.strength * b.relevance) - (a.strength * a.relevance))
      .slice(0, 2);
    factors.push(...topPatterns.map(p => `${p.name} (${p.direction})`));

    // Add significant structural forces
    const topForces = input.structuralForces
      .sort((a, b) => b.magnitude - a.magnitude)
      .slice(0, 2);
    factors.push(...topForces.map(f => `${f.name} (${f.category})`));

    // Add recent events
    const recentEvents = input.currentEvents
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 2);
    factors.push(...recentEvents.map(e => `${e.title} (${e.impact})`));

    // Add contrarian viewpoint if significant
    if (input.contraryViewpoints.length > 0) {
      const mostProbable = input.contraryViewpoints.reduce((prev, current) =>
        current.probability > prev.probability ? current : prev
      );
      if (mostProbable.probability > 0.3) {
        factors.push(`Contrarian view: ${mostProbable.description}`);
      }
    }

    return factors.slice(0, 5);
  }

  /**
   * Extract risk factors
   */
  private extractRiskFactors(input: PredictionInput): string[] {
    const risks: string[] = [];

    // Find bearish patterns
    const bearishPatterns = input.historicalPatterns.filter(p => p.direction === 'bearish');
    risks.push(...bearishPatterns.slice(0, 2).map(p => `${p.name} pattern risk`));

    // Find decelerating forces
    const deceleratingForces = input.structuralForces.filter(f => f.direction === 'decelerating');
    risks.push(...deceleratingForces.slice(0, 2).map(f => `${f.name} headwind`));

    // Find negative recent events
    const negativeEvents = input.currentEvents.filter(e => e.impact === 'negative');
    risks.push(...negativeEvents.slice(0, 2).map(e => `Recent: ${e.title}`));

    return risks.slice(0, 4);
  }

  /**
   * Generate key assumptions
   */
  private generateAssumptions(timeframe: string): string[] {
    const baseAssumptions = [
      'Historical patterns remain relevant',
      'No unprecedented black swan events',
      'Normal market/social friction coefficients',
    ];

    const timeframeSpecific: { [key: string]: string[] } = {
      hour: ['Immediate catalysts already visible', 'No major news expected in next 60 minutes'],
      day: ['News cycle continues normally', 'No emergency policy responses'],
      week: ['Current sentiment holds', 'Structural forces unchanged'],
      month: ['Seasonal patterns hold', 'External shocks unlikely'],
      decade: ['Long-term trends persist', 'Major structural transformations rare', 'Technological adoption continues'],
    };

    return [...baseAssumptions, ...(timeframeSpecific[timeframe] || [])];
  }

  /**
   * Generate detailed reasoning
   */
  private generateReasoning(
    timeframe: string,
    input: PredictionInput,
    patterns: { score: number; confidence: number; direction: string },
    structural: { score: number; confidence: number; impact: string },
    events: { score: number; confidence: number; direction: string; recencyBias: number },
    contrarian: { score: number; confidence: number; highestProbabilityOutcome: string },
    synthesizedScore: number,
    confidence: number
  ): string {
    const parts: string[] = [];

    parts.push(`Analysis for ${timeframe} horizon with ${confidence.toFixed(0)}% confidence:`);

    if (patterns.confidence > 30) {
      parts.push(`Historical patterns show ${patterns.direction} bias (${patterns.score.toFixed(0)}/100).`);
    }

    if (structural.confidence > 30) {
      parts.push(`Structural forces indicate ${structural.impact} dynamics (${structural.score.toFixed(0)}/100).`);
    }

    if (events.confidence > 30) {
      parts.push(`Recent events lean ${events.direction} with recency factor of ${(events.recencyBias * 100).toFixed(0)}%.`);
    }

    if (contrarian.confidence > 30) {
      parts.push(`Contrarian analysis highlights: ${contrarian.highestProbabilityOutcome}`);
    }

    const synthesisDirection = synthesizedScore > 55 ? 'bullish' : synthesizedScore < 45 ? 'bearish' : 'neutral';
    parts.push(`Synthesis of all factors yields ${synthesisDirection} outlook (${synthesizedScore.toFixed(0)}/100).`);

    return parts.join(' ');
  }

  /**
   * Generate complete prediction
   */
  public forecast(input: PredictionInput): Prediction {
    const patterns = this.analyzeHistoricalPatterns(input.historicalPatterns);
    const structural = this.analyzeStructuralForces(input.structuralForces);
    const events = this.analyzeCurrentEvents(input.currentEvents);
    const contrarian = this.analyzeContraryViewpoints(input.contraryViewpoints);

    const predictions: TimeHorizonPrediction[] = [];
    const timeframes: Array<'hour' | 'day' | 'week' | 'month' | 'decade'> = ['hour', 'day', 'week', 'month', 'decade'];

    for (const timeframe of timeframes) {
      predictions.push(
        this.generateTimeHorizonPrediction(timeframe, patterns, structural, events, contrarian, input)
      );
    }

    const overallConfidence = (patterns.confidence + structural.confidence + events.confidence + contrarian.confidence) / 4;

    return {
      id: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      input,
      predictions,
      overallConfidence: Math.min(100, overallConfidence),
      methodology: 'Multi-factor synthesis engine combining historical patterns, structural forces, current events, and contrarian viewpoints with time-horizon-specific weighting.',
      limitations: [
        'Black swan events by definition cannot be predicted',
        'Forecast confidence decreases exponentially with time horizon',
        'Historical pattern relevance may diminish in changing environments',
        'Contrarian viewpoints may be systematically underrepresented',
        'Recent event bias may inflate short-term confidence',
      ],
    };
  }
}
