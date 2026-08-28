import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = getDb();
    const date = body.date || new Date().toISOString().split("T")[0];
    const rmssd = parseFloat(body.rmssd) || 65.0;
    const restingBpm = parseInt(body.restingBpm, 10) || 52;
    const recoveryStatus = body.recoveryStatus || (rmssd > 55 ? "GREEN" : rmssd > 35 ? "YELLOW" : "RED");
    const advice = body.advice || (recoveryStatus === "GREEN" ? "Optimal parasympatisk restitusjon. Klar for god aerob økt." : "Moderat restitusjon. Hold økten rolig.");
    const notes = body.notes || "";

    db.prepare(`
      INSERT INTO morning_hrv_logs (date, rmssd, restingBpm, recoveryStatus, advice, notes, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(date) DO UPDATE SET
        rmssd = excluded.rmssd,
        restingBpm = excluded.restingBpm,
        recoveryStatus = excluded.recoveryStatus,
        advice = excluded.advice,
        notes = excluded.notes
    `).run(date, rmssd, restingBpm, recoveryStatus, advice, notes, new Date().toISOString());

    return NextResponse.json({ success: true, date, rmssd, recoveryStatus, advice });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
