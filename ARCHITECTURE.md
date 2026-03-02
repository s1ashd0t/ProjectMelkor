# EcoAlert Architecture Documentation

## System Overview

EcoAlert is a multi-horizon forecasting system that synthesizes diverse data sources into probabilistic predictions across five time horizons (hour, day, week, month, decade).

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                          │
│  (React Components + Next.js Pages)                         │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                     API Layer                               │
│  (/api/forecast - Route Handler)                            │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                 Business Logic Layer                        │
│  (ForecastingEngine + DataLoader)                           │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                 Data Source Layer                           │
│  (Historical Patterns, Structural Forces, Events, Views)   │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### 1. Frontend Layer

#### Components
- **`ForecastForm`**: Input form for domain and description
- **`PredictionCard`**: Display individual time horizon prediction
- **`ConfidenceGauge`**: Visual confidence level indicator

#### Pages
- **`page.tsx`**: Main landing page
- **`layout.tsx`**: Root layout with metadata

#### Styling
- **`globals.css`**: Tailwind-based styling
- **`tailwind.config.ts`**: Tailwind configuration

### 2. API Layer

#### Route: `POST /api/forecast`

```
Request → Validation → DataLoading → Forecasting → Response
```

**Flow:**
1. Parse and validate request body
2. Load prediction input data
3. Generate forecast via ForecastingEngine
4. Cache result
5. Return JSON response

### 3. Business Logic Layer

#### ForecastingEngine (`src/lib/forecasting-engine.ts`)

**Main Class: `ForecastingEngine`**

Methods:
- `forecast(input: PredictionInput): Prediction`
  - Main entry point
  - Coordinates analysis and prediction generation

- `private analyzeHistoricalPatterns()`: Historical analysis
- `private analyzeStructuralForces()`: Structural force assessment
- `private analyzeCurrentEvents()`: Event impact analysis
- `private analyzeContraryViewpoints()`: Alternative scenario evaluation

- `private generateTimeHorizonPrediction()`: Per-timeframe forecast
- `private generateReasoningText()`: Narrative explanation
- `private extractKeyFactors()`: Factor importance extraction
- `private extractRiskFactors()`: Risk identification
- `private generateAssumptions()`: Assumption listing

**Key Data Structures:**

```typescript
interface HistoricalPattern {
  name: string;
  strength: number;        // 0-1
  direction: 'bullish' | 'bearish' | 'neutral';
  relevance: number;       // 0-1
}

interface StructuralForce {
  name: string;
  category: 'economic' | 'social' | 'political';
  direction: 'accelerating' | 'decelerating' | 'stable';
  magnitude: number;       // 0-1
  timeframe: string;
}

interface CurrentEvent {
  title: string;
  date: Date;
  impact: 'positive' | 'negative' | 'neutral';
  magnitude: number;       // 0-1
  relevance: number;       // 0-1
}

interface ContraryViewpoint {
  description: string;
  rationale: string;
  probability: number;     // 0-1
  catalysts: string[];
}

interface TimeHorizonPrediction {
  timeframe: 'hour' | 'day' | 'week' | 'month' | 'decade';
  prediction: string;
  confidenceLevel: number; // 0-100
  bullishProbability: number;
  bearishProbability: number;
  neutralProbability: number;
  reasoning: string;
  keyFactors: string[];
  riskFactors: string[];
  assumptions: string[];
}

interface Prediction {
  id: string;
  timestamp: Date;
  input: PredictionInput;
  predictions: TimeHorizonPrediction[];
  overallConfidence: number;
  methodology: string;
  limitations: string[];
}
```

#### DataLoader (`src/lib/data-loader.ts`)

**Main Class: `DataLoader`**

Static methods:
- `loadHistoricalPatterns(domain)`: Fetch historical patterns
- `loadStructuralForces(domain)`: Fetch structural forces
- `loadCurrentEvents(domain)`: Fetch recent events
- `loadContraryViewpoints(domain)`: Fetch contrarian views
- `buildPredictionInput(domain, description)`: Assemble complete input

