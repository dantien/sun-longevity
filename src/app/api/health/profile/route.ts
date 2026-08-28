import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { calculateMafHeartRate, MafCategory } from "@/lib/maffetone";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const age = parseInt(body.age, 10) || 45;
    const category: MafCategory = body.category || "C_CONSISTENT";

    const profile = calculateMafHeartRate(age, category);
    const db = getDb();

    db.prepare(`
      INSERT INTO user_profile (id, age, category, mafMaxBpm, assessedAt, nextReassessmentDate, updatedAt)
      VALUES ('default_user', ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        age = excluded.age,
        category = excluded.category,
        mafMaxBpm = excluded.mafMaxBpm,
        assessedAt = excluded.assessedAt,
        nextReassessmentDate = excluded.nextReassessmentDate,
        updatedAt = excluded.updatedAt
    `).run(
      age,
      category,
      profile.mafMaxHeartRate,
      profile.assessedAt,
      profile.nextReassessmentDate,
      new Date().toISOString()
    );

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
