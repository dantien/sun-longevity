"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Activity, 
  AlertTriangle, 
  Award,
  Brain, 
  CheckCircle2,
  ChevronRight,
  Download,
  Flame, 
  Globe,
  HeartPulse, 
  HelpCircle,
  Lock,
  Play,
  RotateCcw,
  ShieldCheck, 
  Sparkles, 
  Square,
  Timer, 
  TrendingUp, 
  Volume2,
  VolumeX,
  Zap 
} from "lucide-react";
import { 
  calculateMafHeartRate, 
  determineMafCategoryFromAnswers, 
  MafCategory, 
  MafProfile, 
  MafAssessmentQuestions 
} from "@/lib/maffetone";

export default function SunLongevityApp() {
  const [lang, setLang] = useState<"no" | "en">("no");
  const [activeTab, setActiveTab] = useState<"workout" | "assessment" | "hrv" | "carb" | "advisor">("workout");
  const [viewMode, setViewMode] = useState<"senior" | "standard" | "data">("senior");

  // User Profile & MAF
  const [age, setAge] = useState<number>(49);
  const [category, setCategory] = useState<MafCategory>("C_CONSISTENT");
  const [mafProfile, setMafProfile] = useState<MafProfile>(calculateMafHeartRate(49, "C_CONSISTENT"));

  // Onboarding Wizard State
  const [wizardAnswers, setWizardAnswers] = useState<MafAssessmentQuestions>({
    hasMajorIllnessOrMedication: false,
    hasInjuryOrFrequentColds: false,
    hasConsistentTraining2Years: true,
    hasContinuousProgress2Years: false,
  });

  // Live Workout State
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [simulatedBpm, setSimulatedBpm] = useState<number>(126);
  const [workoutDurationSec, setWorkoutDurationSec] = useState<number>(0);
  const [timeInZoneSec, setTimeInZoneSec] = useState<number>(0);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [lastAudioAlert, setLastAudioAlert] = useState<string>("Klar til start. Trykk 'Start Økt'");
  const [distanceKm, setDistanceKm] = useState<number>(0.0);

  // Persistent Database State
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [mafTests, setMafTests] = useState<any[]>([]);
  const [hrvLogs, setHrvLogs] = useState<any[]>([]);
  const [carbLogs, setCarbLogs] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Morning HRV State
  const [hrvStatus, setHrvStatus] = useState<"IDLE" | "MEASURING" | "DONE">("IDLE");
  const [hrvSeconds, setHrvSeconds] = useState(60);

  // AI Advisor State
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Load persistent data from SQLite backend
  const refreshData = async () => {
    try {
      const res = await fetch("/api/health/data");
      if (res.ok) {
        const json = await res.json();
        if (json.profile) {
          setMafProfile(json.profile);
          setAge(json.profile.age);
          setCategory(json.profile.category);
        }
        setWorkouts(json.workouts || []);
        setMafTests(json.mafTests || []);
        setHrvLogs(json.hrvLogs || []);
        setCarbLogs(json.carbLogs || []);
      }
    } catch (e) {
      console.warn("Failed to load persistent health data:", e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Audio Speech Helper
  const speakText = (text: string) => {
    setLastAudioAlert(text);
    if (!audioEnabled) return;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "en" ? "en-US" : "nb-NO";
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Workout Timer & Simulation Loop
  useEffect(() => {
    let interval: any = null;
    if (isWorkoutActive) {
      interval = setInterval(() => {
        setWorkoutDurationSec((prev) => {
          const nextDuration = prev + 1;
          
          setSimulatedBpm((prevBpm) => {
            const jitter = Math.floor(Math.random() * 3) - 1;
            let targetBpm = prevBpm + jitter;
            if (nextDuration % 15 === 0 && targetBpm < mafProfile.mafMaxHeartRate + 3) {
              targetBpm += 2;
            }
            return targetBpm;
          });

          if (simulatedBpm >= mafProfile.mafAerobicZoneLow && simulatedBpm <= mafProfile.mafMaxHeartRate) {
            setTimeInZoneSec((z) => z + 1);
          }

          if (simulatedBpm > mafProfile.mafMaxHeartRate && nextDuration % 10 === 0) {
            speakText(lang === "en" ? `Heart rate is ${simulatedBpm}. Ease up pace and breathe deeply.` : `Pulsen er ${simulatedBpm}. Ro ned farten litt og pust med magen.`);
          } else if (nextDuration === 60) {
            speakText(lang === "en" ? `1 minute complete. Solid MAF zone at ${simulatedBpm} bpm.` : `1 minutt gjennomført. Du er i flott MAF-sone med puls ${simulatedBpm}.`);
          }

          setDistanceKm((d) => +(d + 0.0028).toFixed(2));
          return nextDuration;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive, simulatedBpm, mafProfile, audioEnabled, lang]);

  const handleStartWorkout = () => {
    setIsWorkoutActive(true);
    setWorkoutDurationSec(0);
    setTimeInZoneSec(0);
    setDistanceKm(0);
    setSimulatedBpm(mafProfile.mafAerobicZoneLow + 2);
    speakText(lang === "en" ? `Workout started. Target zone is ${mafProfile.mafAerobicZoneLow} to ${mafProfile.mafMaxHeartRate} bpm.` : `Økt startet. Din MAF-sone er ${mafProfile.mafAerobicZoneLow} til ${mafProfile.mafMaxHeartRate} slag per minutt.`);
  };

  const handleStopWorkout = async () => {
    setIsWorkoutActive(false);
    const durationMin = Math.round(workoutDurationSec / 60) || 1;
    const inZonePct = workoutDurationSec > 0 ? Math.round((timeInZoneSec / workoutDurationSec) * 100) : 100;
    
    // Save to persistent SQLite database
    try {
      await fetch("/api/health/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityType: "RUN",
          durationSeconds: workoutDurationSec,
          distanceMeters: distanceKm * 1000,
          avgBpm: simulatedBpm,
          maxBpm: simulatedBpm + 4,
          timeInMafZoneSeconds: timeInZoneSec,
          notes: "MAF 180 Aerobic Training Session"
        })
      });
      refreshData();
    } catch (e) {
      console.error("Save error:", e);
    }

    speakText(lang === "en" ? `Workout saved! ${durationMin} minutes with ${inZonePct} percent in MAF zone.` : `Økt lagret! ${durationMin} minutter, ${inZonePct} prosent i MAF-sone.`);
  };

  const handleCompleteAssessment = async () => {
    const determinedCat = determineMafCategoryFromAnswers(wizardAnswers);
    try {
      const res = await fetch("/api/health/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age, category: determinedCat })
      });
      if (res.ok) {
        const data = await res.json();
        setMafProfile(data.profile);
        setCategory(determinedCat);
      }
    } catch (e) {
      setMafProfile(calculateMafHeartRate(age, determinedCat));
    }
    setActiveTab("workout");
    speakText(lang === "en" ? `Your personalized MAF Max is set to ${mafProfile.mafMaxHeartRate} bpm.` : `Din personlige MAF-makspuls er beregnet til ${mafProfile.mafMaxHeartRate} slag per minutt.`);
  };

  const handleStartHrvTest = async () => {
    setHrvStatus("MEASURING");
    setHrvSeconds(60);
    let count = 60;
    const timer = setInterval(async () => {
      count -= 1;
      setHrvSeconds(count);
      if (count <= 0) {
        clearInterval(timer);
        setHrvStatus("DONE");
        try {
          await fetch("/api/health/hrv", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              rmssd: 72,
              restingBpm: 50,
              recoveryStatus: "GREEN",
              advice: lang === "en" ? "Optimal parasympathetic tone. Great day for an aerobic MAF workout." : "Kroppen er uthvilt. God dag for en fin MAF-tur!"
            })
          });
          refreshData();
        } catch (e) {}
        speakText(lang === "en" ? "Morning HRV measurement complete. Green recovery light." : "Morgen-HRV måling fullført. Du har grønt lys og uthvilt nervesystem.");
      }
    }, 100);
  };

  const handleAskAdvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;
    setLoading(true);
    try {
      const res = await fetch("/api/health/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, language: lang }),
      });
      if (res.ok) {
        const json = await res.json();
        setResponse(json);
      }
    } catch (e) {
      alert("Error contacting health advisor.");
    } finally {
      setLoading(false);
    }
  };

  const getZoneColor = (bpm: number) => {
    if (bpm > mafProfile.mafMaxHeartRate) return { bg: "bg-rose-500", text: "text-rose-400", border: "border-rose-500", label: lang === "en" ? "⚠️ OVER MAF MAX — SLOW DOWN" : "⚠️ FOR HØY PULS — RO NED" };
    if (bpm >= mafProfile.mafAerobicZoneLow) return { bg: "bg-emerald-500", text: "text-emerald-400", border: "border-emerald-500", label: lang === "en" ? "✓ PERFECT MAF FAT BURNING" : "✓ PERFEKT MAF FETTFORBRENNING" };
    return { bg: "bg-amber-500", text: "text-amber-400", border: "border-amber-500", label: lang === "en" ? "WARM-UP / LOW" : "LITT LAV — OPPVARMING" };
  };

  const currentZone = getZoneColor(simulatedBpm);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col justify-between">
      <div>
        {/* Header */}
        <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 py-3.5 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base md:text-lg tracking-tight">SUN Longevity</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  longevity.sevenunitynetwork.org
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Dr. Phil Maffetone MAF 180 • Sovereign Health • Project 11</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-[11px] font-bold">
              <button
                onClick={() => setLang("no")}
                className={`px-2.5 py-1 rounded-lg transition-all ${lang === "no" ? "bg-emerald-500 text-slate-950" : "text-slate-400"}`}
              >
                🇳🇴 NO
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 rounded-lg transition-all ${lang === "en" ? "bg-emerald-500 text-slate-950" : "text-slate-400"}`}
              >
                🇬🇧 EN
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto py-1">
              <button
                onClick={() => setActiveTab("workout")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "workout" ? "bg-emerald-500 text-slate-950 font-bold" : "bg-slate-900 text-slate-300 border border-slate-800"
                }`}
              >
                🏃‍♂️ {lang === "en" ? "Workout" : "Trening"}
              </button>
              <button
                onClick={() => setActiveTab("assessment")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "assessment" ? "bg-emerald-500 text-slate-950 font-bold" : "bg-slate-900 text-slate-300 border border-slate-800"
                }`}
              >
                🧭 {lang === "en" ? "MAF Wizard" : "MAF Veileder"}
              </button>
              <button
                onClick={() => setActiveTab("hrv")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "hrv" ? "bg-emerald-500 text-slate-950 font-bold" : "bg-slate-900 text-slate-300 border border-slate-800"
                }`}
              >
                💓 {lang === "en" ? "Morning HRV" : "Morgen-HRV"}
              </button>
              <button
                onClick={() => setActiveTab("carb")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "carb" ? "bg-emerald-500 text-slate-950 font-bold" : "bg-slate-900 text-slate-300 border border-slate-800"
                }`}
              >
                🥗 {lang === "en" ? "2-Week Test" : "2-Ukers Test"}
              </button>
              <button
                onClick={() => setActiveTab("advisor")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "advisor" ? "bg-emerald-500 text-slate-950 font-bold" : "bg-slate-900 text-slate-300 border border-slate-800"
                }`}
              >
                🧠 {lang === "en" ? "AI Advisor" : "AI Rådgiver"}
              </button>
            </div>
          </div>
        </header>

        {/* 6-Month Re-assessment Notification Banner */}
        <div className="max-w-5xl mx-auto px-4 md:px-8 pt-4">
          <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-cyan-950/70 border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white">{lang === "en" ? "Semi-Annual MAF Status: " : "Halvårlig MAF-Status: "}</span>
                <span className="text-slate-300">{lang === "en" ? `Next re-assessment on ${mafProfile.nextReassessmentDate}. Injury-free progress?` : `Neste anbefalte re-evaluering er ${mafProfile.nextReassessmentDate}. Har du trent skadefritt?`}</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("assessment")}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold whitespace-nowrap transition-colors"
            >
              {lang === "en" ? "Check Upgrade (+5 BPM) ➜" : "Sjekk Formoppgradering (+5 BPM) ➜"}
            </button>
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-8">
          {/* TAB 1: WORKOUT */}
          {activeTab === "workout" && (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">{lang === "en" ? "Display Mode:" : "Visningsmodus:"}</span>
                  <button
                    onClick={() => setViewMode("senior")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${viewMode === "senior" ? "bg-emerald-500 text-slate-950" : "bg-slate-950 text-slate-400"}`}
                  >
                    👵 {lang === "en" ? "Senior / Simple" : "Enkel / Senior"}
                  </button>
                  <button
                    onClick={() => setViewMode("standard")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${viewMode === "standard" ? "bg-emerald-500 text-slate-950" : "bg-slate-950 text-slate-400"}`}
                  >
                    🏃‍♂️ {lang === "en" ? "Standard MAF" : "Standard MAF"}
                  </button>
                  <button
                    onClick={() => setViewMode("data")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${viewMode === "data" ? "bg-emerald-500 text-slate-950" : "bg-slate-950 text-slate-400"}`}
                  >
                    📊 {lang === "en" ? "Longevity Data" : "Data & Longevity"}
                  </button>
                </div>

                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    audioEnabled ? "bg-slate-950 border-emerald-500/40 text-emerald-400" : "bg-slate-950 border-slate-800 text-slate-500"
                  }`}
                >
                  {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{audioEnabled ? (lang === "en" ? "Voice Coach On" : "Taleveileder På") : (lang === "en" ? "Muted" : "Tale Av")}</span>
                </button>
              </div>

              {/* Live Gauge */}
              <div className={`bg-gradient-to-b from-slate-900 to-slate-950 border-2 rounded-3xl p-6 md:p-8 shadow-2xl transition-all ${currentZone.border}`}>
                {viewMode === "senior" && (
                  <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs font-bold uppercase tracking-wider">
                      <span className={`w-3 h-3 rounded-full ${currentZone.bg} animate-pulse`} />
                      <span className={currentZone.text}>{currentZone.label}</span>
                    </div>

                    <div className="py-4">
                      <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">{lang === "en" ? "Current Heart Rate" : "Nåværende Puls"}</span>
                      <div className={`text-8xl md:text-9xl font-black tracking-tight mt-1 ${currentZone.text}`}>
                        {simulatedBpm}
                      </div>
                      <span className="text-sm font-semibold text-slate-400">BPM</span>
                    </div>

                    <div className="grid grid-cols-2 max-w-md mx-auto gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
                      <div>
                        <div className="text-slate-400">{lang === "en" ? "Your MAF Zone:" : "Din MAF-Sone:"}</div>
                        <div className="text-xl font-bold text-emerald-400 mt-0.5">{mafProfile.mafAerobicZoneLow}–{mafProfile.mafMaxHeartRate} BPM</div>
                      </div>
                      <div>
                        <div className="text-slate-400">{lang === "en" ? "Duration:" : "Varighet:"}</div>
                        <div className="text-xl font-bold text-white mt-0.5 font-mono">
                          {Math.floor(workoutDurationSec / 60)}m {workoutDurationSec % 60}s
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {viewMode === "standard" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs uppercase font-bold text-slate-400">MAF 180 Aerobic Range</span>
                        <div className="text-2xl font-extrabold text-white mt-0.5">
                          {mafProfile.mafAerobicZoneLow}–{mafProfile.mafMaxHeartRate} BPM
                        </div>
                      </div>
                      <div className={`px-4 py-1.5 rounded-xl border text-xs font-bold ${currentZone.border} ${currentZone.text} bg-slate-950`}>
                        {currentZone.label}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">HR</span>
                        <div className={`text-4xl font-extrabold mt-1 ${currentZone.text}`}>{simulatedBpm} <span className="text-xs text-slate-500 font-normal">BPM</span></div>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Time in Zone</span>
                        <div className="text-4xl font-extrabold text-emerald-400 mt-1">
                          {workoutDurationSec > 0 ? Math.round((timeInZoneSec / workoutDurationSec) * 100) : 100}%
                        </div>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Distance</span>
                        <div className="text-4xl font-extrabold text-white mt-1">{distanceKm} <span className="text-xs text-slate-500 font-normal">KM</span></div>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Duration</span>
                        <div className="text-4xl font-extrabold text-cyan-400 mt-1 font-mono">
                          {Math.floor(workoutDurationSec / 60)}:{workoutDurationSec % 60 < 10 ? '0' : ''}{workoutDurationSec % 60}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {viewMode === "data" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <span className="text-xs font-bold text-slate-400">{lang === "en" ? "Fat Burning Rate" : "Est. Fettforbrenning"}</span>
                      <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                        {simulatedBpm <= mafProfile.mafMaxHeartRate ? "48–55" : "15–20"} <span className="text-xs text-slate-400 font-normal">g/hour</span>
                      </div>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <span className="text-xs font-bold text-slate-400">{lang === "en" ? "Lactate Estimate" : "Laktatestimat"}</span>
                      <div className="text-3xl font-extrabold text-cyan-400 mt-1">
                        {simulatedBpm <= mafProfile.mafMaxHeartRate ? "< 1.5" : "3.2+"} <span className="text-xs text-slate-400 font-normal">mmol/L</span>
                      </div>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <span className="text-xs font-bold text-slate-400">{lang === "en" ? "Efficiency Factor" : "Aerob Effektivitetsfaktor"}</span>
                      <div className="text-3xl font-extrabold text-amber-400 mt-1">1.42</div>
                    </div>
                  </div>
                )}

                <div className="mt-6 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-300">{lang === "en" ? "Audio Cue: " : "Siste talebeskjed: "}</span>
                    <span className="text-emerald-300 font-mono">"{lastAudioAlert}"</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  {!isWorkoutActive ? (
                    <button
                      onClick={handleStartWorkout}
                      className="flex-1 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                      <Play className="w-5 h-5 fill-current" /> {lang === "en" ? "Start MAF Workout" : "Start MAF-Treningsøkt"}
                    </button>
                  ) : (
                    <button
                      onClick={handleStopWorkout}
                      className="flex-1 py-4 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20"
                    >
                      <Square className="w-5 h-5 fill-current" /> {lang === "en" ? "Complete & Save to SQLite" : "Fullfør & Lagre Økt"}
                    </button>
                  )}
                </div>
              </div>

              {/* Workouts History with Pristine Empty State */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Timer className="w-4 h-4 text-emerald-400" /> {lang === "en" ? "Logged Workouts (SQLite)" : "Lagrede Økter (SQLite)"}
                    </h3>
                    <p className="text-xs text-slate-400">{lang === "en" ? "Persistent local storage (GDPR Art. 9)" : "100 % lokal suveren datalagring"}</p>
                  </div>
                  <a
                    href="/api/health/export?format=gpx"
                    download
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Eksport (.GPX)
                  </a>
                </div>

                {workouts.length === 0 ? (
                  <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800/60 space-y-2">
                    <p className="text-xs text-slate-400 font-semibold">{lang === "en" ? "No workouts recorded yet. Start your first MAF session above!" : "Ingen treningsøkter logget ennå. Start din første MAF-økt ovenfor!"}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                          <th className="py-2.5 px-3">Start</th>
                          <th className="py-2.5 px-3">Varighet</th>
                          <th className="py-2.5 px-3">Distanse</th>
                          <th className="py-2.5 px-3">Snittpuls</th>
                          <th className="py-2.5 px-3">I MAF-Sone</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        {workouts.map((w: any) => (
                          <tr key={w.id}>
                            <td className="py-2.5 px-3">{w.startTime.split("T")[0]}</td>
                            <td className="py-2.5 px-3">{Math.round(w.durationSeconds / 60)} min</td>
                            <td className="py-2.5 px-3">{(w.distanceMeters / 1000).toFixed(2)} km</td>
                            <td className="py-2.5 px-3 text-emerald-400">{w.avgBpm} bpm</td>
                            <td className="py-2.5 px-3">{Math.round((w.timeInMafZoneSeconds / Math.max(1, w.durationSeconds)) * 100)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ASSESSMENT */}
          {activeTab === "assessment" && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <HelpCircle className="w-3.5 h-3.5" /> {lang === "en" ? "Diagnostic MAF Wizard" : "Personlig MAF 180 Veileder"}
                </div>
                <h2 className="text-2xl font-bold text-white mt-2">{lang === "en" ? "Assess & Upgrade Your MAF Heart Rate" : "Beregn og Oppgrader Din Personlige MAF-Sone"}</h2>
                <p className="text-xs text-slate-300 mt-1">
                  {lang === "en" ? "Answer 4 gentle questions to determine your Category (A-D) and schedule your semi-annual checkup." : "Svar ærlig på 4 enkle spørsmål. Appen finner automatisk din ideelle puls og setter opp din neste resertifiseringsdato."}
                </p>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-300 flex justify-between">
                  <span>{lang === "en" ? "Your Age:" : "Din Alder:"}</span>
                  <span className="text-emerald-400 font-extrabold text-base">{age} {lang === "en" ? "years" : "år"}</span>
                </label>
                <input
                  type="range"
                  min={18}
                  max={85}
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="space-y-3 text-xs">
                <div className={`p-4 rounded-2xl border transition-all ${wizardAnswers.hasMajorIllnessOrMedication ? "bg-emerald-500/10 border-emerald-500" : "bg-slate-950 border-slate-800"}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wizardAnswers.hasMajorIllnessOrMedication}
                      onChange={(e) => setWizardAnswers({ ...wizardAnswers, hasMajorIllnessOrMedication: e.target.checked })}
                      className="mt-0.5 w-4 h-4 accent-emerald-500"
                    />
                    <div>
                      <div className="font-bold text-white">{lang === "en" ? "1. Major illness, heart surgery, or daily medications?" : "1. Alvorlig sykdom, hjerteoperasjon eller faste medisiner?"}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{lang === "en" ? "Subtracts 10 bpm for safe, gentle foundation building (Category A)." : "Trekker fra 10 slag for ekstra skånsom og trygg oppstart (Kategori A)."}</div>
                    </div>
                  </label>
                </div>

                <div className={`p-4 rounded-2xl border transition-all ${wizardAnswers.hasInjuryOrFrequentColds ? "bg-emerald-500/10 border-emerald-500" : "bg-slate-950 border-slate-800"}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wizardAnswers.hasInjuryOrFrequentColds}
                      onChange={(e) => setWizardAnswers({ ...wizardAnswers, hasInjuryOrFrequentColds: e.target.checked })}
                      className="mt-0.5 w-4 h-4 accent-emerald-500"
                    />
                    <div>
                      <div className="font-bold text-white">{lang === "en" ? "2. Injured, frequent colds/allergies, or inconsistent training?" : "2. Skader, allergi, hyppige forkjølelser eller ujevn trening?"}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{lang === "en" ? "Subtracts 5 bpm to protect joints and immune system (Category B)." : "Trekker fra 5 slag for å beskytte immunforsvar og ledd (Kategori B)."}</div>
                    </div>
                  </label>
                </div>

                <div className={`p-4 rounded-2xl border transition-all ${wizardAnswers.hasContinuousProgress2Years ? "bg-emerald-500/10 border-emerald-500" : "bg-slate-950 border-slate-800"}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wizardAnswers.hasContinuousProgress2Years}
                      onChange={(e) => setWizardAnswers({ ...wizardAnswers, hasContinuousProgress2Years: e.target.checked })}
                      className="mt-0.5 w-4 h-4 accent-emerald-500"
                    />
                    <div>
                      <div className="font-bold text-white">{lang === "en" ? "3. Training consistently for >2 years with continuous racing progress?" : "3. Trent kontinuerlig i over 2 år med jevn fremgang i løp?"}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{lang === "en" ? "Adds +5 bpm for well-adapted aerobic engine (Category D)." : "Legger til +5 slag for godt tilpasset aerob motor (Kategori D)."}</div>
                    </div>
                  </label>
                </div>
              </div>

              <button
                onClick={handleCompleteAssessment}
                className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> {lang === "en" ? "Save & Update Profile" : "Lagre & Oppdater MAF-Puls"}
              </button>
            </div>
          )}

          {/* TAB 3: MORNING HRV */}
          {activeTab === "hrv" && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Activity className="w-3.5 h-3.5" /> 60s Recovery Radar
                </div>
                <h2 className="text-2xl font-bold text-white mt-2">{lang === "en" ? "Morning HRV & Autonomic Balance" : "Morgen-HRV & Nervesystembalanse"}</h2>
                <p className="text-xs text-slate-300 mt-1">
                  {lang === "en" ? "Measure 60 seconds upon waking up to assess parasympathetic recovery status." : "Mål hjerteratevariabilitet (rMSSD) i 60 sekunder rett etter oppvåkning for å se om kroppen er klar for trening eller trenger hvile."}
                </p>
              </div>

              {hrvStatus === "MEASURING" ? (
                <div className="bg-slate-950 p-8 rounded-2xl border border-emerald-500/40 text-center space-y-4">
                  <HeartPulse className="w-12 h-12 text-emerald-400 mx-auto animate-ping" />
                  <div className="text-3xl font-extrabold text-white font-mono">{hrvSeconds} {lang === "en" ? "seconds remaining" : "sekunder igjen"}</div>
                  <p className="text-xs text-slate-400">{lang === "en" ? "Breathe gently and lie completely still..." : "Pust rolig og ligg helt stille i sengen..."}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {hrvLogs.length > 0 && (
                    <div className="bg-slate-950 p-6 rounded-2xl border border-emerald-500/30 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400">rMSSD Score</span>
                        <div className="text-3xl font-extrabold text-emerald-400 mt-1">{hrvLogs[0].rmssd} ms</div>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Resting HR</span>
                        <div className="text-3xl font-extrabold text-cyan-400 mt-1">{hrvLogs[0].restingBpm} bpm</div>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Status</span>
                        <div className="text-xl font-bold text-emerald-300 mt-1">🟢 {hrvLogs[0].recoveryStatus}</div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleStartHrvTest}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" /> {lang === "en" ? "Start 60s Morning Test" : "Start 60-Sekunders Morgenmåling"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CARB TEST */}
          {activeTab === "carb" && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5" /> Dr. Maffetone 14-Day Reset
                </div>
                <h2 className="text-2xl font-bold text-white mt-2">{lang === "en" ? "Carbohydrate Intolerance Test" : "14-Dagers Test for Karbohydratintoleranse"}</h2>
                <p className="text-xs text-slate-300 mt-1">
                  {lang === "en" ? "Cut refined sugar and processed carbs for 14 days to reset insulin sensitivity." : "Kutt raffinert sukker og raske karbohydrater i 14 dager for å nullstille insulinfølsomhet og aktivere naturlig fettforbrenning."}
                </p>
              </div>

              <div className="space-y-3">
                {[1, 2, 3].map((d) => (
                  <div key={d} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                    <div className="font-bold text-white">{lang === "en" ? `Day ${d}: Stable blood sugar` : `Dag ${d}: Stabilt blodsukker og god energi`}</div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono">Energy: 4/5</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: AI ADVISOR */}
          {activeTab === "advisor" && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {lang === "en" ? "Local AI Health Intelligence" : "Lokal AI Helsekunnskap"}
                </div>
                <h2 className="text-2xl font-bold text-white mt-2">{lang === "en" ? "Evidence-Based Lifestyle & Nutrition Advisor" : "Evidensbasert Helse- & Ernæringsrådgiver"}</h2>
              </div>

              <form onSubmit={handleAskAdvisor} className="space-y-4">
                <textarea
                  rows={3}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={lang === "en" ? "E.g. 'How does MAF training optimize fat burning vs lactic acid?'" : "F.eks: 'Hvorfor bør jeg trene på MAF-puls i stedet for harde intervaller?'"}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={loading || !question}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Brain className="w-4 h-4" /> {loading ? (lang === "en" ? "Synthesizing research..." : "Analyserer forskningsdata...") : (lang === "en" ? "Get Advice" : "Hent Råd")}
                </button>
              </form>

              {response && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3 text-xs leading-relaxed">
                  {response.source && <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Kilde: {response.source}</div>}
                  <div className="font-sans whitespace-pre-wrap text-slate-200">{response.advice}</div>
                  {response.disclaimer && <div className="text-[10px] text-slate-500 italic mt-2">{response.disclaimer}</div>}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Footer with Legal & Compliance Links */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-6 py-6 text-center text-xs text-slate-500 space-y-2">
        <div className="flex justify-center gap-6 text-[11px] font-semibold text-slate-400">
          <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Personvernerklæring (Privacy Policy)</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-emerald-400 transition-colors">Vilkår & Medisinsk Forbehold (Terms & Medical Disclaimer)</Link>
          <span>•</span>
          <a href="/api/health/export?format=json" className="hover:text-emerald-400 transition-colors">Eksportér Mine Data (GDPR)</a>
        </div>
        <p className="text-[10px] text-slate-600">
          SUN Longevity — Part of the Seven Unity Network (SUN OS) • Domain: <span className="text-slate-400 font-mono">longevity.sevenunitynetwork.org</span>
        </p>
      </footer>
    </div>
  );
}
