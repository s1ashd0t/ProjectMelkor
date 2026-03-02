# EcoAlert - Visual Architecture

## System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                              │
│                     (React + Tailwind CSS)                         │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  EcoAlert - Multi-Horizon Forecasting Engine              │  │
│  │  ──────────────────────────────────────────────────────────  │  │
│  │                                                           │  │
│  │  Select Domain:  [Tech ▼]                             │  │
│  │  Describe:       [What will happen with AI...]       │  │
│  │  [Generate Forecast ▶]                                │  │
│  │                                                           │  │
│  │  ──────────────────────────────────────────────────────────  │  │
│  │  RESULTS:                                            │  │
│  │                                                           │  │
│  │  ┌─ Hour ──────────────────────────────────────┐      │  │
│  │  │ Prediction: Strong momentum expected        │      │  │
│  │  │ Confidence: ████████████░ 75%              │      │  │
│  │  │ Bullish: 78% | Neutral: 10% | Bearish: 12% │      │  │
│  │  │ Key Factors: [list...]                      │      │  │
│  │  │ Risks: [list...]                            │      │  │
│  │  └────────────────────────────────────────────┘      │  │
│  │                                                           │  │
│  │  ┌─ Day ──────────────────────────────────────┐       │  │
│  │  │ Prediction: Favorable conditions            │       │  │
│  │  │ Confidence: ███████████░░ 70%              │       │  │
│  │  │ Bullish: 72% | Neutral: 15% | Bearish: 13% │       │  │
│  │  │ Key Factors: [list...]                      │       │  │
│  │  └────────────────────────────────────────────┘       │  │
│  │                                                           │  │
│  │  ┌─ Week ─────────────────────────────────────┐        │  │
│  │  │ Prediction: Mixed signals expected          │        │  │
│  │  │ Confidence: ██████████░░░░ 62%             │        │  │
│  │  │ Bullish: 65% | Neutral: 20% | Bearish: 15% │        │  │
│  │  │ Key Factors: [list...]                      │        │  │
│  │  └────────────────────────────────────────────┘        │  │
│  │                                                           │  │
│  │  ┌─ Month ────────────────────────────────────┐         │  │
│  │  │ Prediction: Uncertain direction             │         │  │
│  │  │ Confidence: █████████░░░░░ 58%             │         │  │
│  │  │ Bullish: 58% | Neutral: 25% | Bearish: 17% │         │  │
│  │  │ Key Factors: [list...]                      │         │  │
│  │  └────────────────────────────────────────────┘         │  │
│  │                                                           │  │
│  │  ┌─ Decade ───────────────────────────────────┐         │  │
│  │  │ Prediction: Structural headwinds likely     │         │  │
│  │  │ Confidence: ████████░░░░░░ 48%             │         │  │
│  │  │ Bullish: 42% | Neutral: 20% | Bearish: 38% │         │  │
│  │  │ Key Factors: [list...]                      │         │  │
│  │  └────────────────────────────────────────────┘         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              ▲
                              │
                         HTTP/JSON
                              │
                              │
┌─────────────────────────────────────────────────────────────────────┐
│                      API LAYER                                     │
│                  POST /api/forecast                                │
│                                                                     │
│  Request Validation → Cache Check → Forecast Generation           │
└─────────────────────────────────────────────────────────────────────┘
                              ▲
                              │
                    ForecastingEngine
                              │
          ┌───────────┬────────┼────────┬───────────┐
          │           │        │        │           │
          ▼           ▼        ▼        ▼           ▼
    ┌─────────┐ ┌─────────┐ ┌──────┐ ┌──────────┐ ┌────┐
    │Historical│ │Structural│ │Current│ │Contrarian│ │Cache│
    │ Patterns │ │ Forces  │ │Events │ │ Views    │ │     │
    └─────────┘ └─────────┘ └──────┘ └──────────┘ └────┘
          │           │        │        │
          └───────────┴────────┼────────┴───────────┘
                               │
                         DataLoader
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
    ┌─────────┐          ┌──────────┐          ┌────────┐
    │ Historic │          │ Structural│          │ Current│
    │ Patterns │          │  Forces   │          │ Events │
    │ Database │          │ Database  │          │ Database│
    └─────────┘          └──────────┘          └────────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
        ┌──────────────────────┴──────────────────────┐
        │                                              │
        ▼                                              ▼
    ┌──────────────┐                          ┌──────────────┐
    │Contrarian    │                          │Mock Data     │
    │Views Database│                          │(Demo)        │
    └──────────────┘                          └──────────────┘
