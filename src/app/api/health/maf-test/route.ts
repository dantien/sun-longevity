import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = getDb();
    const id = `maf_test_${Date.now()}`;
    const date = body.date || new Date().toISOString().split("T")[0];
    const distanceKm = parseFloat(body.distanceKm) || 5.0;
    const timeMinutes = parseFloat(body.timeMinutes) || 30.0;
    const avgHeartRate = parseInt(body.avgHeartRate, 10) || 130;
    const paceDecimal = timeMinutes / distanceKm;
    const paceMin = Math.floor(paceDecimal);
    const paceSec = Math.round((paceDecimal - paceMin) * 60);
    const paceMinPerKm = `${paceMin}:${paceSec < 10 ? '0' : ''}${paceSec} min/km`;
    const notes = body.notes || "";

    db.prepare(`
      INSERT INTO maf_monthly_tests (id, date, distanceKm, timeMinutes, avgHeartRate, paceMinPerKm, notes, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, date, distanceKm, timeMinutes, avgHeartRate, paceMinPerKm, notes, new Date().toISOString());

    return NextResponse.json({ success: true, id, pace: paceMinPerKm });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
