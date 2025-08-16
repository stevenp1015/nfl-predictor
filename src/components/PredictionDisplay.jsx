import React from 'react';

const PredictionDisplay = ({ prediction }) => {
  if (!prediction) return null;

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border-t border-gray-200 px-6 py-8">
      <div className="grid grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-500">
            Predicted Margin
          </div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">
            {prediction.predictedMargin}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-500">
            Win Probability
          </div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">
            {(prediction.winProbability * 100).toFixed(1)}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-500">
            Confidence Score
          </div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">
            {(prediction.confidenceScore * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900">Key Factors</h3>
        <div className="mt-4 space-y-4">
          {prediction.keyFactors.map((factor, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-600">{factor.factor}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getImpactColor(factor.impact)}`}>
                {factor.impact} Impact
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictionDisplay;