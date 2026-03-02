# EcoAlert API Examples & Recipes

## Quick Start Example

### Using cURL
```bash
curl -X POST http://localhost:3000/api/forecast \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "tech",
    "description": "Will AI startups continue to receive high valuations?"
  }'
```

### Using JavaScript/Fetch
```javascript
const forecast = await fetch('/api/forecast', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    domain: 'tech',
    description: 'Will AI startups continue to receive high valuations?'
  })
});

const result = await forecast.json();
console.log(result);
```

### Using Python Requests
```python
import requests
import json

response = requests.post(
    'http://localhost:3000/api/forecast',
    headers={'Content-Type': 'application/json'},
    json={
        'domain': 'tech',
        'description': 'Will AI startups continue to receive high valuations?'
    }
)

prediction = response.json()
print(json.dumps(prediction, indent=2))
```

## Interpreting Results

### Reading the Confidence Gauge
```
Confidence Level: 72%
↓
High likelihood that analysis factors are aligned and prediction is reliable
```

### Understanding Probabilities
```
Bullish:  65% - More likely to move upward
Neutral:  20% - Sideways movement
Bearish:  15% - More likely to move downward
```

### Time Horizon Meanings
- **Hour**: What happens in the next 60 minutes based on current momentum
- **Day**: 24-hour outlook including overnight developments
- **Week**: 5-7 day forecast incorporating near-term catalysts
- **Month**: 30-day outlook balancing short-term noise with emerging trends
- **Decade**: 10-year structural outlook

## Domain-Specific Examples

### Technology Sector

**Question: Mobile App Market Saturation**
```json
{
  "domain": "tech",
  "description": "Has the mobile app market reached saturation? What's the outlook for new app launches?"
}
```

**What to Expect:**
- Historical patterns about past tech adoption cycles
- Structural forces like smartphone penetration rates
- Current events around app store policy changes
- Contrarian views on emerging use cases

**Key Insight:** 
If decade forecast shows 55% confidence, structural forces likely dominate (app markets mature). If hour forecast shows 85% confidence, a recent event (new iPhone launch, major acquisition) likely drove short-term sentiment.

---

### Economic Forecasting

**Question: Inflation Trajectory**
```json
{
  "domain": "economic",
  "description": "Will inflation continue to decline toward 2% target or will we see renewed pressure?"
}
```

**What to Expect:**
- Historical patterns of inflation cycles
- Structural forces (energy transition, demographic shifts)
- Current events (Fed policy, commodity prices)
- Contrarian: stagflation scenario, deflation risk

**Key Insight:**
Compare hour vs decade forecasts:
- If hour is 62% bullish (inflation continues down) but decade is 58% bearish (structural inflation), market is pricing in near-term relief but long-term risks

---

### Political/Social Analysis

**Question: Social Media Regulation**
```json
{
  "domain": "political",
  "description": "How likely is significant social media regulation in the next 5 years?"
}
```

**What to Expect:**
- Historical patterns of tech regulation
- Structural forces (political polarization, trust decline)
- Current events (hearings, bills proposed)
- Contrarian: industry self-regulation prevents regulation

**Key Insight:**
High month forecast confidence (85%) + moderate decade confidence (65%) suggests near-term action likely but structural resistance builds over time.

---

## Advanced Analysis Recipes

### 1. Scenario Comparison

**Analyze three different scenarios:**

```javascript
async function analyzeScenarios() {
  const bearish = await fetch('/api/forecast', {
    method: 'POST',
    body: JSON.stringify({
      domain: 'economic',
      description: 'Recession scenario: unemployment rises to 6.5%'
    })
  });

  const neutral = await fetch('/api/forecast', {
    method: 'POST',
    body: JSON.stringify({
      domain: 'economic',
      description: 'Base case: soft landing with gradual rate cuts'
    })
  });

  const bullish = await fetch('/api/forecast', {
    method: 'POST',
    body: JSON.stringify({
      domain: 'economic',
      description: 'Bull case: AI productivity surge drives growth reacceleration'
    })
  });

  // Compare confidence levels and probabilities across scenarios
}
```

---

### 2. Confidence Decay Analysis

**Track how confidence decays across time horizons:**

```javascript
function analyzeConfidenceDecay(predictions) {
  const confidences = predictions.map(p => ({
    timeframe: p.timeframe,
    confidence: p.confidenceLevel
  }));

  // Calculate decay rate
  console.log('Confidence Decay:');
  for (let i = 1; i < confidences.length; i++) {
    const decay = confidences[i-1].confidence - confidences[i].confidence;
    const decayPct = (decay / confidences[i-1].confidence) * 100;
    console.log(`${confidences[i-1].timeframe} → ${confidences[i].timeframe}: -${decayPct.toFixed(1)}%`);
  }
}
```

Expected pattern: Confidence typically decays 10-20% per time horizon jump

---

### 3. Signal Alignment Check

**Identify when short-term and long-term signals diverge:**

