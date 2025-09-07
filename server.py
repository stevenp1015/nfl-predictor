import pickle
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

# --- SETUP AND CONFIG ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
RECENT_GAMES_WINDOW = 13
TEAM_ABBREVIATIONS = { 'ARI': 'Arizona Cardinals', 'ATL': 'Atlanta Falcons', 'BAL': 'Baltimore Ravens', 'BUF': 'Buffalo Bills', 'CAR': 'Carolina Panthers', 'CHI': 'Chicago Bears', 'CIN': 'Cincinnati Bengals', 'CLE': 'Cleveland Browns', 'DAL': 'Dallas Cowboys', 'DEN': 'Denver Broncos', 'DET': 'Detroit Lions', 'GB': 'Green Bay Packers', 'HOU': 'Houston Texans', 'IND': 'Indianapolis Colts', 'JAX': 'Jacksonville Jaguars', 'KC': 'Kansas City Chiefs', 'LV': 'Las Vegas Raiders', 'LAC': 'Los Angeles Chargers', 'LAR': 'Los Angeles Rams', 'MIA': 'Miami Dolphins', 'MIN': 'Minnesota Vikings', 'NE': 'New England Patriots', 'NO': 'New Orleans Saints', 'NYG': 'New York Giants', 'NYJ': 'New York Jets', 'PHI': 'Philadelphia Eagles', 'PIT': 'Pittsburgh Steelers', 'SF': 'San Francisco 49ers', 'SEA': 'Seattle Seahawks', 'TB': 'Tampa Bay Buccaneers', 'TEN': 'Tennessee Titans', 'WAS': 'Washington Commanders' }

def resolve_team_name(team_input):
    return TEAM_ABBREVIATIONS.get(team_input.upper(), team_input)