```

---

## Data Flow Diagram

```
┌─ USER ENTERS DATA ──────────────────┐
│ Domain: "technology"                │
│ Description: "AI adoption impacts"  │
└────────────┬────────────────────────┘
             │
             ▼
      ┌──────────────┐
      │ API Request  │
      │ Validation   │
      └──────┬───────┘
             │
             ▼
      ┌─────────────────────┐
      │ Cache Lookup        │
      │ (5-min TTL)         │
      └──┬─────────────────┬┘
         │                 │
    HIT  │            MISS │
         │                 ▼
         │         ┌──────────────────────┐
         │         │ DataLoader.build     │
         │         │ PredictionInput()    │
         │         └──────┬───────────────┘
         │                │
         │         ┌──────┴──────────────────┐
         │         │                         │
         │         ▼                         ▼
         │    ┌─────────────┐        ┌──────────────┐
         │    │ Load        │        │ Load         │
         │    │ Historical  │        │ Structural   │
         │    │ Patterns    │        │ Forces       │
         │    └─────────────┘        └──────────────┘
         │         │                         │
         │    ┌────┴─────────────────┬──────┘
         │    │                      │
         │    ▼                      ▼
         │ ┌──────────┐         ┌──────────┐
         │ │ Load     │         │ Load     │
         │ │ Current  │         │Contrarian│
         │ │ Events   │         │ Views    │
         │ └──────────┘         └──────────┘
         │    │                      │
         │    └──────┬───────────────┘
         │           │
         │           ▼
         │    ┌────────────────────────┐
         │    │ ForecastingEngine      │
         │    │ .forecast()            │
         │    └──────┬─────────────────┘
         │           │
         │     ┌─────┴──────────────────┐
         │     │                        │
         │     ▼                        ▼
         │  ┌────────┐          ┌──────────────┐
         │  │ Analyze│          │ Analyze      │
         │  │Historical         │ Structural   │
         │  │ Patterns          │ Forces       │
         │  └────────┘          └──────────────┘
         │     │                        │
         │  ┌──┴─────────────┬─────────┘
         │  │                │
         │  ▼                ▼
         │ ┌─────────┐   ┌──────────┐
         │ │Analyze  │   │Analyze   │
         │ │Current  │   │Contrarian│
         │ │Events   │   │Views     │
         │ └─────────┘   └──────────┘
         │     │                │
         │     └────┬───────────┘
         │          │
         │          ▼
         │    ┌──────────────────────┐
         │    │ For each timeframe:  │
         │    │ (hour/day/week/etc)  │
         │    │                      │
         │    │ Weighted synthesis   │
         │    │ Probability calc     │
         │    │ Narrative generation │
         │    │ Factor extraction    │
         │    │ Risk identification  │
         │    └──────────┬───────────┘
         │               │
         │               ▼
         │    ┌──────────────────────┐
         │    │ Assemble Prediction  │
         │    │ Object               │
         │    └──────────┬───────────┘
         │               │
         │               ▼
         │    ┌──────────────────────┐
         │    │ Cache Result         │
         │    │ (5-min TTL)          │
         │    └──────────┬───────────┘
         │               │
         └───────┬───────┘
                 │
                 ▼
        ┌──────────────────┐
        │ JSON Response    │
        │ (Prediction)     │
        └─────────┬────────┘
                  │
                  ▼
          ┌───────────────┐
          │ UI Rendering  │
          │ 5 Time-frame  │
          │ predictions   │
          │ with details  │
          └───────────────┘
