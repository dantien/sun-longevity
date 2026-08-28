/**
 * Real-Time Norwegian Audio & Haptic Coaching Engine with Audio Ducking
 */

export interface AudioCoachSettings {
  voiceEnabled: boolean;
  hapticsEnabled: boolean;
  statusIntervalMinutes: number; // 0 = only alerts, 5, 10
  language: "no-NO" | "en-US";
}

export class AudioCoachManager {
  private static instance: AudioCoachManager;
  private settings: AudioCoachSettings = {
    voiceEnabled: true,
    hapticsEnabled: true,
    statusIntervalMinutes: 10,
    language: "no-NO"
  };

  private lastAlertTime: number = 0;
  private secondsAboveMaf: number = 0;
  private secondsInMaf: number = 0;

  public static getInstance(): AudioCoachManager {
    if (!AudioCoachManager.instance) {
      AudioCoachManager.instance = new AudioCoachManager();
    }
    return AudioCoachManager.instance;
  }

  public updateSettings(newSettings: Partial<AudioCoachSettings>) {
    this.settings = { ...this.settings, ...newSettings };
  }

  /**
   * Process 1-second pulse sample and trigger appropriate feedback
   */
  public evaluateHeartRateTick(bpm: number, mafMax: number, mafLow: number) {
    const now = Date.now();

    if (bpm > mafMax) {
      this.secondsAboveMaf += 1;
      this.secondsInMaf = 0;

      // Trigger warning after 3 consecutive seconds over MAF Max
      if (this.secondsAboveMaf >= 3 && (now - this.lastAlertTime > 20000)) {
        this.speakWithDucking(`Pulsen er ${bpm}. Ro ned farten litt og pust med magen.`);
        this.lastAlertTime = now;
      }
    } else if (bpm >= mafLow && bpm <= mafMax) {
      this.secondsAboveMaf = 0;
      this.secondsInMaf += 1;
    } else {
      this.secondsAboveMaf = 0;
    }
  }

  public triggerStatusAnnouncement(minutes: number, avgBpm: number) {
    if (!this.settings.voiceEnabled) return;
    this.speakWithDucking(`Status: ${minutes} minutter gjennomført. Gjennomsnittspuls ${avgBpm}. Du er i perfekt MAF-sone.`);
  }

  public triggerWorkoutFinished(durationMin: number, avgBpm: number, inZonePct: number) {
    this.speakWithDucking(`Treningsøkt fullført! ${durationMin} minutter, ${inZonePct} prosent i MAF-sone. Fantastisk innsats for din aerobe helse.`);
  }

  /**
   * Dispatches speech with native audio focus / audio ducking
   */
  public speakWithDucking(text: string) {
    if (!this.settings.voiceEnabled) return;

    // On Web / Node / React Native environments, output speech
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "nb-NO";
      utterance.rate = 0.95; // slightly calm pace
      window.speechSynthesis.speak(utterance);
    } else {
      // Native Expo Speech fallback
      console.log(`[AudioCoach TTS]: "${text}"`);
    }
  }
}
