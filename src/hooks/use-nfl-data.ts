import { useState, useEffect, useCallback } from 'react';
import { ScoreboardService } from '@/lib/scoreboard-service';
import type { ScoreboardResponse, Event, Team, CalendarEntry, CalendarWeekEntry } from '@/types';

// Date utilities (simulate date-fns)
const formatDate = (date: Date) => date.toISOString().split('T')[0].replace(/-/g, '');
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
const formatEasternTime = (utc: string) => {
  const date = new Date(utc);
  return date.toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

interface NFLDataState {
  events: Event[];
  calendar?: CalendarEntry[];
  teams: Team[];
  currentWeek?: string;
  loading: boolean;
  error: string | null;
}

interface UseNFLDataActions {
  loadWeekData: (weekNumber: number) => Promise<void>;
  refreshCurrentWeek: () => Promise<void>;
  getWeekEvents: (week: number) => Event[];
}

const service = new ScoreboardService();

export function useNFLData(): NFLDataState & UseNFLDataActions {
  const [state, setState] = useState<NFLDataState>({
    events: [],
    calendar: undefined,
    teams: [],
    currentWeek: undefined,
    loading: false,
    error: null,
  });

  const setLoading = (loading: boolean) =>
    setState(prev => ({ ...prev, loading }));

  const setError = (error: string | null) =>
    setState(prev => ({ ...prev, error }));

  // Load initial data (calendar and teams)
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check for cached teams
      const cachedTeams = service.getAllTeamsFromCache();
      if (cachedTeams.length > 0) {
        setState(prev => ({ ...prev, teams: cachedTeams }));
      }

      // Check for cached calendar
      const cachedCalendar = service.getSeasonCalendarFromCache();
      if (cachedCalendar) {
        setState(prev => ({ ...prev, calendar: cachedCalendar }));
      }

      // If no cached data, fetch today's data to populate
      const todayDate = new Date();
      const todayStr = formatDate(todayDate);

      // Get fresh calendar if not cached
      let currentCachedCalendar = cachedCalendar;
      if (!currentCachedCalendar) {
        const data = await service.loadDataFor(todayStr);
        if (data) {
          currentCachedCalendar = data.leagues?.[0]?.calendar;

          const teams = data.events.flatMap(event =>
            event.competitions.flatMap(comp =>
              comp.competitors.map(comp => comp.team)
            )
          ).filter((team, index, self) =>
            self.findIndex(t => t.id === team.id) === index
          );

          setState(prev => ({
            ...prev,
            teams,
            calendar: currentCachedCalendar,
          }));
        }
      }

      // Automatically load current week events by finding current NFL week
      const nflWeek = findCurrentNFLWeek(todayDate, currentCachedCalendar || []);
      if (nflWeek) {
        setState(prev => ({ ...prev, currentWeek: nflWeek.toString() }));
        await loadWeekData(nflWeek);
      } else {
        // Fallback
        await loadWeekData(Math.ceil((todayDate.getTime() - new Date(todayDate.getFullYear(), 8, 1).getTime()) / (7 * 24 * 3600000)));
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load initial data');
    } finally {
      setLoading(false);
    }
  }, []);

  const findCurrentNFLWeek = (date: Date, calendar: CalendarEntry[]): number | null => {
    // First, find the Regular Season entry specifically
    const regularSeason = calendar.find(e => e.label === "Regular Season");
    if (!regularSeason?.entries) return null;

    for (const week of regularSeason.entries) {
      const start = new Date(week.startDate);
      const end = new Date(week.endDate);
      if (date >= start && date <= end) {
        return parseInt(week.value);
      }
    }

    // Fallback to any entry if no regular season found
    for (const entry of calendar) {
      for (const week of entry.entries) {
        const start = new Date(week.startDate);
        const end = new Date(week.endDate);
        if (date >= start && date <= end) {
          return parseInt(week.value);
        }
      }
    }
    return null;
  };

  const loadWeekData = useCallback(async (weekNumber: number) => {
    setLoading(true);

    // Try to get calendar first to find actual week dates
    let startDate, endDate;
    const calendar = service.getSeasonCalendarFromCache();
    if (calendar) {
      // Find the week from any season type
      for (const entry of calendar) {
        const week = entry.entries.find(w => parseInt(w.value) === weekNumber);
        if (week) {
          // Extract date part only (remove T time)
          startDate = week.startDate.split('T')[0];
          endDate = week.endDate.split('T')[0];
          break;
        }
      }
    }

    // Fallback to calculation if no calendar
    if (!startDate || !endDate) {
      const today = new Date();
      const startOfSeason = new Date(today.getFullYear(), 8, 1);
      const weekStart = addDays(startOfSeason, (weekNumber - 1) * 7);
      startDate = formatDate(weekStart);
      endDate = formatDate(addDays(weekStart, 6));
    }

    // Fetch for the week range
    const data = await service.loadDataFor({ start: startDate, end: endDate });

    setState(prev => ({
      ...prev,
      events: data?.events?.filter(e => e.week.number === weekNumber) || [],
      currentWeek: weekNumber.toString(),
      loading: false
    }));
  }, []);

  const refreshCurrentWeek = useCallback(async () => {
    if (state.currentWeek) {
      const weekNum = parseInt(state.currentWeek);
      await loadWeekData(weekNum);
    }
  }, [state.currentWeek, loadWeekData]);

  const getWeekEvents = useCallback((week: number) =>
    state.events.filter(e => e.week.number === week), [state.events]);

  // Poll for live updates every 3-5 minutes
  useEffect(() => {
    const pollInterval = setInterval(() => {
      if (state.currentWeek && state.events.some(e => e.status.type.state === 'in')) {
        refreshCurrentWeek();
      }
    }, 3 * 60 * 1000); // 3 minutes

    return () => clearInterval(pollInterval);
  }, [state.currentWeek, state.events, refreshCurrentWeek]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return {
    ...state,
    loadWeekData,
    refreshCurrentWeek,
    getWeekEvents,
  };
}
