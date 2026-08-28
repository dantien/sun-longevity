# 🏥 SSOT: SUN Longevity & Autonomous Health Agent (Single Source of Truth v2.1 Master Edition)
**Prosjekt 11:** MAF 180 Aerobic Engine, Real-Time BLE Heart Rate Coaching, Guided Onboarding & 3-6 Month Re-assessment, Morning HRV, 2-Week Sugar/Carb Test & Encrypted Health Journal  
**Plassering i SUN_OS:** `/home/terjep/SUN_OS/projects/11_sun_helse/`  
**Web Port:** `http://127.0.0.1:3011`  
**Mobil App:** React Native (Expo) med BLE GATT 0x180D, Native Audio Ducking & SQLite Offline-First  
**Status:** Master Blueprint & Arkitektur v2.1 Låst og Godkjent for Produksjon  

---

## 🎯 1. Visjon & Kjerneprinsipp

`11_sun_helse` (SUN Longevity) er den **suverene, evidensbaserte helse-, trenings- og livsforlengelsesmotoren** for alle mennesker i SUN-økosystemet. Den er spesifikt designet med **universell utforming (WCAG AAA)** for å fjerne enhver teknologisk barriere for seniorer, hjerterehab-pasienter, overtrente og nybegynnere.

---

## 💡 2. Hovedmoduler & Arkitektur

1. **🧭 MAF 180 Onboarding-veileder & 3–6 Måneders Resertifisering:**
   * **4 Enkle Spørsmål:** Beregner nøyaktig MAF-makspuls uten kompliserte formler.
   * **Automatiske Påminnelser:** 3 måneder (for skadde/rekonvalesenter) og 6 måneder (for etablerte løpere).
   * **Formoppgradering (+5 til +10 BPM):** Automatisk forslag om oppgradering av treningspuls ved skadefri fremgang.
2. **🏃‍♂️ MAF 180 Sanntids Treningsmotor:**
   * **Maskinvare:** Ekte Bluetooth LE GATT `0x180D` (Polar, Garmin, Wahoo, CooSpo) + Apple Watch (HealthKit) / Wear OS.
   * **Sanntids Taleveiledning:** Norsk tale med **Audio Ducking** (70 % demping av musikk/podcaster).
   * **Haptikk:** 1, 2 og 3 distinkte vibrasjoner for fult tilgjengelig veiledning uten lyd.
3. **📈 Månedlig MAF-Test & Aerob Fartskurve:**
   * Sporing av min/km-tempo ved identisk lav puls over måneder for å dokumentere aerob kapasitet og fettforbrenning.
   * Standard eksport/import via `.FIT` og `.GPX`.
4. **💓 60-Sekunders Morgen-HRV (Restitusjons-radar):**
   * Måling av rMSSD for å kartlegge balansen i det autonome nervesystemet og gi fargekodet dagsanbefaling (Grønt = Klar for tur, Gult = Skånsom, Rødt = Hvile).
5. **🥗 Dr. Maffetones 2-Ukers Kostholdstest:**
   * 14-dagers evaluering av karbohydratintoleranse med registrering av sukkersug, energi og søvn.
6. **🧠 AI Evidensbasert Livsstilsrådgiver (`/api/health/advisor`):**
   * Råd for ernæring, døgnrytme og søvn basert på NNR og vitenskapelige studier med automatisk akuttmedisinsk nødavskjæring (113).
7. **🔒 100 % Suverent Personvern (GDPR Art. 9 Encryption Shield):**
   * Alle helsedata lagres lokalt i medlemmets isolerte SQLite-database og synkroniseres til egen SUN Community Node.

---

## 📱 3. Tilgjengelighetsmoduser (Universell Utforming)
* **Enkel / Senior Modus:** Gigantiske 72pt tall, grønn/gul/rød fargekoding + formikoner, ett-trykks start.
* **Klassisk MAF Modus:** Puls, avvik, tempo, distanse og tid i sone.
* **Longevity & Analyse Modus:** Sanntids fettforbrenningsrate og aerob indeks.