```

---

## Analysis Pipeline

```
INPUT: PredictionInput
  ├─ domain: string
  ├─ description: string
  ├─ historicalPatterns: HistoricalPattern[]
  ├─ structuralForces: StructuralForce[]
  ├─ currentEvents: CurrentEvent[]
  └─ contraryViewpoints: ContraryViewpoint[]

STAGE 1: Component Analysis
  ├─ Historical Pattern Analysis
  │  ├─ Score: strength × relevance
  │  ├─ Direction: bullish/bearish/neutral
  │  └─ Confidence: avg(relevance) × 100
  │
  ├─ Structural Force Analysis
  │  ├─ Score: magnitude × direction
  │  ├─ Impact: accelerating/decelerating/stable
  │  └─ Confidence: avg(magnitude) × 100
  │
  ├─ Current Event Analysis
  │  ├─ Score: impact × relevance
  │  ├─ Recency: exponential decay (30-day)
  │  └─ Confidence: avg(relevance) × 90%
  │
  └─ Contrarian Viewpoint Analysis
     ├─ Score: probability × quality
     ├─ Outcome: highest probability view
     └─ Confidence: probability × 50%

STAGE 2: Time-Horizon Weighting
  ├─ Hour:   Patterns 30%, Structural 10%, Events 50%, Contrarian 10%
  ├─ Day:    Patterns 35%, Structural 15%, Events 40%, Contrarian 10%
  ├─ Week:   Patterns 40%, Structural 20%, Events 30%, Contrarian 10%
  ├─ Month:  Patterns 45%, Structural 30%, Events 15%, Contrarian 10%
  └─ Decade: Patterns 40%, Structural 50%, Events 5%, Contrarian 5%

STAGE 3: Score Synthesis (per timeframe)
  ├─ Weighted average of component scores
  ├─ Scaled confidence calculation
  └─ Outputs: (score 0-100, confidence 0-100)

STAGE 4: Probability Distribution
  ├─ BullishScore = (score - 50) / 50
  ├─ BullishProb = 50 + (BullishScore × 45)
  ├─ BearishProb = 50 - (BullishScore × 45)
  └─ NeutralProb = 100 - BullishProb - BearishProb

STAGE 5: Narrative & Factors
  ├─ Generate prediction text
  ├─ Extract key factors
  ├─ Identify risk factors
  ├─ List assumptions
  └─ Provide reasoning

OUTPUT: TimeHorizonPrediction (for each timeframe)
  ├─ prediction: string
  ├─ confidenceLevel: 0-100
  ├─ bullishProbability: 0-100
  ├─ bearishProbability: 0-100
  ├─ neutralProbability: 0-100
  ├─ reasoning: string
  ├─ keyFactors: string[]
  ├─ riskFactors: string[]
  └─ assumptions: string[]

FINAL OUTPUT: Prediction
  ├─ id: string
  ├─ timestamp: Date
  ├─ input: PredictionInput
  ├─ predictions: TimeHorizonPrediction[] (5 items)
  ├─ overallConfidence: 0-100
  ├─ methodology: string
  └─ limitations: string[]