```javascript
function checkSignalAlignment(predictions) {
  const hour = predictions[0];
  const decade = predictions[4];

  const hourBullish = hour.bullishProbability > 60;
  const decadeBullish = decade.bullishProbability > 60;

  if (hourBullish && !decadeBullish) {
    console.log('⚠️  SHORT-TERM BULLISH, LONG-TERM BEARISH');
    console.log('Interpretation: Temporary bounce but structural headwinds');
  } else if (!hourBullish && decadeBullish) {
    console.log('✅ SHORT-TERM BEARISH, LONG-TERM BULLISH');
    console.log('Interpretation: Oversold opportunity with tailwinds ahead');
  } else if (hourBullish && decadeBullish) {
    console.log('🚀 ALIGNED BULLISH');
    console.log('Interpretation: Strong conviction across timeframes');
  } else {
    console.log('⛔ ALIGNED BEARISH');
    console.log('Interpretation: Negative outlook from near-term to long-term');
  }
}
```

---

### 4. Factor Importance Analysis

**Extract and weight key drivers:**

```javascript
function analyzeFactorImportance(prediction) {
  const factors = {};

  // Aggregate factors across all timeframes
  prediction.predictions.forEach(p => {
    p.keyFactors.forEach(factor => {
      factors[factor] = (factors[factor] || 0) + 1;
    });
  });

  // Sort by frequency
  const sorted = Object.entries(factors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  console.log('Most Important Factors:');
  sorted.forEach(([factor, count], i) => {
    console.log(`${i+1}. ${factor} (mentioned ${count}x)`);
  });
}
```

---

### 5. Risk Dashboard

**Build a risk assessment from factor analysis:**

```javascript
function buildRiskDashboard(prediction) {
  const risks = {};

  prediction.predictions.forEach(p => {
    p.riskFactors.forEach(risk => {
      if (!risks[risk]) {
        risks[risk] = { count: 0, timeframes: [] };
      }
      risks[risk].count += 1;
      risks[risk].timeframes.push(p.timeframe);
    });
  });

  // Sort by frequency
  const sorted = Object.entries(risks)
    .sort((a, b) => b[1].count - a[1].count);

  console.log('Risk Dashboard:');
  sorted.forEach(([risk, data]) => {
    const severity = data.count >= 4 ? '🔴 CRITICAL' : 
                     data.count === 3 ? '🟠 HIGH' : 
                     data.count === 2 ? '🟡 MEDIUM' : '🟢 LOW';
    console.log(`${severity}: ${risk} (${data.timeframes.join(', ')})`);
  });
}
```

---

## Batch Processing

**Process multiple forecasts and aggregate results:**

```javascript
async function batchForecast() {
  const queries = [
    { domain: 'tech', description: 'AI adoption rates' },
    { domain: 'economic', description: 'Interest rate path' },
    { domain: 'political', description: 'Election impact on policy' }
  ];

  const results = await Promise.all(
    queries.map(q => 
      fetch('/api/forecast', {
        method: 'POST',
        body: JSON.stringify(q)
      }).then(r => r.json())
    )
  );

  // Aggregate cross-domain insights
  return {
    totalConfidence: results.reduce((sum, r) => sum + r.overallConfidence, 0) / results.length,
    predictions: results
  };
}
```

---

## Integration Patterns

### Dashboard Widget

```javascript
// React component for dashboard
import { ForecastForm } from '@/components/forecast-form';

export function ForecastWidget() {
  return (
    <div className="forecast-dashboard">
      <ForecastForm onSubmit={(prediction) => {
        // Handle prediction update
        updateDashboard(prediction);
      }} />
    </div>
  );
}
```

### Scheduled Analysis

```javascript
// Run daily forecasts (pseudocode)
setInterval(async () => {
  const keyTopics = [
    'Tech sector momentum',
    'Economic growth trajectory',
    'Inflation path'
  ];

  for (const topic of keyTopics) {
    const forecast = await fetch('/api/forecast', {
      method: 'POST',
      body: JSON.stringify({
        domain: 'economic',
        description: topic
      })
    });
    
    // Store and analyze
    saveToDatabase(await forecast.json());
  }
}, 24 * 60 * 60 * 1000); // Daily
```

---

## Tips & Best Practices

1. **Be Specific**: Detailed descriptions yield better predictions
2. **Compare Timeframes**: Look for divergences between short and long-term
3. **Check Assumptions**: Review assumptions section for hidden biases
4. **Track Changes**: Run same forecast periodically to see how predictions evolve
5. **Validate Factors**: Verify that key factors actually exist in your domain
6. **Use Confidence Levels**: Don't rely on low-confidence (<50%) predictions
7. **Consider Catalysts**: Check if upcoming events match assumption timeframes
8. **Combine Domains**: Multi-domain forecasts provide more complete picture

---

## Performance Optimization

- Use prediction caching for identical queries (TTL: 5 minutes)
- Batch similar forecasts together
- Pre-load common domains
- Consider memoizing results in browser