# --- THE PREDICTION SERVICE (NOW WITH DATA SANITIZATION) ---
class PredictionService:
    def __init__(self, model_path, scaler_path, data_path):
        self.feature_columns = ['third_down_rate_away', 'third_down_rate_home', 'redzone_rate_away', 'redzone_rate_home', 'yards_per_play_away', 'yards_per_play_home', 'turnovers_away', 'turnovers_home', 'possession_minutes_away', 'possession_minutes_home', 'weather_temperature', 'weather_wind_mph']
        try:
            logging.info("Initializing PredictionService...")
            with open(model_path, 'rb') as f: self.model = pickle.load(f)
            with open(scaler_path, 'rb') as f: self.scaler = pickle.load(f)
            
            # THE CRITICAL FIX: SANITIZE DATA IMMEDIATELY AFTER LOADING
            self.historical_df = self._sanitize_dataframe(pd.read_csv(data_path))
            
            self._calculate_league_averages()
            logging.info("PredictionService is armed and fully operational.")
        except Exception as e:
            logging.error(f"FATAL PREDICTOR INIT ERROR: {e}", exc_info=True)
            raise RuntimeError("Failed to initialize PredictionService.") from e

    def _sanitize_dataframe(self, df):
        """Forces critical columns to numeric types, coercing errors. This is our data firewall."""
        logging.info("Sanitizing DataFrame and enforcing numeric data types...")
        df['date'] = pd.to_datetime(df['date'])
        
        numeric_cols = [
            'third_down_comp_home', 'third_down_att_home', 'redzone_comp_home', 'redzone_att_home',
            'yards_home', 'plays_home', 'fumbles_home', 'interceptions_home',
            'third_down_comp_away', 'third_down_att_away', 'redzone_comp_away', 'redzone_att_away',
            'yards_away', 'plays_away', 'fumbles_away', 'interceptions_away'
        ]
        
        for col in numeric_cols:
            df[col] = pd.to_numeric(df[col], errors='coerce')
        
        logging.info("Data sanitization complete.")
        return df

    def _calculate_league_averages(self):
        # This function is now safer because it operates on sanitized data.
        self.league_averages = {}
        df = self.historical_df.copy()
        def safe_rate(num, den):
            den = den.replace(0, np.nan) # Use replace to avoid SettingWithCopyWarning
            return num / den
        self.league_averages['third_down_rate'] = pd.concat([safe_rate(df['third_down_comp_home'], df['third_down_att_home']), safe_rate(df['third_down_comp_away'], df['third_down_att_away'])]).mean()
        self.league_averages['redzone_rate'] = pd.concat([safe_rate(df['redzone_comp_home'], df['redzone_att_home']), safe_rate(df['redzone_comp_away'], df['redzone_att_away'])]).mean()
        self.league_averages['yards_per_play'] = pd.concat([safe_rate(df['yards_home'], df['plays_home']), safe_rate(df['yards_away'], df['plays_away'])]).mean()
        self.league_averages['turnovers'] = pd.concat([df['fumbles_home'].fillna(0) + df['interceptions_home'].fillna(0), df['fumbles_away'].fillna(0) + df['interceptions_away'].fillna(0)]).mean()
        def convert_possession_series(pos_series):
            parts = pos_series.astype(str).str.split(':', expand=True)
            minutes = pd.to_numeric(parts[0], errors='coerce')
            seconds = pd.to_numeric(parts[1], errors='coerce')
            return minutes + seconds / 60
        self.league_averages['possession_minutes'] = pd.concat([convert_possession_series(df['possession_home']), convert_possession_series(df['possession_away'])]).mean()
        logging.info(f"League averages calculated: {self.league_averages}")

    def _get_recent_team_averages(self, team_name, prediction_date):
        # This function is now safer because it operates on sanitized data.
        past_games = self.historical_df[self.historical_df['date'] < prediction_date].copy()
        team_games = past_games[(past_games['team_home'].str.strip() == team_name.strip()) | (past_games['team_away'].str.strip() == team_name.strip())]
        
        if len(team_games) < 5:
            logging.warning(f"Insufficient historical data ({len(team_games)} games) for {team_name}. Falling back to league averages.")
            return self.league_averages
        
        recent_games = team_games.sort_values(by='date', ascending=False).head(RECENT_GAMES_WINDOW)
        stats = {}
        stat_keys = ['third_down_rate', 'redzone_rate', 'yards_per_play', 'turnovers', 'possession_minutes']
        
        for key in stat_keys:
            stat_values = []
            for _, game in recent_games.iterrows():
                suffix = '_home' if game['team_home'] == team_name else '_away'
                try:
                    if key == 'third_down_rate':
                        num, den = game[f'third_down_comp{suffix}'], game[f'third_down_att{suffix}']
                        if pd.notna(den) and den > 0: stat_values.append(num / den)
                    elif key == 'redzone_rate':
                        num, den = game[f'redzone_comp{suffix}'], game[f'redzone_att{suffix}']
                        if pd.notna(den) and den > 0: stat_values.append(num / den)
                    elif key == 'yards_per_play':
                        num, den = game[f'yards{suffix}'], game[f'plays{suffix}']
                        if pd.notna(den) and den > 0: stat_values.append(num / den)
                    elif key == 'turnovers':
                        val = game[f'fumbles{suffix}'] + game[f'interceptions{suffix}']
                        if pd.notna(val): stat_values.append(val)
                    elif key == 'possession_minutes':
                        pos_str = game[f'possession{suffix}']
                        if pd.notna(pos_str):
                            m, s = map(int, str(pos_str).split(':'))
                            stat_values.append(m + s / 60)
                except (ValueError, TypeError, KeyError):
                    continue
            
            if stat_values:
                stats[key] = np.mean(stat_values)
            else:
                logging.warning(f"'{key}' produced no valid data points for {team_name}, using league average.")
                stats[key] = self.league_averages[key]

        logging.info(f"Calculated unique stats for {team_name}: {stats}")
        return stats

    def predict_margin(self, home_team, away_team, game_date):
        # This function remains the same, but now receives higher quality data.
        home_stats = self._get_recent_team_averages(home_team, game_date)
        away_stats = self._get_recent_team_averages(away_team, game_date)
        feature_dict = {
            'third_down_rate_away': away_stats['third_down_rate'], 'third_down_rate_home': home_stats['third_down_rate'],
            'redzone_rate_away': away_stats['redzone_rate'], 'redzone_rate_home': home_stats['redzone_rate'],
            'yards_per_play_away': away_stats['yards_per_play'], 'yards_per_play_home': home_stats['yards_per_play'],
            'turnovers_away': away_stats['turnovers'], 'turnovers_home': home_stats['turnovers'],
            'possession_minutes_away': away_stats['possession_minutes'], 'possession_minutes_home': home_stats['possession_minutes'],
            'weather_temperature': 70, 'weather_wind_mph': 5
        }
        features_df = pd.DataFrame([feature_dict], columns=self.feature_columns)
        scaled_features = self.scaler.transform(features_df)
        prediction = self.model.predict(scaled_features)
        return prediction[0]

# --- FLASK APP SETUP & ROUTES ---
app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:3000"}})
try:
    predictor = PredictionService(
        model_path='src/ml/nfl_prediction_model.pkl',
        scaler_path='src/ml/feature_scaler.pkl',
        data_path='nfldata.csv'
    )
except RuntimeError as e:
    predictor = None

@app.route('/predict', methods=['POST'])
def predict():
    if predictor is None: return jsonify({"error": "Prediction service is offline."}), 503
    try:
        data = request.get_json()
        if not data or 'homeTeam' not in data or 'awayTeam' not in data:
            return jsonify({"error": "Invalid request."}), 400
        home_team = resolve_team_name(data['homeTeam'])
        away_team = resolve_team_name(data['awayTeam'])
        prediction_date = pd.Timestamp.now()
        predicted_margin = predictor.predict_margin(home_team, away_team, prediction_date)
        return jsonify({'predictedMargin': round(float(predicted_margin), 1)})
    except Exception as e:
        logging.error(f"An error occurred during prediction: {e}", exc_info=True)
        return jsonify({"error": "An internal error occurred."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)