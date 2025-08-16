// temporarily simulate api calls until we connect backend
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const getPrediction = async (homeTeam, awayTeam) => {
  await delay(1500); // simulate network request
  
  const predictedMargin = Math.random() * 14 - 7;
  const winProbability = predictedMargin > 0 ? 
    0.5 + Math.random() * 0.4 : 
    0.5 - Math.random() * 0.4;

  return {
    predictedMargin: predictedMargin.toFixed(1),
    winProbability: winProbability.toFixed(2),
    confidenceScore: (0.7 + Math.random() * 0.25).toFixed(2),
    keyFactors: [
      { factor: 'Turnover Differential', impact: 'High' },
      { factor: 'Yards Per Play', impact: 'Medium' },
      { factor: 'Time of Possession', impact: 'Low' }
    ]
  };
};