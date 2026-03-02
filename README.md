# EcoAlert - Multi-Horizon Forecasting Engine

A sophisticated forecasting application that synthesizes long-term historical patterns, structural economic/social/political forces, current events, and contrarian viewpoints to provide well-reasoned predictions with confidence levels across multiple time horizons.

## Features

### Multi-Factor Analysis
- **Historical Patterns**: Analyzes long-term trends and cyclical patterns
- **Structural Forces**: Evaluates deep economic, social, and political forces
- **Current Events**: Processes recent developments with recency-weighted analysis
- **Contrarian Viewpoints**: Incorporates alternative perspectives and minority opinions

### Time Horizons
Generates predictions for five distinct timeframes:
- **Hour**: Immediate momentum and near-term catalysts
- **Day**: Short-term sentiment and technical factors
- **Week**: Tactical positioning and near-term developments
- **Month**: Intermediate trends and market structure
- **Decade**: Long-term structural transformations

### Confidence Scoring
Each prediction includes:
- **Confidence Level** (0-100%): Overall certainty of the forecast
- **Bullish Probability**: Likelihood of positive movement
- **Bearish Probability**: Likelihood of negative movement
- **Neutral Probability**: Likelihood of sideways movement

### Detailed Analysis
- Key factors influencing the prediction
- Risk factors that could derail the forecast
- Key assumptions underlying the analysis
- Methodology and limitations documentation

## How It Works

### Forecasting Engine Algorithm

The forecasting engine synthesizes four information sources with time-horizon-specific weights:

```
Prediction Score = (
  Historical_Pattern_Score × Pattern_Weight +
  Structural_Force_Score × Structural_Weight +
  Current_Event_Score × Event_Weight +
  Contrarian_Score × Contrarian_Weight
)
```

**Weight Distribution by Timeframe:**
- **Hour**: Events 50%, Patterns 30%, Structural 10%, Contrarian 10%
- **Day**: Events 40%, Patterns 35%, Structural 15%, Contrarian 10%
- **Week**: Patterns 40%, Events 30%, Structural 20%, Contrarian 10%
- **Month**: Patterns 45%, Structural 30%, Events 15%, Contrarian 10%
- **Decade**: Structural 50%, Patterns 40%, Events 5%, Contrarian 5%

### Analysis Modules

#### Historical Pattern Analysis
- Evaluates pattern strength (0-1) and relevance (0-1)
- Classifies as bullish, bearish, or neutral
- Calculates weighted average impact on outcome
- Confidence based on pattern relevance

#### Structural Force Analysis
- Assesses magnitude (0-1) of economic, social, or political forces
- Evaluates direction: accelerating, decelerating, or stable
- Longer-term focus (1-20 year timeframes)
- Medium-confidence contributor

#### Current Event Analysis
- Applies exponential recency bias (30-day decay window)
- Measures impact and relevance of recent developments
- Highest weight for short-term horizons
- Confidence increases with event relevance

#### Contrarian Viewpoint Analysis
- Incorporates minority perspectives and alternative theses
- Weights by probability and quality of catalysts
- Challenges consensus thinking
- Low weight but important for risk assessment

## API Endpoint

### Generate Forecast

**POST** `/api/forecast`

**Request Body:**
```json
{
  "domain": "tech",
  "description": "What will happen to AI adoption rates in enterprise software?"
}
```

