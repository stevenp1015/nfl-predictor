import pickle
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- CONFIGURATION ---
RECENT_GAMES_WINDOW = 17

# --- TEAM NAME MAPPING (Your excellent addition) ---
TEAM_ABBREVIATIONS = {
    'ARI': 'Arizona Cardinals', 'ATL': 'Atlanta Falcons', 'BAL': 'Baltimore Ravens',
    'BUF': 'Buffalo Bills', 'CAR': 'Carolina Panthers', 'CHI': 'Chicago Bears',
    'CIN': 'Cincinnati Bengals', 'CLE': 'Cleveland Browns', 'DAL': 'Dallas Cowboys',
    'DEN': 'Denver Broncos', 'DET': 'Detroit Lions', 'GB': 'Green Bay Packers',
    'HOU': 'Houston Texans', 'IND': 'Indianapolis Colts', 'JAX': 'Jacksonville Jaguars',
    'KC': 'Kansas City Chiefs', 'LV': 'Las Vegas Raiders', 'LAC': 'Los Angeles Chargers',
    'LAR': 'Los Angeles Rams', 'MIA': 'Miami Dolphins', 'MIN': 'Minnesota Vikings',
    'NE': 'New England Patriots', 'NO': 'New Orleans Saints', 'NYG': 'New York Giants',
    'NYJ': 'New York Jets', 'PHI': 'Philadelphia Eagles', 'PIT': 'Pittsburgh Steelers',
    'SF': 'San Francisco 49ers', 'SEA': 'Seattle Seahawks', 'TB': 'Tampa Bay Buccaneers',
    'TEN': 'Tennessee Titans', 'WAS': 'Washington Commanders'
}

def resolve_team_name(team_input):
    """Convert team abbreviation to full name or return as-is if already full name."""
    return TEAM_ABBREVIATIONS.get(team_input.upper(), team_input)

# --- THE SACRED FEATURE LIST ---
FEATURE_COLUMNS = [
    'third_down_rate_away', 'third_down_rate_home', 'redzone_rate_away', 
    'redzone_rate_home', 'yards_per_play_away', 'yards_per_play_home',
    'turnovers_away', 'turnovers_home', 'possession_minutes_away', 
    'possession_minutes_home', 'weather_temperature', 'weather_wind_mph'
]

