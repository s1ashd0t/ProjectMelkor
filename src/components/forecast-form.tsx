'use client';

import { useState, FormEvent } from 'react';
import { Prediction } from '@/lib/forecasting-engine';
import { PredictionCard } from './prediction-card';

interface ForecastFormProps {
  onSubmit?: (prediction: Prediction) => void;
}

export function ForecastForm({ onSubmit }: ForecastFormProps) {
  const [domain, setDomain] = useState('tech');
  const [description, setDescription] = useState(
    'Analyze the trajectory of AI technology adoption and market implications'
  );
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const domains = [
    { value: 'tech', label: 'Technology' },
    { value: 'economic', label: 'Economic' },
    { value: 'social', label: 'Social' },
    { value: 'political', label: 'Political' },
    { value: 'environmental', label: 'Environmental' },
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate forecast');
      }

      const data = await response.json();
      setPrediction(data);
      onSubmit?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="card border-t-4 border-t-cyan-400">
        <h2 className="text-2xl font-bold text-gradient mb-6">Multi-Horizon Forecast Engine</h2>

        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="domain" className="block text-sm font-semibold text-slate-300 mb-2">
              Analysis Domain
            </label>
            <select
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
            >
              {domains.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-slate-300 mb-2">
              What would you like to forecast?
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the subject, situation, or question you want forecasted..."
              rows={4}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400 placeholder-slate-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating Forecast...' : 'Generate Multi-Horizon Forecast'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}
      </form>

      {prediction && (
        <div>
          <div className="mb-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <h3 className="text-lg font-semibold text-cyan-300 mb-2">Forecast Overview</h3>
            <p className="text-slate-300 mb-3 text-sm">{prediction.input.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-slate-400 mb-1">Overall Confidence</div>
                <div className="text-2xl font-bold text-blue-400">
                  {prediction.overallConfidence.toFixed(0)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">Forecast ID</div>
                <div className="text-xs text-slate-500 font-mono break-all">
                  {prediction.id}
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500">
              Generated: {new Date(prediction.timestamp).toLocaleString()}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gradient">Predictions by Timeframe</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {prediction.predictions.map((pred) => (
                <PredictionCard key={pred.timeframe} prediction={pred} />
              ))}
            </div>
          </div>

          {prediction.limitations.length > 0 && (
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-700/50 rounded-lg">
              <h4 className="font-semibold text-yellow-300 mb-2 text-sm">Methodology & Limitations</h4>
              <p className="text-xs text-slate-400 mb-3">{prediction.methodology}</p>
              <ul className="text-xs text-slate-500 space-y-1">
                {prediction.limitations.map((limit, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-2">•</span>
                    {limit}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
