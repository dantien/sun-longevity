import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, "longevity.db");

// Initialize Database singleton
let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initSchema(db);
  }
  return db;
}

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS user_profile (
      id TEXT PRIMARY KEY,
      age INTEGER NOT NULL,
      category TEXT NOT NULL,
      mafMaxBpm INTEGER NOT NULL,
      assessedAt TEXT NOT NULL,
      nextReassessmentDate TEXT NOT NULL,
      updatedAt TEXT NOT NULL
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
      gpxRouteJson TEXT,
      notes TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS maf_monthly_tests (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      distanceKm REAL NOT NULL,
      timeMinutes REAL NOT NULL,
      avgHeartRate INTEGER NOT NULL,
      paceMinPerKm TEXT NOT NULL,
      notes TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS morning_hrv_logs (
      date TEXT PRIMARY KEY,
      rmssd REAL NOT NULL,
      restingBpm INTEGER NOT NULL,
      recoveryStatus TEXT NOT NULL,
      advice TEXT,
      notes TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS carb_test_logs (
      dayNumber INTEGER PRIMARY KEY,
      date TEXT NOT NULL,
      energyScore INTEGER NOT NULL,
      sugarCravingScore INTEGER NOT NULL,
      bloatingScore INTEGER NOT NULL,
      notes TEXT,
      updatedAt TEXT NOT NULL
    );
  `);
}