**Caching: `PredictionCache`**
- TTL: 5 minutes
- Key: `${domain}_${description}`
- Avoids duplicate processing

### 4. Data Source Layer

Currently mock data organized by domain:
- **tech**: Technology sector patterns and forces
- **economic**: Economic trends and indicators
- **social**: Social trends and structural shifts
- **political**: Political dynamics
- **default**: Generic patterns

## Analysis Algorithm

### Phase 1: Component Analysis

Each analysis module independently scores its inputs:

```
Historical Pattern Score = 
  AVG(pattern.strength × pattern.relevance for each pattern)
  × (bullish/bearish vote count)
  
Confidence = AVG(pattern.relevance) × 100
```

### Phase 2: Temporal Weighting

Different factors matter across time horizons:

```
Hour:    Events 50%, Patterns 30%, Structural 10%, Contrarian 10%
Day:     Events 40%, Patterns 35%, Structural 15%, Contrarian 10%
Week:    Patterns 40%, Events 30%, Structural 20%, Contrarian 10%
Month:   Patterns 45%, Structural 30%, Events 15%, Contrarian 10%
Decade:  Structural 50%, Patterns 40%, Events 5%, Contrarian 5%
```

### Phase 3: Synthesis

```
TimeHorizonScore = 
  (component_score × component_weight) for each component
  
Confidence = MIN(100, 
  SUM(component_confidence × component_weight) × 1.2)
```

### Phase 4: Probability Distribution

```
BullishScore = (TimeHorizonScore - 50) / 50
BullishProb = 50 + (BullishScore × 45)
BearishProb = 50 - (BullishScore × 45)
NeutralProb = 100 - BullishProb - BearishProb
```

### Phase 5: Narrative Generation

- Generate prediction text based on score and strength
- Extract key factors influencing outcome
- Identify risk factors
- List key assumptions
- Provide detailed reasoning

## Data Flow Diagram

```
User Input (Domain + Description)
    ↓
API Request (/api/forecast)
    ↓
Cache Check
    ├─→ Cache Hit: Return cached result
    └─→ Cache Miss: Continue processing
        ↓
    DataLoader.buildPredictionInput()
        ├─→ loadHistoricalPatterns()
        ├─→ loadStructuralForces()
        ├─→ loadCurrentEvents()
        └─→ loadContraryViewpoints()
        ↓
    ForecastingEngine.forecast()
        ├─→ analyzeHistoricalPatterns()
        ├─→ analyzeStructuralForces()
        ├─→ analyzeCurrentEvents()
        ├─→ analyzeContraryViewpoints()
        ↓
        For each timeframe (hour, day, week, month, decade):
        ├─→ generateTimeHorizonPrediction()
        │   ├─→ Weighted synthesis of scores
        │   ├─→ Probability calculation
        │   ├─→ Reasoning generation
        │   ├─→ Factor extraction
        │   └─→ Risk identification
        ↓
    Assembly of Prediction object
        ↓
    Cache storage
        ↓
    JSON response
        ↓
    Frontend rendering
```

## Confidence Calculation

**Component Confidences:**

```
pattern_confidence = 
  AVG(pattern_relevance) × 100

structural_confidence = 
  AVG(force_magnitude) × 100 × 0.8 + 20

event_confidence = 
  AVG(event_relevance) × 100 × 0.9

contrarian_confidence = 
  AVG(viewpoint_probability) × 100 × 0.5
```

**Synthesis Confidence:**

```
synthesized_confidence = MIN(100,
  pattern_conf × pattern_weight +
  structural_conf × structural_weight +
  event_conf × event_weight +
  contrarian_conf × contrarian_weight
) × 1.2
```

**Overall Confidence:**

```
overall = (pattern_conf + structural_conf + event_conf + contrarian_conf) / 4
```

## Extension Points

### 1. Adding Real Data Sources

Replace mock loaders in `data-loader.ts`:

