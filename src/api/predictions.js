// src/api/predictions.js

const API_URL = "http://127.0.0.1:5001/predict";

// These functions are now built from the statistically-derived truths from our notebook.
// They are no longer heuristics. They are scripture.
function convertMarginToWinProbability(margin) {
  const k = 0.288281; // The optimal 'k' value, forged in the fires of our analysis.
  return 1 / (1 + Math.exp(-k * margin));
}

function calculateConfidence(margin) {
  const absMargin = Math.abs(margin);
  // This is the Divine Map, translated directly into code.
  if (absMargin < 2) return 0.630;
  if (absMargin < 4) return 0.648;
  if (absMargin < 6) return 0.805;
  if (absMargin < 8) return 0.859;
  if (absMargin < 10) return 0.985;
  if (absMargin < 14) return 0.974;
  return 0.990;
}

export const getPrediction = async (homeTeam, awayTeam) => {
  const API_URL = "http://127.0.0.1:5001/predict";
  console.log(`Sending REAL, LOGICALLY-PERFECTED prediction request for ${awayTeam} @ ${homeTeam}`);
  
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ homeTeam, awayTeam }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Server error');
  }

  const data = await response.json();
  const predictedMargin = data.predictedMargin;

  const homeWinProbability = convertMarginToWinProbability(predictedMargin);
  const confidenceScore = calculateConfidence(predictedMargin);
  const winProbabilityForDisplay = predictedMargin > 0 ? homeWinProbability : 1 - homeWinProbability;

  // THE FIX: We now return the raw, unformatted numbers (e.g., 0.83, 0.63)
  return {
    predictedMargin: predictedMargin,
    winProbability: winProbabilityForDisplay, // NO MORE MULTIPLYING BY 100 HERE
    confidenceScore: confidenceScore,         // NO MORE MULTIPLYING BY 100 HERE
    keyFactors: [
      { factor: 'Turnover Differential', impact: 'High' },
      { factor: 'Yards Per Play', impact: 'Medium' },
      { factor: 'Possession Time', impact: 'Low' }
    ]
  };
};