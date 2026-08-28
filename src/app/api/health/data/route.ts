import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { calculateMafHeartRate, MafCategory } from "@/lib/maffetone";

export async function GET() {
  try {
    const db = getDb();

    // Fetch user profile or initialize default
    let profileRow: any = db.prepare("SELECT * FROM user_profile WHERE id = 'default_user'").get();
    if (!profileRow) {
      const initialMaf = calculateMafHeartRate(49, "C_CONSISTENT");
      db.prepare(`
        INSERT INTO user_profile (id, age, category, mafMaxBpm, assessedAt, nextReassessmentDate, updatedAt)
        VALUES ('default_user', 49, 'C_CONSISTENT', ?, ?, ?, ?)
      `).run(initialMaf.mafMaxHeartRate, initialMaf.assessedAt, initialMaf.nextReassessmentDate, new Date().toISOString());

      profileRow = db.prepare("SELECT * FROM user_profile WHERE id = 'default_user'").get();
    }

    const calculatedProfile = calculateMafHeartRate(profileRow.age, profileRow.category as MafCategory, new Date(profileRow.assessedAt));

    const workouts = db.prepare("SELECT * FROM workouts ORDER BY startTime DESC LIMIT 50").all();
    const mafTests = db.prepare("SELECT * FROM maf_monthly_tests ORDER BY date ASC").all();
    const hrvLogs = db.prepare("SELECT * FROM morning_hrv_logs ORDER BY date DESC LIMIT 30").all();
    const carbLogs = db.prepare("SELECT * FROM carb_test_logs ORDER BY dayNumber ASC").all();

    return NextResponse.json({
      success: true,
      profile: calculatedProfile,
      workouts,
      mafTests,
      hrvLogs,
      carbLogs
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
