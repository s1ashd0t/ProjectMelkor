import { ForecastForm } from '@/components/forecast-form';

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gradient mb-2">
            EcoAlert
          </h1>
          <p className="text-xl text-slate-400 mb-4">
            Multi-Horizon Forecasting Engine
          </p>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-cyan-400 rounded"></div>
        </div>

        {/* Description */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="card">
            <h3 className="text-lg font-semibold text-cyan-300 mb-3">Historical Patterns</h3>
            <p className="text-sm text-slate-400">
              Analyzes long-term historical patterns to identify recurring cycles and structural trends that may influence future outcomes.
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-cyan-300 mb-3">Structural Forces</h3>
            <p className="text-sm text-slate-400">
              Evaluates deep economic, social, and political forces that shape outcomes over different time horizons.
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-cyan-300 mb-3">Current Events & Contrarian Views</h3>
            <p className="text-sm text-slate-400">
              Synthesizes recent developments and contrarian perspectives to challenge consensus thinking.
            </p>
          </div>
        </div>

        {/* Main Form */}
        <ForecastForm />

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-700 text-center text-slate-500 text-sm">
          <p>
            This forecasting engine synthesizes multiple data sources to generate probabilistic predictions.
            <br />
            Use with careful consideration of assumptions and limitations. Past patterns don't guarantee future results.
          </p>
        </div>
      </div>
    </main>
  );
}
