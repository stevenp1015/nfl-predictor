import type { ScoreboardResponse, Event, Team } from '@/types';

export class ScoreboardService {
  private static readonly CACHE_PREFIX = 'espn';
  private static readonly CACHE_VERSION = '1.0';
  private static readonly CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 1 day

  async loadDataFor(date: string | { start: string; end: string }): Promise<ScoreboardResponse | null> {
    const isRange = typeof date === 'object';
    const cacheKey = isRange
      ? `${ScoreboardService.CACHE_PREFIX}_data_${date.start}_${date.end}`
      : `${ScoreboardService.CACHE_PREFIX}_data_${date}`;

    // Check if we have valid cached data
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    // Fetch fresh data
    const url = isRange
      ? `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${date.start.replace(/-/g, '')}-${date.end.replace(/-/g, '')}`
      : `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${date.replace(/-/g, '')}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`API call failed with status: ${response.status}`);
        return null;
      }
      const data: ScoreboardResponse = await response.json();
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error("Data fetch failed:", error);
      return null;
    }
  }

  private getCachedData<T>(key: string): T | null {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;
      const { data, timestamp, version } = JSON.parse(cached);
      if (version !== ScoreboardService.CACHE_VERSION) return null;
      if (Date.now() - timestamp > ScoreboardService.CACHE_EXPIRY_MS) return null;
      return data;
    } catch {
      return null;
    }
  }

  private setCachedData<T>(key: string, data: T): void {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
      version: ScoreboardService.CACHE_VERSION
    };
    localStorage.setItem(key, JSON.stringify(cacheEntry));
  }

  // Helper to get all teams from cached data
  getAllTeamsFromCache(): Team[] {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`${ScoreboardService.CACHE_PREFIX}_data_`)) {
        const cached = this.getCachedData<ScoreboardResponse>(key);
        if (cached?.events) {
          return cached.events.flatMap(event =>
            event.competitions.flatMap(comp =>
              comp.competitors.map(comp => comp.team)
            )
          ).filter((team, index, self) =>
            self.findIndex(t => t.id === team.id) === index
          );
        }
      }
    }
    return [];
  }

  // Helper to get season calendar
  getSeasonCalendarFromCache() {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`${ScoreboardService.CACHE_PREFIX}_data_`)) {
        const cached = this.getCachedData<ScoreboardResponse>(key);
        return cached?.leagues?.[0]?.calendar;
      }
    }
    return undefined;
  }
}
