// src/api/predictions.js

// No more simulation. We're calling the real deal.
const API_URL = "http://127.0.0.1:5001/predict";

export const getPrediction = async (homeTeam, awayTeam) => {
  console.log(`Sending prediction request for ${awayTeam} @ ${homeTeam}`);
  
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
        homeTeam, // The full team name, e.g., "Kansas City Chiefs"
        awayTeam, // e.g., "San Francisco 49ers"
        // We can add more context like weather later if you want
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to get a prediction from the server.');
  }

  const data = await response.json();
  
  // Let's reformat the response to match what the component expects
  // We can add more logic here later
  const winProbability = data.predictedMargin > 0 ? 0.65 : 0.35; // Simple logic for now
  
  return {
    predictedMargin: data.predictedMargin,
    winProbability: winProbability.toFixed(2),
    confidenceScore: (0.85).toFixed(2), // We can make this dynamic later
    keyFactors: [ // These are static for now, but could come from the backend
      { factor: 'Turnover Differential', impact: 'High' },
      { factor: 'Yards Per Play', impact: 'Medium' },
      { factor: 'Possession Time', impact: 'Low' }
    ]
  };
};