```typescript
static async loadHistoricalPatterns(domain: string) {
  // Current: Returns mock data
  // Extend: Connect to real API, database, or data service
  
  const response = await fetch(`https://your-api.com/patterns/${domain}`);
  return response.json();
}
```

### 2. Adding Analysis Modules

Create new analyzer classes:

```typescript
class SentimentAnalysis {
  analyze(tweets, articles): SentimentScore { }
}

class MacroeconomicAnalysis {
  analyze(indicators): MacroForces { }
}
```

### 3. Machine Learning Integration

Replace rule-based scoring with ML models:

```typescript
private async predictWithML(input: PredictionInput) {
  // Use trained model for probability prediction
  const model = await tf.loadLayersModel('indexeddb://model');
  return model.predict(input);
}
```

### 4. Real-time Updates

Implement WebSocket for live predictions:

```typescript
const socket = new WebSocket('ws://localhost:3001');
socket.on('event', (event) => {
  reanalyzeWithNewData(event);
});
```

### 5. Backtesting Framework

```typescript
class Backtester {
  test(historicalEvents, domain): AccuracyMetrics { }
  compare(model1, model2): PerformanceComparison { }
}
```

## Performance Considerations

### Caching Strategy
- TTL: 5 minutes (configurable)
- Key: Hash of domain + description
- Memory-based (consider Redis for scaling)

### Optimization Opportunities
1. Pre-load common domains
2. Batch process multiple queries
3. Memoize component analyses
4. Async load remote data sources
5. IndexedDB for browser-side caching

### Scalability
```
Current Architecture:
  Single Node.js process
  In-memory cache
  Suitable for: <1000 daily requests

For Production Scaling:
  • Load balance across multiple instances
  • Use Redis for distributed cache
  • Database for prediction history
  • Message queue for batch processing
  • CDN for static assets
```

## Error Handling

```typescript
// API Error Response
{
  error: "Failed to generate forecast",
  code: "FORECAST_ERROR",
  details: "Detailed error message"
}

// HTTP Status Codes
200: Success
400: Bad request (missing domain/description)
500: Server error (processing failed)
```

## Security Considerations

1. **Input Validation**: Domain and description sanitization
2. **Rate Limiting**: Prevent abuse
3. **CORS**: Configure for production
4. **API Keys**: If integrating external services
5. **Audit Logging**: Track predictions generated

## Monitoring & Logging

Recommended additions:
```typescript
logger.info('Forecast generated', {
  predictionId: prediction.id,
  domain: input.domain,
  confidence: prediction.overallConfidence,
  processingTime: Date.now() - startTime
});

metrics.recordConfidence(prediction.overallConfidence);
metrics.recordProcessingTime(processingTime);
```

## Dependencies

- **Next.js 15**: Full-stack React framework
- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **date-fns**: Date utilities
- **recharts**: Data visualization (optional, for future charts)

## File Structure

```
EcoAlert/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── forecast/
│   │   │       └── route.ts
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── forecast-form.tsx
│   │   ├── prediction-card.tsx
│   │   └── confidence-gauge.tsx
│   ├── lib/
│   │   ├── forecasting-engine.ts
│   │   └── data-loader.ts
│   └── types/
│       └── index.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── README.md
├── EXAMPLES.md
└── ARCHITECTURE.md
```

## Future Enhancements

1. **Advanced Analytics**
   - Scenario analysis and Monte Carlo simulations
   - Sensitivity analysis
   - Factor decomposition

2. **Machine Learning**
   - LLM integration for narrative generation
   - ML-based confidence scoring
   - Pattern discovery algorithms

3. **User Experience**
   - Interactive dashboards
   - Historical comparison views
   - Alert system for key predictions
   - Collaborative forecasting

4. **Data Integration**
   - Real-time market data feeds
   - News sentiment analysis
   - Social media trend tracking
   - Alternative data sources

5. **Enterprise Features**
   - Multi-user accounts
   - Prediction sharing
   - API access tokens
   - Custom data sources
   - White-label deployment
