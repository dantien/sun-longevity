import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { question, language = "no" } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "Spørsmål kreves" }, { status: 400 });
    }

    const qLower = question.toLowerCase();

    // 1. Emergency safety intercept
    if (
      qLower.includes("brystsmerte") || 
      qLower.includes("pustevansker") || 
      qLower.includes("chest pain") || 
      qLower.includes("emergency") ||
      qLower.includes("blødning") ||
      qLower.includes("akutt")
    ) {
      return NextResponse.json({
        emergency: true,
        advice: language === "en" 
          ? "🚨 FOR ACUTE OR SEVERE SYMPTOMS: Immediately call Emergency 113 (Norway) / 911 / 112. SUN Longevity is a lifestyle and training guide and NEVER replaces emergency medical attention."
          : "🚨 VED AKUTTE ELLER ALVORLIGE SYMPTOMER: Ring umiddelbart Nødnummer 113 eller Legevakt 116 117. SUN Longevity erstatter aldri akuttmedisinsk hjelp.",
      });
    }

    const systemPrompt = `You are the SUN Longevity Medical & Lifestyle AI Advisor, specializing in Dr. Phil Maffetone's MAF 180 aerobic method, nutritional density, circadian biology, and preventive health.
Guidelines:
- Give evidence-based, practical, encouraging advice.
- Explain the physiology (mitochondria, fat oxidation vs lactic acid, insulin sensitivity).
- Language: Answer in ${language === "en" ? "English" : "Norwegian (bokmål)"}.
- Keep formatting concise with bullet points.
- Always include a reminder that you provide lifestyle advice, not medical prescriptions.`;

    // Try Local Ollama AI (qwen3:8b)
    try {
      const ollamaRes = await fetch("http://127.0.0.1:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "qwen3:8b",
          prompt: `${systemPrompt}\n\nUser Question: ${question}\n\nHelpful Advice:`,
          stream: false,
          options: {
            temperature: 0.3,
            num_predict: 400
          }
        }),
        signal: AbortSignal.timeout(6000)
      });

      if (ollamaRes.ok) {
        const data = await ollamaRes.json();
        if (data.response && data.response.trim().length > 20) {
          return NextResponse.json({
            success: true,
            source: "Local AI (Qwen 3 8B)",
            advice: data.response.trim(),
            researchBasis: "Dr. Phil Maffetone MAF Principles & PubMed Evidence Synthesis",
            disclaimer: language === "en"
              ? "💡 This is evidence-based lifestyle guidance. Always consult your personal physician for clinical medical diagnosis."
              : "💡 Dette er evidensbasert livsstils- og treningsveiledning. Rådene erstatter ikke undersøkelse eller diagnose fra din fastlege."
          });
        }
      }
    } catch (e) {
      console.warn("Local Ollama fallback triggered:", e);
    }

    // Failsafe deterministic evidence-based synthesis
    let advice = "";
    let researchBasis = "Nordiske Næringsstoffanbefalinger (NNR) & Maffetone Aerobic Science";

    if (qLower.includes("kost") || qLower.includes("mat") || qLower.includes("carb") || qLower.includes("sugar") || qLower.includes("sukker")) {
      advice = language === "en"
        ? "🥗 **Evidence-Based Nutrition & Metabolic Health:**\n" +
          "1. Prioritize whole, unprocessed foods with high nutrient density (pasture-raised eggs, fish, vegetables, healthy fats).\n" +
          "2. Eliminate refined sugars and simple carbs to restore insulin sensitivity and activate fat burning enzymes.\n" +
          "3. Maintain hydration and adequate magnesium/potassium electrolytes for muscular relaxation."
        : "🥗 **Evidensbaserte Ernærings- & Kostråd:**\n" +
          "1. Prioriter hele, uraffinerte råvarer med høy næringstetthet (grønnsaker, ren fisk/kjøtt, sunne fettsyrer).\n" +
          "2. Kutt raffinert sukker og raske karbohydrater for å gjenopprette insulinfølsomhet og aktivere aerob fettforbrenning.\n" +
          "3. Sørg for tilstrekkelig hydrering og magnesium/elektrolytter.";
    } else if (qLower.includes("søvn") || qLower.includes("sleep") || qLower.includes("stress") || qLower.includes("hrv")) {
      advice = language === "en"
        ? "😴 **Evidence-Based Sleep & Parasympathetic Recovery:**\n" +
          "1. Get 15–20 minutes of natural outdoor daylight within 30 minutes of waking up to set your circadian clock.\n" +
          "2. Avoid blue light screens 1–2 hours before bedtime.\n" +
          "3. Keep your bedroom cool (16–18°C) and completely dark to maximize deep sleep and morning HRV."
        : "😴 **Evidensbaserte Søvn- & Restitusjonsråd:**\n" +
          "1. Eksponer øynene for naturlig dagslys innen 30 minutter etter oppvåkning for å stille døgnrytmen.\n" +
          "2. Unngå skjermer og blått lys 1-2 timer før sengetid.\n" +
          "3. Hold soverommet kjølig (ca. 16-18°C) og mørkt for dyp restitusjon og optimal morgen-HRV.";
    } else {
      advice = language === "en"
        ? "🏃‍♂️ **MAF 180 Aerobic Foundation:**\n" +
          "Training strictly at or below your MAF heart rate builds mitochondrial density and teaches the muscle fibers to use fat as the primary fuel source without accumulating cortisol or lactic acid."
        : "🏃‍♂️ **MAF 180 Aerob Treningsveiledning:**\n" +
          "Trening strengt på eller under din MAF-makspuls bygger mitokondrietetthet og lærer musklene å bruke fett som primært drivstoff uten å bygge opp melkesyre eller stresshormoner.";
    }

    return NextResponse.json({
      success: true,
      source: "Deterministic Evidence Engine",
      advice,
      researchBasis,
      disclaimer: language === "en"
        ? "💡 This is evidence-based lifestyle guidance. Consult your doctor for personal clinical evaluation."
        : "💡 Dette er evidensbasert livsstils- og treningsveiledning. Rådene erstatter ikke diagnose fra fastlege."
    });
  } catch (e: any) {
    return NextResponse.json({ error: "Feil ved rådgivning: " + e.message }, { status: 500 });
  }
}
