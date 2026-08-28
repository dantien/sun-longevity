import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const workouts = db.prepare("SELECT * FROM workouts ORDER BY startTime DESC").all();
    return NextResponse.json({ success: true, workouts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = getDb();
    const id = `workout_${Date.now()}`;
    const startTime = body.startTime || new Date().toISOString();
    const endTime = body.endTime || new Date().toISOString();
    const durationSeconds = parseInt(body.durationSeconds, 10) || 0;
    const distanceMeters = parseFloat(body.distanceMeters) || 0;
    const avgBpm = parseInt(body.avgBpm, 10) || 120;
    const maxBpm = parseInt(body.maxBpm, 10) || avgBpm;
    const timeInMafZoneSeconds = parseInt(body.timeInMafZoneSeconds, 10) || 0;
    const avgPaceMinPerKm = parseFloat(body.avgPaceMinPerKm) || (distanceMeters > 0 ? (durationSeconds / 60) / (distanceMeters / 1000) : 6.0);
    const gpxRouteJson = body.gpxRouteJson ? JSON.stringify(body.gpxRouteJson) : null;
    const notes = body.notes || "";

    db.prepare(`
      INSERT INTO workouts (
        id, activityType, startTime, endTime, durationSeconds, distanceMeters,
        avgBpm, maxBpm, timeInMafZoneSeconds, avgPaceMinPerKm, gpxRouteJson, notes, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      body.activityType || "RUN",
      startTime,
      endTime,
      durationSeconds,
      distanceMeters,
      avgBpm,
      maxBpm,
      timeInMafZoneSeconds,
      avgPaceMinPerKm,
      gpxRouteJson,
      notes,
      new Date().toISOString()
    );

    return NextResponse.json({ success: true, workoutId: id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