```

---

## Component Hierarchy

```
App
├── RootLayout
│   └── page (/)
│       ├── Header
│       │   └── "EcoAlert - Multi-Horizon Forecasting Engine"
│       │
│       ├── Feature Cards
│       │   ├── HistoricalPatterns Card
│       │   ├── StructuralForces Card
│       │   └── CurrentEvents & Contrarian Card
│       │
│       ├── ForecastForm
│       │   ├── Domain Selector
│       │   ├── Description Textarea
│       │   ├── Submit Button
│       │   ├── Loading State
│       │   ├── Error Message (if any)
│       │   │
│       │   └── (if prediction loaded)
│       │       ├── Forecast Overview
│       │       │   ├── Overall Confidence Gauge
│       │       │   ├── Forecast ID
│       │       │   └── Generated Timestamp
│       │       │
│       │       ├── Predictions Grid
│       │       │   ├── PredictionCard (hour)
│       │       │   │   ├── Timeframe Label
│       │       │   │   ├── Prediction Text
│       │       │   │   ├── Confidence Gauge
│       │       │   │   ├── Bullish Prob Gauge
│       │       │   │   ├── Probability Grid (3 cols)
│       │       │   │   ├── Reasoning Section
│       │       │   │   ├── Key Factors List
│       │       │   │   ├── Risk Factors List
│       │       │   │   └── Assumptions List
│       │       │   │
│       │       │   ├── PredictionCard (day)
│       │       │   ├── PredictionCard (week)
│       │       │   ├── PredictionCard (month)
│       │       │   └── PredictionCard (decade)
│       │       │
│       │       └── Methodology & Limitations Box
│       │           ├── Methodology Text
│       │           └── Limitations List
│       │
│       └── Footer
│
└── API Route Handler
    └── /api/forecast
        └── POST handler
```

---

## Confidence Decay Visualization

```
Typical confidence pattern across time horizons:

Hour     │██████████████████████████████ 75%
         │
Day      │███████████████████████████ 70%
         │
Week     │███████████████████ 62%
         │
Month    │██████████████████ 58%
         │
Decade   │████████████████ 48%
         │
         └─────────────────────────────────

Interpretation:
- Shorter timeframes: More data points, recent events weighted heavily
- Longer timeframes: More uncertainty, structural factors more important
- Typical decay: 10-20% per timeframe jump
```

---

## Probability Distribution Example

```
Three Outcomes Across Time Horizons

Hour:     ┌─ BULLISH 78% ────────────────────┐
          │                                   │
          │  NEUTRAL 10%  BEARISH 12%         │
          └─ Total 100% ─────────────────────┘

Day:      ┌─ BULLISH 72% ────────────────────┐
          │                                   │
          │  NEUTRAL 15%  BEARISH 13%         │
          └─ Total 100% ─────────────────────┘

Week:     ┌─ BULLISH 65% ────────────────┐
          │                               │
          │  NEUTRAL 20%  BEARISH 15%     │
          └─ Total 100% ─────────────────┘

Month:    ┌─ BULLISH 58% ──────────────┐
          │                             │
          │  NEUTRAL 25%  BEARISH 17%   │
          └─ Total 100% ─────────────────┘

Decade:   ┌─ BULLISH 42% ──────┐
          │                     │
          │  NEUTRAL 20%  BEARISH 38%
          └─ Total 100% ─────────────────┘
```

---

## Key Insight: Time-Horizon Divergence

```
When predictions diverge across timeframes:

SCENARIO 1: Near-term strength, long-term weakness
────────────────────────────────────────────────
Hour:   ███████████████████████████ 75% BULLISH  ✓ Momentum
Day:    ███████████████████████ 70% BULLISH       ✓ Trend continues
Week:   ██████████████████ 62% BULLISH            ≈ Mixed signals
Month:  ████████████████ 58% NEUTRAL              ⚠️ Weakening
Decade: ██████████ 42% BEARISH                    ✗ Structural headwind

Interpretation: "Temporary bounce but long-term bearish trend"

────────────────────────────────────────────────

SCENARIO 2: Near-term weakness, long-term strength
────────────────────────────────────────────────
Hour:   ███████████ 45% BEARISH                   ✗ Oversold
Day:    ███████████████ 50% NEUTRAL               ≈ Stabilizing
Week:   ██████████████████ 62% BULLISH            ✓ Recovering
Month:  ███████████████████████ 70% BULLISH       ✓ Momentum building
Decade: ███████████████████████████████ 75% BULLISH  ✓ Structural support

Interpretation: "Excellent entry opportunity with tailwinds"
```

---

This architecture provides a complete view of how EcoAlert processes data and generates predictions at every level from user input to final output.
