export interface NFLTeam {
  id: string;
  name: string;
  shortName: string;
  city: string;
  conference: 'AFC' | 'NFC';
  division: 'North' | 'South' | 'East' | 'West';
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  record?: string;
  stats?: {
    offense: number;
    defense: number;
    recent: string;
  };
}

export const NFL_TEAMS: Record<string, NFLTeam> = {
  // AFC East
  bills: {
    id: 'bills',
    name: 'Buffalo Bills',
    shortName: 'BUF',
    city: 'Buffalo',
    conference: 'AFC',
    division: 'East',
    primaryColor: '#00338D',
    secondaryColor: '#C60C30',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/BUF',
    record: '10-2',
    stats: { offense: 88, defense: 85, recent: 'W4' }
  },
  dolphins: {
    id: 'dolphins',
    name: 'Miami Dolphins',
    shortName: 'MIA',
    city: 'Miami',
    conference: 'AFC',
    division: 'East',
    primaryColor: '#008E97',
    secondaryColor: '#FC4C02',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/MIA',
    record: '6-6',
    stats: { offense: 75, defense: 72, recent: 'L2' }
  },
  patriots: {
    id: 'patriots',
    name: 'New England Patriots',
    shortName: 'NE',
    city: 'New England',
    conference: 'AFC',
    division: 'East',
    primaryColor: '#002244',
    secondaryColor: '#C60C30',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/NE',
    record: '3-9',
    stats: { offense: 65, defense: 68, recent: 'L4' }
  },
  jets: {
    id: 'jets',
    name: 'New York Jets',
    shortName: 'NYJ',
    city: 'New York',
    conference: 'AFC',
    division: 'East',
    primaryColor: '#125740',
    secondaryColor: '#000000',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/NYJ',
    record: '4-8',
    stats: { offense: 70, defense: 75, recent: 'L3' }
  },

  // AFC North
  ravens: {
    id: 'ravens',
    name: 'Baltimore Ravens',
    shortName: 'BAL',
    city: 'Baltimore',
    conference: 'AFC',
    division: 'North',
    primaryColor: '#241773',
    secondaryColor: '#9E7C0C',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/BAL',
    record: '8-4',
    stats: { offense: 90, defense: 80, recent: 'W3' }
  },
  bengals: {
    id: 'bengals',
    name: 'Cincinnati Bengals',
    shortName: 'CIN',
    city: 'Cincinnati',
    conference: 'AFC',
    division: 'North',
    primaryColor: '#FB4F14',
    secondaryColor: '#000000',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/CIN',
    record: '5-7',
    stats: { offense: 82, defense: 70, recent: 'W2' }
  },
  browns: {
    id: 'browns',
    name: 'Cleveland Browns',
    shortName: 'CLE',
    city: 'Cleveland',
    conference: 'AFC',
    division: 'North',
    primaryColor: '#311D00',
    secondaryColor: '#FF3C00',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/CLE',
    record: '3-9',
    stats: { offense: 60, defense: 65, recent: 'L2' }
  },
  steelers: {
    id: 'steelers',
    name: 'Pittsburgh Steelers',
    shortName: 'PIT',
    city: 'Pittsburgh',
    conference: 'AFC',
    division: 'North',
    primaryColor: '#FFB612',
    secondaryColor: '#101820',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/PIT',
    record: '9-3',
    stats: { offense: 78, defense: 88, recent: 'W1' }
  },

  // AFC South
  texans: {
    id: 'texans',
    name: 'Houston Texans',
    shortName: 'HOU',
    city: 'Houston',
    conference: 'AFC',
    division: 'South',
    primaryColor: '#03202F',
    secondaryColor: '#A71930',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/HOU',
    record: '8-4',
    stats: { offense: 84, defense: 76, recent: 'W2' }
  },
  colts: {
    id: 'colts',
    name: 'Indianapolis Colts',
    shortName: 'IND',
    city: 'Indianapolis',
    conference: 'AFC',
    division: 'South',
    primaryColor: '#002C5F',
    secondaryColor: '#A2AAAD',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/IND',
    record: '6-6',
    stats: { offense: 74, defense: 78, recent: 'W1' }
  },
  jaguars: {
    id: 'jaguars',
    name: 'Jacksonville Jaguars',
    shortName: 'JAX',
    city: 'Jacksonville',
    conference: 'AFC',
    division: 'South',
    primaryColor: '#101820',
    secondaryColor: '#D7A22A',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/JAX',
    record: '3-9',
    stats: { offense: 68, defense: 62, recent: 'L5' }
  },
  titans: {
    id: 'titans',
    name: 'Tennessee Titans',
    shortName: 'TEN',
    city: 'Nashville',
    conference: 'AFC',
    division: 'South',
    primaryColor: '#0C2340',
    secondaryColor: '#4B92DB',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/TEN',
    record: '3-9',
    stats: { offense: 65, defense: 70, recent: 'L3' }
  },

  // AFC West
  broncos: {
    id: 'broncos',
    name: 'Denver Broncos',
    shortName: 'DEN',
    city: 'Denver',
    conference: 'AFC',
    division: 'West',
    primaryColor: '#FB4F14',
    secondaryColor: '#002244',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/DEN',
    record: '8-4',
    stats: { offense: 78, defense: 85, recent: 'W4' }
  },
  chiefs: {
    id: 'chiefs',
    name: 'Kansas City Chiefs',
    shortName: 'KC',
    city: 'Kansas City',
    conference: 'AFC',
    division: 'West',
    primaryColor: '#E31837',
    secondaryColor: '#FFB612',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/KC',
    record: '11-1',
    stats: { offense: 92, defense: 78, recent: 'W5' }
  },
  raiders: {
    id: 'raiders',
    name: 'Las Vegas Raiders',
    shortName: 'LV',
    city: 'Las Vegas',
    conference: 'AFC',
    division: 'West',
    primaryColor: '#000000',
    secondaryColor: '#A5ACAF',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/LV',
    record: '3-9',
    stats: { offense: 72, defense: 58, recent: 'L8' }
  },
  chargers: {
    id: 'chargers',
    name: 'Los Angeles Chargers',
    shortName: 'LAC',
    city: 'Los Angeles',
    conference: 'AFC',
    division: 'West',
    primaryColor: '#0080C6',
    secondaryColor: '#FFC20E',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/LAC',
    record: '7-5',
    stats: { offense: 80, defense: 82, recent: 'W2' }
  },

  // NFC East
  cowboys: {
    id: 'cowboys',
    name: 'Dallas Cowboys',
    shortName: 'DAL',
    city: 'Dallas',
    conference: 'NFC',
    division: 'East',
    primaryColor: '#003594',
    secondaryColor: '#041E42',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/DAL',
    record: '5-7',
    stats: { offense: 76, defense: 64, recent: 'L5' }
  },
  giants: {
    id: 'giants',
    name: 'New York Giants',
    shortName: 'NYG',
    city: 'New York',
    conference: 'NFC',
    division: 'East',
    primaryColor: '#0B2265',
    secondaryColor: '#A71930',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/NYG',
    record: '2-10',
    stats: { offense: 58, defense: 62, recent: 'L7' }
  },
  eagles: {
    id: 'eagles',
    name: 'Philadelphia Eagles',
    shortName: 'PHI',
    city: 'Philadelphia',
    conference: 'NFC',
    division: 'East',
    primaryColor: '#004C54',
    secondaryColor: '#A5ACAF',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/PHI',
    record: '10-2',
    stats: { offense: 89, defense: 81, recent: 'W8' }
  },
  commanders: {
    id: 'commanders',
    name: 'Washington Commanders',
    shortName: 'WAS',
    city: 'Washington',
    conference: 'NFC',
    division: 'East',
    primaryColor: '#5A1414',
    secondaryColor: '#FFB612',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/WAS',
    record: '8-4',
    stats: { offense: 83, defense: 74, recent: 'W3' }
  },

  // NFC North
  bears: {
    id: 'bears',
    name: 'Chicago Bears',
    shortName: 'CHI',
    city: 'Chicago',
    conference: 'NFC',
    division: 'North',
    primaryColor: '#0B162A',
    secondaryColor: '#C83803',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/CHI',
    record: '4-8',
    stats: { offense: 70, defense: 75, recent: 'L6' }
  },
  lions: {
    id: 'lions',
    name: 'Detroit Lions',
    shortName: 'DET',
    city: 'Detroit',
    conference: 'NFC',
    division: 'North',
    primaryColor: '#0076B6',
    secondaryColor: '#B0B7BC',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/DET',
    record: '11-1',
    stats: { offense: 95, defense: 79, recent: 'W10' }
  },
  packers: {
    id: 'packers',
    name: 'Green Bay Packers',
    shortName: 'GB',
    city: 'Green Bay',
    conference: 'NFC',
    division: 'North',
    primaryColor: '#203731',
    secondaryColor: '#FFB612',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/GB',
    record: '9-3',
    stats: { offense: 86, defense: 81, recent: 'W1' }
  },
  vikings: {
    id: 'vikings',
    name: 'Minnesota Vikings',
    shortName: 'MIN',
    city: 'Minneapolis',
    conference: 'NFC',
    division: 'North',
    primaryColor: '#4F2683',
    secondaryColor: '#FFC62F',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/MIN',
    record: '6-6',
    stats: { offense: 79, defense: 73, recent: 'L2' }
  },

  // NFC South
  falcons: {
    id: 'falcons',
    name: 'Atlanta Falcons',
    shortName: 'ATL',
    city: 'Atlanta',
    conference: 'NFC',
    division: 'South',
    primaryColor: '#A71930',
    secondaryColor: '#000000',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/ATL',
    record: '6-6',
    stats: { offense: 77, defense: 70, recent: 'L1' }
  },
  panthers: {
    id: 'panthers',
    name: 'Carolina Panthers',
    shortName: 'CAR',
    city: 'Charlotte',
    conference: 'NFC',
    division: 'South',
    primaryColor: '#0085CA',
    secondaryColor: '#101820',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/CAR',
    record: '3-9',
    stats: { offense: 62, defense: 66, recent: 'W2' }
  },
  saints: {
    id: 'saints',
    name: 'New Orleans Saints',
    shortName: 'NO',
    city: 'New Orleans',
    conference: 'NFC',
    division: 'South',
    primaryColor: '#101820',
    secondaryColor: '#D3BC8D',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/NO',
    record: '4-8',
    stats: { offense: 69, defense: 71, recent: 'L7' }
  },
  buccaneers: {
    id: 'buccaneers',
    name: 'Tampa Bay Buccaneers',
    shortName: 'TB',
    city: 'Tampa Bay',
    conference: 'NFC',
    division: 'South',
    primaryColor: '#D50A0A',
    secondaryColor: '#FF7900',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/TB',
    record: '6-6',
    stats: { offense: 81, defense: 76, recent: 'L3' }
  },

  // NFC West
  cardinals: {
    id: 'cardinals',
    name: 'Arizona Cardinals',
    shortName: 'ARI',
    city: 'Arizona',
    conference: 'NFC',
    division: 'West',
    primaryColor: '#97233F',
    secondaryColor: '#000000',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/ARI',
    record: '6-6',
    stats: { offense: 74, defense: 69, recent: 'W3' }
  },
  rams: {
    id: 'rams',
    name: 'Los Angeles Rams',
    shortName: 'LAR',
    city: 'Los Angeles',
    conference: 'NFC',
    division: 'West',
    primaryColor: '#003594',
    secondaryColor: '#FFA300',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/LAR',
    record: '6-6',
    stats: { offense: 78, defense: 74, recent: 'L1' }
  },
  fortyniners: {
    id: 'fortyniners',
    name: 'San Francisco 49ers',
    shortName: 'SF',
    city: 'San Francisco',
    conference: 'NFC',
    division: 'West',
    primaryColor: '#AA0000',
    secondaryColor: '#B3995D',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/SF',
    record: '5-7',
    stats: { offense: 82, defense: 80, recent: 'L3' }
  },
  seahawks: {
    id: 'seahawks',
    name: 'Seattle Seahawks',
    shortName: 'SEA',
    city: 'Seattle',
    conference: 'NFC',
    division: 'West',
    primaryColor: '#002244',
    secondaryColor: '#69BE28',
    logo: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/api/clubs/logos/SEA',
    record: '7-5',
    stats: { offense: 83, defense: 75, recent: 'W2' }
  },
};

export const getTeamsByDivision = (conference: 'AFC' | 'NFC', division: 'North' | 'South' | 'East' | 'West'): NFLTeam[] => {
  return Object.values(NFL_TEAMS).filter(team => team.conference === conference && team.division === division);
};

export const getTeamsByConference = (conference: 'AFC' | 'NFC'): NFLTeam[] => {
  return Object.values(NFL_TEAMS).filter(team => team.conference === conference);
};

export const getAllTeams = (): NFLTeam[] => {
  return Object.values(NFL_TEAMS);
};

export const getTeamById = (id: string): NFLTeam | undefined => {
  return NFL_TEAMS[id];
};

// Convert NFLTeam to the Team interface used in components
export const convertToTeamInterface = (nflTeam: NFLTeam) => ({
  id: nflTeam.id,
  name: nflTeam.name,
  logo: nflTeam.logo,
  record: nflTeam.record || '0-0',
  color: nflTeam.primaryColor,
  stats: nflTeam.stats || { offense: 0, defense: 0, recent: '' }
});