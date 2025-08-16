import React from 'react';

const TeamSelector = ({ label, value, onChange }) => {
  // NFL teams organized by conference
  const nflTeams = {
    AFC: [
      { id: 'BUF', name: 'Buffalo Bills' },
      { id: 'MIA', name: 'Miami Dolphins' },
      { id: 'NE', name: 'New England Patriots' },
      { id: 'NYJ', name: 'New York Jets' },
      { id: 'BAL', name: 'Baltimore Ravens' },
      { id: 'CIN', name: 'Cincinnati Bengals' },
      { id: 'CLE', name: 'Cleveland Browns' },
      { id: 'PIT', name: 'Pittsburgh Steelers' },
      { id: 'HOU', name: 'Houston Texans' },
      { id: 'IND', name: 'Indianapolis Colts' },
      { id: 'JAX', name: 'Jacksonville Jaguars' },
      { id: 'TEN', name: 'Tennessee Titans' },
      { id: 'DEN', name: 'Denver Broncos' },
      { id: 'KC', name: 'Kansas City Chiefs' },
      { id: 'LV', name: 'Las Vegas Raiders' },
      { id: 'LAC', name: 'Los Angeles Chargers' },
    ],
    NFC: [
      { id: 'DAL', name: 'Dallas Cowboys' },
      { id: 'NYG', name: 'New York Giants' },
      { id: 'PHI', name: 'Philadelphia Eagles' },
      { id: 'WAS', name: 'Washington Commanders' },
      { id: 'CHI', name: 'Chicago Bears' },
      { id: 'DET', name: 'Detroit Lions' },
      { id: 'GB', name: 'Green Bay Packers' },
      { id: 'MIN', name: 'Minnesota Vikings' },
      { id: 'ATL', name: 'Atlanta Falcons' },
      { id: 'CAR', name: 'Carolina Panthers' },
      { id: 'NO', name: 'New Orleans Saints' },
      { id: 'TB', name: 'Tampa Bay Buccaneers' },
      { id: 'ARI', name: 'Arizona Cardinals' },
      { id: 'LA', name: 'Los Angeles Rams' },
      { id: 'SF', name: 'San Francisco 49ers' },
      { id: 'SEA', name: 'Seattle Seahawks' },
    ],
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="">Select Team</option>
        {Object.entries(nflTeams).map(([conference, teams]) => (
          <optgroup key={conference} label={conference}>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
};

export default TeamSelector;