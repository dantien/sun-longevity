import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "gpx";
    const workoutId = searchParams.get("workoutId");
    const db = getDb();

    if (format === "json") {
      const profile = db.prepare("SELECT * FROM user_profile WHERE id = 'default_user'").get();
      const workouts = db.prepare("SELECT * FROM workouts ORDER BY startTime DESC").all();
      const mafTests = db.prepare("SELECT * FROM maf_monthly_tests ORDER BY date ASC").all();
      const hrvLogs = db.prepare("SELECT * FROM morning_hrv_logs ORDER BY date DESC").all();

      return new Response(JSON.stringify({ profile, workouts, mafTests, hrvLogs }, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="sun_longevity_export_${Date.now()}.json"`
        }
      });
    }

    // Default: GPX Workout Export
    const latestWorkout: any = workoutId 
      ? db.prepare("SELECT * FROM workouts WHERE id = ?").get(workoutId)
      : db.prepare("SELECT * FROM workouts ORDER BY startTime DESC LIMIT 1").get();

    const workoutName = latestWorkout ? `SUN MAF Workout ${latestWorkout.startTime}` : "SUN Longevity MAF Workout";
    const startTime = latestWorkout?.startTime || new Date().toISOString();

    const gpxXml = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="SUN Longevity — https://longevity.sevenunitynetwork.org" xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1">
  <metadata>
    <name>${workoutName}</name>
    <time>${startTime}</time>
  </metadata>
  <trk>
    <name>${workoutName}</name>
    <type>running</type>
    <trkseg>
      <trkpt lat="59.9139" lon="10.7522">
        <ele>45.0</ele>
        <time>${startTime}</time>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>${latestWorkout?.avgBpm || 130}</gpxtpx:hr>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
    </trkseg>
  </trk>
</gpx>`;

    return new Response(gpxXml, {
      headers: {
        "Content-Type": "application/gpx+xml",
        "Content-Disposition": `attachment; filename="sun_maf_workout_${Date.now()}.gpx"`
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
