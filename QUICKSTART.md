# EcoAlert - Quick Start Guide

## 🚀 Get Started in 2 Minutes

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation & Run

```bash
# Navigate to project
cd c:\Users\alia04\Documents\GitHub\EcoAlert

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 📋 First Prediction

1. **Select a Domain**
   - Technology
   - Economic
   - Social
   - Political
   - Environmental

2. **Enter Your Question**
   - Example: "What will happen to AI startup valuations in the next month?"

3. **Click Generate**
   - Wait for analysis (typically 1-2 seconds)

4. **Review Results**
   - **5 timeframes** of predictions (hour → decade)
   - **Confidence score** for each
   - **Key factors** driving the forecast
   - **Risk factors** to watch
   - **Detailed reasoning**

---

## 🎯 Understanding Your Forecast

### Confidence Levels

| Level | Meaning |
|-------|---------|
| 90-100% | High conviction - Trust this forecast |
| 70-89% | Good confidence - Reasonably reliable |
| 50-69% | Moderate - Mixed signals |
| <50% | Low confidence - Use with caution |

### Time Horizons

- **Hour**: What happens in the next 60 minutes
- **Day**: 24-hour outlook
- **Week**: 5-7 day forecast
- **Month**: 30-day outlook
- **Decade**: 10-year structural outlook

### Probabilities

```
Bullish + Bearish + Neutral = 100%

Example:
Bullish:  65% ✅ (upward movement more likely)
Neutral:  20%
Bearish:  15%
```

---

## 💡 Tips for Better Predictions

✅ **DO:**
- Be specific in your question
- Include relevant context
- Compare multiple time horizons
- Check the key assumptions

❌ **DON'T:**
- Ask vague questions
- Ignore low confidence scores
- Rely on single time horizon
- Forget to verify your assumptions

---

## 📊 Example Predictions

### Example 1: Tech Valuations
```
Domain: Technology
Question: "Will AI company IPO valuations stay elevated?"

Expected Result:
- Hour: 75% bullish (recent momentum)
- Day: 70% bullish (short-term sentiment)
- Week: 62% bullish (some consolidation)
- Month: 58% neutral (mixed signals)
- Decade: 42% bearish (historical patterns suggest cycles)
```

### Example 2: Economic Growth
```
Domain: Economic
Question: "Will the economy enter recession in next 12 months?"

Expected Result:
- Hour: 45% bearish (recent data weak)
- Day: 48% bearish (slight deterioration)
- Week: 52% bearish (leading indicators softening)
- Month: 58% bearish (structural concerns)
- Decade: 65% neutral (long-term uncertainty)
```

### Example 3: Social Trends
```
Domain: Social
Question: "How will remote work affect city real estate demand?"

Expected Result:
- Hour: 62% bearish (current trend negative)
- Day: 60% bearish (trend continues)
- Week: 58% bearish (transitioning)
- Month: 55% neutral (competing forces)
- Decade: 48% bullish (eventual stabilization)
```

---

## 🔧 Advanced Features

### API Access

Make predictions programmatically:

```bash
curl -X POST http://localhost:3000/api/forecast \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "tech",
    "description": "What will happen to semiconductor demand?"
  }'
```

### Batch Analysis

Forecast multiple scenarios:

```javascript
const scenarios = [
  "Bull case: AI drives 30% productivity gain",
  "Base case: 10% productivity improvement",
  "Bear case: AI fails to deliver ROI"
];

for (const scenario of scenarios) {
  const result = await fetch('/api/forecast', {
    method: 'POST',
    body: JSON.stringify({
      domain: 'economic',
      description: scenario
    })
  });
  console.log(await result.json());
}
```

---

## 📖 Learn More

- **[README.md](README.md)** - Complete documentation
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical deep dive
- **[EXAMPLES.md](EXAMPLES.md)** - Advanced usage recipes

---

## ❓ FAQ

**Q: How long does a forecast take?**
A: Typically 1-3 seconds. Results are cached for 5 minutes for identical queries.

**Q: Can I trust these predictions?**
A: Predictions are probabilistic estimates based on input data and assumptions. They should inform but not dictate decisions. Always consult domain experts.

**Q: Can I use this for financial advice?**
A: No. This tool is for analytical exploration, not investment advice. Verify with professionals.

**Q: How is confidence calculated?**
A: Confidence combines the certainty of component analyses (patterns, forces, events, views) weighted by time horizon. See ARCHITECTURE.md for details.

**Q: Can I add custom data?**
A: Yes! Modify `src/lib/data-loader.ts` to connect to your own data sources.

---

## 🐛 Troubleshooting

**Issue: Predictions seem generic**
- → Be more specific in your question
- → Check data loader for domain-specific patterns

**Issue: Low confidence (<40%)**
- → More conflicting signals in data
- → Consider checking multiple domains
- → May be genuinely uncertain situation

**Issue: Page doesn't load**
- → Ensure Node.js is running (`npm run dev`)
- → Check http://localhost:3000
- → Check browser console for errors

---

## 📞 Support

For issues or questions:
1. Check EXAMPLES.md for usage patterns
2. Review ARCHITECTURE.md for technical details
3. Examine data-loader.ts for data sources
4. Test API directly with curl

---

## 🎓 Next Steps

1. ✅ **Generate your first forecast**
2. 📊 **Compare multiple time horizons**
3. 🔄 **Try different domains**
4. 🔌 **Explore API integration**
5. 📈 **Build on data sources**

Happy forecasting! 🚀
