'use client';

import { TimeHorizonPrediction } from '@/lib/forecasting-engine';
import { ConfidenceGauge } from './confidence-gauge';

interface PredictionCardProps {
  prediction: TimeHorizonPrediction;
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  const getTimeframeLabel = (timeframe: string): string => {
    const labels: { [key: string]: string } = {
      hour: 'Next Hour',
      day: 'Next Day',
      week: 'Next Week',
      month: 'Next Month',
      decade: 'Next Decade',
    };
    return labels[timeframe] || timeframe;
  };

  const getProbabilityColor = (prob: number): string => {
    if (prob >= 60) return 'text-green-400';
    if (prob >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="card border-l-4 border-l-blue-500">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2 text-cyan-300">
          {getTimeframeLabel(prediction.timeframe)}
        </h3>
        <p className="text-lg text-slate-100 mb-4">{prediction.prediction}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <ConfidenceGauge
          label="Confidence"
          value={prediction.confidenceLevel}
          color="blue"
        />
        <ConfidenceGauge
          label="Bullish Prob."
          value={prediction.bullishProbability}
          color="green"
        />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
        <div className="bg-slate-700/50 p-2 rounded">
          <div className="text-slate-400 text-xs">Bullish</div>
          <div className={`text-lg font-bold ${getProbabilityColor(prediction.bullishProbability)}`}>
            {prediction.bullishProbability.toFixed(0)}%
          </div>
        </div>
        <div className="bg-slate-700/50 p-2 rounded">
          <div className="text-slate-400 text-xs">Neutral</div>
          <div className={`text-lg font-bold ${getProbabilityColor(prediction.neutralProbability)}`}>
            {prediction.neutralProbability.toFixed(0)}%
          </div>
        </div>
        <div className="bg-slate-700/50 p-2 rounded">
          <div className="text-slate-400 text-xs">Bearish</div>
          <div className={`text-lg font-bold ${getProbabilityColor(prediction.bearishProbability)}`}>
            {prediction.bearishProbability.toFixed(0)}%
          </div>
        </div>
      </div>

      <div className="mb-4 pb-4 border-b border-slate-700">
        <h4 className="text-sm font-semibold text-slate-300 mb-2">Reasoning</h4>
        <p className="text-sm text-slate-400">{prediction.reasoning}</p>
      </div>

      {prediction.keyFactors.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-300 mb-2">Key Factors</h4>
          <ul className="text-sm space-y-1">
            {prediction.keyFactors.map((factor, i) => (
              <li key={i} className="text-slate-400 flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                {factor}
              </li>
            ))}
          </ul>
        </div>
      )}

      {prediction.riskFactors.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-red-300 mb-2">Risk Factors</h4>
          <ul className="text-sm space-y-1">
            {prediction.riskFactors.map((risk, i) => (
              <li key={i} className="text-red-400 flex items-start">
                <span className="text-red-500 mr-2">⚠</span>
                {risk}
              </li>
            ))}
          </ul>
        </div>
      )}

      {prediction.assumptions.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-300 mb-2">Key Assumptions</h4>
          <ul className="text-sm space-y-1">
            {prediction.assumptions.map((assumption, i) => (
              <li key={i} className="text-slate-500 flex items-start">
                <span className="text-slate-400 mr-2">→</span>
                {assumption}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
