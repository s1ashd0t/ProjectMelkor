import { NextRequest, NextResponse } from 'next/server';
import { ForecastingEngine } from '@/lib/forecasting-engine';
import { DataLoader, PredictionCache } from '@/lib/data-loader';

const cache = new PredictionCache();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, description } = body;

    if (!domain || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: domain, description' },
        { status: 400 }
      );
    }

    // Check cache
    const cacheKey = `${domain}_${description}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, fromCache: true });
    }

    // Build prediction input
    const input = await DataLoader.buildPredictionInput(domain, description);

    // Generate forecast
    const engine = new ForecastingEngine();
    const prediction = engine.forecast(input);

    // Cache result
    cache.set(cacheKey, prediction);

    return NextResponse.json(prediction);
  } catch (error) {
    console.error('Forecast error:', error);
    return NextResponse.json(
      { error: 'Failed to generate forecast' },
      { status: 500 }
    );
  }
}
