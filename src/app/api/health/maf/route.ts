import { NextResponse } from "next/server";
import { calculateMafHeartRate, MafCategory } from "@/lib/maffetone";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const age = parseInt(body.age, 10) || 45;
    const category: MafCategory = body.category || "C_CONSISTENT";

    const profile = calculateMafHeartRate(age, category);
    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
