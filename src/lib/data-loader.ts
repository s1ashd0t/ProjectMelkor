/**
 * Utilities for loading and managing forecast data
 */

import { 
  HistoricalPattern, 
  StructuralForce, 
  CurrentEvent, 
  ContraryViewpoint,
  PredictionInput 
} from './forecasting-engine';

/**
 * Mock data loader - can be replaced with real data sources
 */
export class DataLoader {
  /**
   * Load historical patterns from data source
   */
  static async loadHistoricalPatterns(domain: string): Promise<HistoricalPattern[]> {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        const patterns: { [key: string]: HistoricalPattern[] } = {
          tech: [
            { name: 'SaaS Adoption Curve', strength: 0.8, direction: 'bullish', relevance: 0.9 },
            { name: 'VC Funding Cycles', strength: 0.7, direction: 'bullish', relevance: 0.8 },
            { name: 'Dot-com Valuations Peak', strength: 0.6, direction: 'bearish', relevance: 0.7 },
            { name: 'Enterprise Migration Wave', strength: 0.85, direction: 'bullish', relevance: 0.85 },
          ],
          economic: [
            { name: 'Commodity Supercycle', strength: 0.7, direction: 'bullish', relevance: 0.75 },
            { name: 'Rate Cycle Bottom', strength: 0.8, direction: 'bullish', relevance: 0.8 },
            { name: 'Inflation Mean Reversion', strength: 0.6, direction: 'neutral', relevance: 0.7 },
            { name: 'Yield Curve Inversion', strength: 0.75, direction: 'bearish', relevance: 0.8 },
          ],
          social: [
            { name: 'Gen Z Value Shift', strength: 0.7, direction: 'bullish', relevance: 0.8 },
            { name: 'Remote Work Normalization', strength: 0.85, direction: 'bullish', relevance: 0.9 },
            { name: 'Trust in Institutions', strength: 0.5, direction: 'bearish', relevance: 0.7 },
          ],
          default: [
            { name: 'Long-term growth trend', strength: 0.6, direction: 'bullish', relevance: 0.6 },
            { name: 'Cyclical volatility', strength: 0.5, direction: 'neutral', relevance: 0.5 },
            { name: 'Mean reversion', strength: 0.7, direction: 'neutral', relevance: 0.65 },
          ]
        };
        resolve(patterns[domain] || patterns.default);
      }, 300);
    });
  }

  /**
   * Load structural forces
   */
  static async loadStructuralForces(domain: string): Promise<StructuralForce[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        const forces: { [key: string]: StructuralForce[] } = {
          tech: [
            {
              name: 'AI Acceleration',
              category: 'economic',
              direction: 'accelerating',
              magnitude: 0.9,
              timeframe: '3-5 years'
            },
            {
              name: 'Regulatory Tightening',
              category: 'political',
              direction: 'accelerating',
              magnitude: 0.7,
              timeframe: '1-2 years'
            },
            {
              name: 'Talent Supply Constraints',
              category: 'social',
              direction: 'stable',
              magnitude: 0.6,
              timeframe: 'ongoing'
            },
          ],
          economic: [
            {
              name: 'Fiscal Imbalances',
              category: 'political',
              direction: 'accelerating',
              magnitude: 0.8,
              timeframe: '5-10 years'
            },
            {
              name: 'Demographic Shifts',
              category: 'social',
              direction: 'accelerating',
              magnitude: 0.7,
              timeframe: '10-20 years'
            },
            {
              name: 'Energy Transition',
              category: 'economic',
              direction: 'accelerating',
              magnitude: 0.85,
              timeframe: '5-15 years'
            },
          ],
          default: [
            {
              name: 'Structural innovation',
              category: 'economic',
              direction: 'accelerating',
              magnitude: 0.6,
              timeframe: 'ongoing'
            },
            {
              name: 'Regulatory evolution',
              category: 'political',
              direction: 'stable',
              magnitude: 0.5,
              timeframe: '2-5 years'
            },
          ]
        };
        resolve(forces[domain] || forces.default);
      }, 300);
    });
  }

  /**
   * Load recent events
   */
  static async loadCurrentEvents(domain: string): Promise<CurrentEvent[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        const now = new Date();
        const events: { [key: string]: CurrentEvent[] } = {
          tech: [
            {
              title: 'Major AI Model Release',
              date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
              impact: 'positive',
              magnitude: 0.8,
              relevance: 0.9
            },
            {
              title: 'Tech Stock Volatility Spike',
              date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
              impact: 'negative',
              magnitude: 0.6,
              relevance: 0.8
            },
            {
              title: 'Enterprise Adoption Announcement',
              date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
              impact: 'positive',
              magnitude: 0.7,
              relevance: 0.85
            },
          ],
          economic: [
            {
              title: 'Central Bank Rate Decision',
              date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
              impact: 'neutral',
              magnitude: 0.7,
              relevance: 0.9
            },
            {
              title: 'Employment Report Beat',
              date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
              impact: 'positive',
              magnitude: 0.8,
              relevance: 0.85
            },
          ],
          default: [
            {
              title: 'Notable market development',
              date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
              impact: 'neutral',
              magnitude: 0.5,
              relevance: 0.6
            },
          ]
        };
        resolve(events[domain] || events.default);
      }, 300);
    });
  }

  /**
   * Load contrarian viewpoints
   */
  static async loadContraryViewpoints(domain: string): Promise<ContraryViewpoint[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        const viewpoints: { [key: string]: ContraryViewpoint[] } = {
          tech: [
            {
              description: 'AI hype will deflate, valuations compress 50-70%',
              rationale: 'Historical pattern of technology speculation bubbles; regulatory backlash; limited monetization paths',
              probability: 0.25,
              catalysts: ['Disappointing earnings', 'Regulatory crackdown', 'Margin compression']
            },
            {
              description: 'Consolidation among tech giants accelerates',
              rationale: 'Smaller players struggle with capex; acquisition becomes more attractive',
              probability: 0.35,
              catalysts: ['Regulatory approval shifts', 'Capital efficiency demands']
            },
          ],
          economic: [
            {
              description: 'Soft landing narrative breaks down',
              rationale: 'Unemployment inflects upward faster than expected; wage pressures persist',
              probability: 0.3,
              catalysts: ['Corporate earnings misses', 'Leading indicators deteriorate']
            },
            {
              description: 'Deflation emerges as surprise risk',
              rationale: 'AI productivity surge; demographic headwinds; deleveraging',
              probability: 0.2,
              catalysts: ['Commodity price collapse', 'Corporate profitability squeeze']
            },
          ],
          default: [
            {
              description: 'Consensus thesis reverses unexpectedly',
              rationale: 'Markets often miss turning points; late-cycle dynamics shift rapidly',
              probability: 0.25,
              catalysts: ['Unexpected catalyst', 'Rapid sentiment shift']
            },
          ]
        };
        resolve(viewpoints[domain] || viewpoints.default);
      }, 300);
    });
  }

  /**
   * Assemble complete prediction input
   */
  static async buildPredictionInput(domain: string, description: string): Promise<PredictionInput> {
    const [patterns, forces, events, viewpoints] = await Promise.all([
      this.loadHistoricalPatterns(domain),
      this.loadStructuralForces(domain),
      this.loadCurrentEvents(domain),
      this.loadContraryViewpoints(domain)
    ]);

    return {
      domain,
      description,
      historicalPatterns: patterns,
      structuralForces: forces,
      currentEvents: events,
      contraryViewpoints: viewpoints
    };
  }
}

/**
 * Cache predictions to avoid duplicate processing
 */
export class PredictionCache {
  private cache = new Map<string, { timestamp: number; data: any }>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, value: any): void {
    this.cache.set(key, { timestamp: Date.now(), data: value });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }
}
