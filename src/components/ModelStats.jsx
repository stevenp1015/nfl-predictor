import React from 'react';

const ModelStats = () => {
  return (
    <div className="mt-8 bg-white rounded-lg shadow-xl p-6">
      <h2 className="text-xl font-semibold text-gray-900">Model Performance</h2>
      <div className="mt-4 grid grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">89.1%</div>
          <div className="text-sm text-gray-500">Winner Prediction</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">55.3%</div>
          <div className="text-sm text-gray-500">Within 3 Points</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">91.7%</div>
          <div className="text-sm text-gray-500">Within 7 Points</div>
        </div>
      </div>
    </div>
  );
};

export default ModelStats;