**Response:**
```json
{
  "id": "pred_1234567890_abc123def",
  "timestamp": "2026-03-02T21:30:00.000Z",
  "input": {
    "domain": "tech",
    "description": "...",
    "historicalPatterns": [...],
    "structuralForces": [...],
    "currentEvents": [...],
    "contraryViewpoints": [...]
  },
  "predictions": [
    {
      "timeframe": "hour",
      "prediction": "Strong momentum expected...",
      "confidenceLevel": 65,
      "bullishProbability": 72,
      "bearishProbability": 18,
      "neutralProbability": 10,
      "reasoning": "...",
      "keyFactors": [...],
      "riskFactors": [...],
      "assumptions": [...]
    },
    // ... predictions for day, week, month, decade
  ],
  "overallConfidence": 58,
  "methodology": "Multi-factor synthesis engine...",
  "limitations": [...]
}
```

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
cd EcoAlert
npm install
```

### Development
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## Usage

1. **Select Domain**: Choose from Technology, Economic, Social, Political, or Environmental
2. **Describe Your Question**: Enter what you want forecasted
3. **Generate Forecast**: Click "Generate Multi-Horizon Forecast"
4. **Review Results**: Examine predictions, confidence levels, and reasoning for each timeframe
5. **Analyze Details**: Review key factors, risks, and assumptions

## Data Sources

### Built-in Mock Data
The application includes mock data for demonstration:
- Historical patterns specific to each domain
- Structural forces (economic, social, political)
- Recent events with dates and impact assessments
- Contrarian viewpoints with probability estimates

### Extending with Real Data

Replace mock data in `src/lib/data-loader.ts`:

```typescript
// Example: Connect to real API
static async loadHistoricalPatterns(domain: string): Promise<HistoricalPattern[]> {
  const response = await fetch(`https://your-api.com/patterns/${domain}`);
  return response.json();
}
```

Possible data sources:
- Financial APIs (Alpha Vantage, IEX Cloud, etc.)
- News APIs (NewsAPI, Twitter API, etc.)
- Economic databases (World Bank, IMF, BLS, etc.)
- Academic datasets (NBER, SSRN, etc.)
- Social media sentiment analysis APIs

## Confidence Levels Explained

**90-100%**: High conviction
- Multiple strong signals align
- Few contradicting factors
- Limited uncertainty

**70-89%**: Good confidence
- Primary factors align well
- Some conflicting signals
- Moderate uncertainty

**50-69%**: Moderate confidence  
- Mixed signals
- Significant opposing factors
- Considerable uncertainty

**30-49%**: Low confidence
- Weak or conflicting signals
- Major uncertainties
- Use with caution

**0-29%**: Very low confidence
- Insufficient data
- Severely contradicting factors
- Unreliable predictions

## Limitations

1. **Black Swan Events**: By definition, cannot predict unpredictable events
2. **Time Horizon Decay**: Confidence decreases exponentially beyond 1 month
3. **Pattern Relevance**: Historical patterns may become obsolete
4. **Contrarian Bias**: Underweights very unlikely but high-impact scenarios
5. **Recency Bias**: Recent events may receive excessive weight
6. **Data Quality**: Results depend on input data accuracy
7. **Model Assumptions**: Many simplifying assumptions in synthesis algorithm

## Methodology Notes

### Historical Patterns
- Strength: How pronounced the pattern historically was (0-1)
- Relevance: How applicable to current situation (0-1)
- Direction: Whether pattern predicts bullish/bearish/neutral outcome
- Impact: Strength × Relevance = weighted contribution

### Structural Forces
- Magnitude: How powerful the force (0-1)
- Direction: Accelerating/Decelerating/Stable
- Category: Economic/Social/Political classification
- Timeframe: Expected duration of force

### Current Events
- Impact: Positive/Negative/Neutral classification
- Magnitude: Strength of impact (0-1)
- Relevance: Relevance to domain (0-1)
- Recency: Exponential decay function, peak impact at 0 days

### Contrarian Viewpoints
- Probability: Estimated likelihood (0-1)
- Rationale: Logical explanation for alternative outcome
- Catalysts: Specific events that would trigger this outcome
- Quality: Assessed by number and plausibility of catalysts

## Advanced Features

### Prediction Caching
- 5-minute cache on identical forecasts
- Reduces API calls and improves response time
- Automatic TTL-based invalidation

### Confidence Synthesis
- Weighted average of component confidences
- Scaled by factor relevance and reliability
- Range: 0-100%

### Risk Assessment
- Automatic extraction of bearish patterns
- Identification of contradicting signals
- Highlighting of critical assumptions

## Examples

### Example 1: Tech Sector Forecast
```json
{
  "domain": "tech",
  "description": "What will be the impact of AI regulation on tech valuations?"
}
```

Expected analysis:
- Historical patterns of tech regulation cycles
- Structural forces: regulatory trends, investor sentiment
- Recent events: congressional hearings, executive orders
- Contrarian views: minimal impact, regulatory arbitrage

### Example 2: Economic Forecast
```json
{
  "domain": "economic",
  "description": "Will we experience a recession in the next 12 months?"
}
```

Expected analysis:
- Historical patterns: yield curve, unemployment rate changes
- Structural forces: demographic trends, debt levels, productivity
- Recent events: earnings misses, Fed policy, unemployment data
- Contrarian views: soft landing, deflationary spiral

### Example 3: Social Trends
```json
{
  "domain": "social",
  "description": "How will Gen Z lifestyle preferences impact consumer brands?"
}
```

Expected analysis:
- Historical patterns: generational consumption shifts
- Structural forces: value changes, digital native behavior
- Recent events: brand boycotts, social media trends
- Contrarian views: convergence with older generations

## Contributing

The forecasting engine can be extended with:
- Additional analysis modules (geopolitical, behavioral)
- Real-time data integration
- Machine learning components
- Scenario analysis tools
- Backtesting framework

## License

MIT

## Disclaimer

This forecasting tool is for informational and analytical purposes only. Predictions are probabilistic estimates based on input data and assumptions. The forecasts are NOT guaranteed and should not be used as the sole basis for decision-making. Always consult with domain experts and conduct additional research before making important decisions based on these forecasts.

Users assume all responsibility for decisions made based on this tool's outputs.
