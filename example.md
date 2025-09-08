```python
import requests
import json
from datetime import date

todays_date = date.today().strftime("%Y-%m-%d")

url = "https://v1.american-football.api-sports.io/games"

querystring = {"date": todays_date}

# Using the correct header for a direct API-Sports key
headers = {
    'x-apisports-key': "429ca8b9e27132f33cab2aac6a007107"
}

try:
    response = requests.get(url, headers=headers, params=querystring, timeout=10) # Added a timeout
    
    # This little shit is crucial. It will raise the HTTPError if the response was bad (e.g., 403, 404, 500).
    response.raise_for_status()

    games_data = response.json()
    print(json.dumps(games_data, indent=4))

# You put them right here, after the 'try' block, just like before.
# Order matters: from most specific to most general.
except requests.exceptions.HTTPError as errh:
    print(f"Http Error: The server said no. Status code: {errh.response.status_code}")
    print(f"Reason: {errh.response.text}")
except requests.exceptions.ConnectionError as errc:
    print(f"Error Connecting: Couldn't even connect to the server. Check your internet or the URL.")
    print(f"Details: {errc}")
except requests.exceptions.Timeout as errt:
    print(f"Timeout Error: The request took too long to get a response.")
    print(f"Details: {errt}")
except requests.exceptions.RequestException as err:
    print(f"Something else fucked up. A generic requests error happened.")
    print(f"Details: {err}")

```

```json
{
  "get": "games",
  "parameters": {
    "date": "2022-09-30"
  },
  "errors": [],
  "results": 3,
  "response": [
    {
      "game": {
        "id": 4550,
        "stage": "FBS (Division I-A)",
        "week": "5",
        "date": {
          "timezone": "UTC",
          "date": "2022-09-30",
          "time": "00:00",
          "timestamp": 1664496000
        },
        "venue": {
          "name": null,
          "city": null
        },
        "status": {
          "short": "FT",
          "long": "Finished",
          "timer": null
        }
      },
      "league": {
        "id": 2,
        "name": "NCAA",
        "season": "2022",
        "logo": "https://media.api-sports.io/american-football/leagues/2.png",
        "country": {
          "name": "USA",
          "code": "US",
          "flag": "https://media.api-sports.io/flags/us.svg"
        }
      },
      "teams": {
        "home": {
          "id": 136,
          "name": "BYU",
          "logo": "https://media.api-sports.io/american-football/teams/136.png"
        },
        "away": {
          "id": 45,
          "name": "Utah State",
          "logo": "https://media.api-sports.io/american-football/teams/45.png"
        }
      },
      "scores": {
        "home": {
          "quarter_1": 14,
          "quarter_2": 3,
          "quarter_3": 14,
          "quarter_4": 7,
          "overtime": null,
          "total": 38
        },
        "away": {
          "quarter_1": 7,
          "quarter_2": 10,
          "quarter_3": 3,
          "quarter_4": 6,
          "overtime": null,
          "total": 26
        }
      }
    },
    {
      "game": {
        "id": 4002,
        "stage": "Regular Season",
        "week": "Week 4",
        "date": {
          "timezone": "UTC",
          "date": "2022-09-30",
          "time": "00:15",
          "timestamp": 1664496900
        },
        "venue": {
          "name": "Paycor Stadium",
          "city": null
        },
        "status": {
          "short": "FT",
          "long": "Finished",
          "timer": null
        }
      },
      "league": {
        "id": 1,
        "name": "NFL",
        "season": "2022",
        "logo": "https://media.api-sports.io/american-football/leagues/1.png",
        "country": {
          "name": "USA",
          "code": "US",
          "flag": "https://media.api-sports.io/flags/us.svg"
        }
      },
      "teams": {
        "home": {
          "id": 10,
          "name": "Cincinnati Bengals",
          "logo": "https://media.api-sports.io/american-football/teams/10.png"
        },
        "away": {
          "id": 25,
          "name": "Miami Dolphins",
          "logo": "https://media.api-sports.io/american-football/teams/25.png"
        }
      },
      "scores": {
        "home": {
          "quarter_1": 7,
          "quarter_2": 7,
          "quarter_3": 0,
          "quarter_4": 13,
          "overtime": null,
          "total": 27
        },
        "away": {
          "quarter_1": 3,
          "quarter_2": 9,
          "quarter_3": 3,
          "quarter_4": 0,
          "overtime": null,
          "total": 15
        }
      }
    },
    {
      "game": {
        "id": 4551,
        "stage": "FBS (Division I-A)",
        "week": "5",
        "date": {
          "timezone": "UTC",
          "date": "2022-09-30",
          "time": "23:00",
          "timestamp": 1664578800
        },
        "venue": {
          "name": null,
          "city": null
        },
        "status": {
          "short": "AOT",
          "long": "After Over Time",
          "timer": null
        }
      },
      "league": {
        "id": 2,
        "name": "NCAA",
        "season": "2022",
        "logo": "https://media.api-sports.io/american-football/leagues/2.png",
        "country": {
          "name": "USA",
          "code": "US",
          "flag": "https://media.api-sports.io/flags/us.svg"
        }
      },
      "teams": {
        "home": {
          "id": 134,
          "name": "Houston",
          "logo": "https://media.api-sports.io/american-football/teams/134.png"
        },
        "away": {
          "id": 180,
          "name": "Tulane",
          "logo": "https://media.api-sports.io/american-football/teams/180.png"
        }
      },
      "scores": {
        "home": {
          "quarter_1": 0,
          "quarter_2": 7,
          "quarter_3": 0,
          "quarter_4": 14,
          "overtime": 3,
          "total": 24
        },
        "away": {
          "quarter_1": 0,
          "quarter_2": 7,
          "quarter_3": 7,
          "quarter_4": 7,
          "overtime": 6,
          "total": 27
        }
      }
    },
  ]
}```