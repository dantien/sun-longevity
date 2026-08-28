/**
 * SQLite Offline-First Database for SUN Longevity
 * 100% Sovereign Local Storage (GDPR Art. 9)
 */

export interface DbWorkout {
  id: string;
  activityType: "RUN" | "WALK" | "CYCLE" | "OTHER";
  startTime: string;
  endTime: string;
  durationSeconds: number;
  distanceMeters: number;
  avgBpm: number;
  maxBpm: number;
  timeInMafZoneSeconds: number;
  avgPaceMinPerKm: number;
  notes?: string;
}

export interface DbMorningHrv {
  date: string; // YYYY-MM-DD
  rmssd: number;
  restingBpm: number;
  recoveryStatus: "GREEN" | "YELLOW" | "RED";
  notes?: string;
}

export interface DbCarbDayLog {
  dayNumber: number; // 1-14
  date: string;
  energyScore: number; // 1-5
  sugarCravingScore: number; // 1-5
  bloatingScore: number; // 1-5
  notes?: string;
}

export const SQLITE_SCHEMA = `
  CREATE TABLE IF NOT EXISTS user_profile (
    id TEXT PRIMARY KEY,
    age INTEGER NOT NULL,
    category TEXT NOT NULL,
    mafMaxBpm INTEGER NOT NULL,
    assessedAt TEXT NOT NULL,
    nextReassessmentDate TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS workouts (
    id TEXT PRIMARY KEY,
    activityType TEXT NOT NULL,
    startTime TEXT NOT NULL,
    endTime TEXT NOT NULL,
    durationSeconds INTEGER NOT NULL,
    distanceMeters REAL NOT NULL,
    avgBpm INTEGER NOT NULL,
    maxBpm INTEGER NOT NULL,
    timeInMafZoneSeconds INTEGER NOT NULL,
    avgPaceMinPerKm REAL NOT NULL,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS heart_rate_samples (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workoutId TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    bpm INTEGER NOT NULL,
    rrIntervalMs INTEGER,
    lat REAL,
    lng REAL,
    FOREIGN KEY(workoutId) REFERENCES workouts(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS morning_hrv_logs (
    date TEXT PRIMARY KEY,
    rmssd REAL NOT NULL,
    restingBpm INTEGER NOT NULL,
    recoveryStatus TEXT NOT NULL,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS carb_test_logs (
    dayNumber INTEGER PRIMARY KEY,
    date TEXT NOT NULL,
    energyScore INTEGER NOT NULL,
    sugarCravingScore INTEGER NOT NULL,
    bloatingScore INTEGER NOT NULL,
    notes TEXT
  );
`;