# --- THE PREDICTION SERVICE FORTRESS (REFORGED) ---
class PredictionService:
    def __init__(self, model_path, scaler_path, data_path):
        try:
            print("Attempting to load model...")
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
            print("Model loaded.")

            print("Attempting to load scaler...")
            with open(scaler_path, 'rb') as f:
                self.scaler = pickle.load(f)
            print("Scaler loaded.")
            
            print("Attempting to load historical data...")
            self.historical_df = pd.read_csv(data_path)
            self.historical_df['date'] = pd.to_datetime(self.historical_df['date'])
            print("Historical data loaded.")

        except (FileNotFoundError, pickle.UnpicklingError, Exception) as e:
            print(f"FATAL PREDICTOR INIT ERROR: {e}")
            raise RuntimeError("Failed to initialize PredictionService. Check resource paths and file integrity.") from e

    # SURGICAL INCISION HERE. THIS FUNCTION IS NOW TIME-AWARE.
    def _get_recent_team_averages(self, team_name, prediction_date):
        """
        Calculates team performance features using only data available BEFORE the prediction_date.
        THIS FUNCTION NO LONGER CHEATS.
        """
        # STEP 1: Filter the entire universe of data to only include the past.
        past_games = self.historical_df[self.historical_df['date'] < prediction_date].copy()
        
        # STEP 2: Now, from this past-only data, find the team's games.
        team_games = past_games[(past_games['team_home'] == team_name) | (past_games['team_away'] == team_name)]
        
        if team_games.empty: return None
        
        # STEP 3: Get the most recent games from the already-filtered past data.
        team_games = team_games.sort_values(by='date', ascending=False).head(RECENT_GAMES_WINDOW)
        
        # ... The rest of the calculation logic remains the same ...
        results = {}
        home_games = team_games[team_games['team_home'] == team_name]
        away_games = team_games[team_games['team_away'] == team_name]
        results['third_down_rate'] = pd.concat([(home_games['third_down_comp_home'] / home_games['third_down_att_home']),(away_games['third_down_comp_away'] / away_games['third_down_att_away'])]).mean()
        results['redzone_rate'] = pd.concat([(home_games['redzone_comp_home'] / home_games['redzone_att_home']),(away_games['redzone_comp_away'] / away_games['redzone_att_away'])]).mean()
        results['yards_per_play'] = pd.concat([(home_games['yards_home'] / home_games['plays_home']),(away_games['yards_away'] / away_games['plays_away'])]).mean()
        results['turnovers'] = pd.concat([(home_games['fumbles_home'].fillna(0) + home_games['interceptions_home'].fillna(0)),(away_games['fumbles_away'].fillna(0) + away_games['interceptions_away'].fillna(0))]).mean()
        def convert_possession(pos_time):
            try:
                minutes, seconds = str(pos_time).split(':')
                return float(minutes) + float(seconds) / 60
            except: return 30.0
        results['possession_minutes'] = pd.concat([home_games['possession_home'].apply(convert_possession),away_games['possession_away'].apply(convert_possession)]).mean()
        for key, value in results.items():
            if pd.isna(value): results[key] = 0.0
        return results

    # SURGICAL INCISION HERE. THIS FUNCTION NOW REQUIRES A DATE.
    def predict_margin(self, home_team, away_team, game_date, weather_temp=70, weather_wind=5):
        """
        Generates a prediction for a game occurring on a specific date.
        """
        # We now pass the game_date to the averaging function.
        home_stats = self._get_recent_team_averages(home_team, game_date)
        away_stats = self._get_recent_team_averages(away_team, game_date)

        if not home_stats or not away_stats: return None

        feature_dict = {
            'third_down_rate_away': away_stats['third_down_rate'],
            'third_down_rate_home': home_stats['third_down_rate'],
            'redzone_rate_away': away_stats['redzone_rate'],
            'redzone_rate_home': home_stats['redzone_rate'],
            'yards_per_play_away': away_stats['yards_per_play'],
            'yards_per_play_home': home_stats['yards_per_play'],
            'turnovers_away': away_stats['turnovers'],
            'turnovers_home': home_stats['turnovers'],
            'possession_minutes_away': away_stats['possession_minutes'],
            'possession_minutes_home': home_stats['possession_minutes'],
            'weather_temperature': weather_temp,
            'weather_wind_mph': weather_wind
        }
        features_df = pd.DataFrame([feature_dict], columns=FEATURE_COLUMNS)
        
        scaled_features = self.scaler.transform(features_df)
        prediction = self.model.predict(scaled_features)
        
        return prediction[0]

# --- FLASK APP SETUP ---
app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:3000"}})

# --- APPLICATION LEVEL RESOURCE LOADING ---
try:
    predictor = PredictionService(
        model_path='src/ml/nfl_prediction_model.pkl',
        scaler_path='src/ml/feature_scaler.pkl',
        data_path='nfldata.csv'
    )
except RuntimeError as e:
    print(f"Could not start PredictionService: {e}")
    predictor = None

# --- API ROUTES (now passing the date) ---
@app.route('/predict', methods=['POST'])
def predict():
    if predictor is None:
        return jsonify({"error": "Prediction service is offline. Check server logs."}), 503

    try:
        data = request.get_json()
        if not data or 'homeTeam' not in data or 'awayTeam' not in data:
            return jsonify({"error": "Invalid request."}), 400
        
        home_team = resolve_team_name(data['homeTeam'])
        away_team = resolve_team_name(data['awayTeam'])
        
        print(f"Resolved teams: {data['homeTeam']} -> {home_team}, {data['awayTeam']} -> {away_team}")
        
        # For a true future prediction, the frontend would send the game's date.
        # Since we're predicting for "tonight", we'll use today's date as the prediction moment.
        # This ensures we only use historical data up until this very second.
        prediction_date = pd.Timestamp.now()

        predicted_margin = predictor.predict_margin(
            home_team,
            away_team,
            prediction_date # The crucial new argument
        )

        if predicted_margin is None:
            return jsonify({"error": "Could not generate prediction for the given teams."}), 404
            
        return jsonify({'predictedMargin': round(float(predicted_margin), 1)})

    except Exception as e:
        print(f"An error occurred during prediction: {e}")
        return jsonify({"error": "An internal error occurred during prediction."}), 500

@app.route('/')
def index():
    status = "OPERATIONAL" if predictor is not None else "DEGRADED - PREDICTIONS OFFLINE"
    return f"NFL Prediction Server Status: {status}"

if __name__ == '__main__':
    app.run(debug=True, port=5001)