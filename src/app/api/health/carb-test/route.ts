import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = getDb();
    const dayNumber = parseInt(body.dayNumber, 10);
    if (!dayNumber || dayNumber < 1 || dayNumber > 14) {
      return NextResponse.json({ success: false, error: "Dagnummer må være mellom 1 og 14" }, { status: 400 });
    }

    const date = body.date || new Date().toISOString().split("T")[0];
    const energyScore = Math.max(1, Math.min(parseInt(body.energyScore, 10) || 3, 5));
    const sugarCravingScore = Math.max(1, Math.min(parseInt(body.sugarCravingScore, 10) || 3, 5));
    const bloatingScore = Math.max(1, Math.min(parseInt(body.bloatingScore, 10) || 2, 5));
    const notes = body.notes || "";

    db.prepare(`
      INSERT INTO carb_test_logs (dayNumber, date, energyScore, sugarCravingScore, bloatingScore, notes, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(dayNumber) DO UPDATE SET
        date = excluded.date,
        energyScore = excluded.energyScore,
        sugarCravingScore = excluded.sugarCravingScore,
        bloatingScore = excluded.bloatingScore,
        notes = excluded.notes,
        updatedAt = excluded.updatedAt
    `).run(dayNumber, date, energyScore, sugarCravingScore, bloatingScore, notes, new Date().toISOString());

    return NextResponse.json({ success: true, dayNumber, energyScore, sugarCravingScore });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
