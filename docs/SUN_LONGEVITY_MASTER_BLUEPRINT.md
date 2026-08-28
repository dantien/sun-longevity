# 🏃‍♂️ SUN Longevity — Master Arkitektur-, UX- og Utviklingsplan
**Prosjekt:** `11_sun_helse` / SUN Longevity  
**Målgruppe:** Universell tilgjengelighet for alle mennesker – med spesiell tilrettelegging for seniorer, hjerterehab, overtrente og nybegynnere.  
**Plattform:** React Native (Expo) for iOS & Android + Next.js Web Dashboard.  
**Status:** Endelig godkjent arkitektur- og implementasjonsplan v2.1.

---

## 🎯 1. Brukerinnsikt & Empatisk Design: De som virkelig trenger appen

For at appen skal kunne brukes av **alle typer mennesker**, må designet ta utgangspunkt i de som har de største barrierene:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                          4 KJERNEPERSONAS & BEHOV                             │
├──────────────────────────────────────┬────────────────────────────────────────┤
│ 👵 KARI (68) — Hjerterehab & Senior  │ 🏃‍♂️ JONAS (43) — Overtrent & Stresset   │
│ • Angst for at pulsen blir for høy.  │ • Kronisk høyt kortisol, stagnerer.    │
│ • Skjønner ikke Bluetooth-menyer.    │ • Må temmes: Trenger bevis på at rolig │
│ • Behov: Gigantiske tall, grønn/rød  │   trening gir høyere fart over tid.    │
│   farge, beroligende norsk stemme.   │ • Behov: Morgen-HRV & MAF-test tempo.  │
├──────────────────────────────────────┼────────────────────────────────────────┤
│ 🚶‍♀️ FATIMA (36) — Livsstilsendring    │ 👁️ ARNE (74) — Svaksynt / Hørselshemmet│
│ • Overvekt, leddsmerter, sukkersug.  │ • Ser dårlig på mobilskjerm i sollys.  │
│ • Føler seg utilpass på treningsrom. │ • Behov: WCAG AAA-kontrast, haptiske   │
│ • Behov: Gå- og sykkeltilpasning,    │   vibrasjoner i lomma (1, 2, 3 pulser),│
│   2-ukers kostholdstest uten skam.   │   ekstremt store tall, skjermleser.    │
└──────────────────────────────────────┴────────────────────────────────────────┘
```

---

## 🧭 2. Personlig MAF Onboarding-Veileder & 3–6 Måneders Resertifisering

### 2.1 Trinn-for-Trinn Diagnostisk Veileder (Zero Confusion Onboarding)
I stedet for at brukeren må forstå matematiske formler eller vurdere abstrakte kategorier (A–D), leder appen brukeren gjennom **4 vennlige, menneskelige ja/nei-spørsmål**:
1. *«Har du nylig hatt alvorlig sykdom, hjerteoperasjon eller bruker faste medisiner?»* ➜ **Kategori A (`-10 bpm`)**
2. *«Har du hatt skader, astma/allergi, mer enn to forkjølelser i året eller trent uregelmessig?»* ➜ **Kategori B (`-5 bpm`)**
3. *«Har du trent jevnt og trutt i inntil 2 år uten store skader eller avbrudd?»* ➜ **Kategori C (`0 bpm` — Standard)**
4. *«Har du trent kontinuerlig i over 2 år og opplevd jevn fremgang i konkurranser/løp uten skader?»* ➜ **Kategori D (`+5 bpm`)**

Appen presenterer umiddelbart resultatet:
> **🎉 Din personlige MAF-makspuls er beregnet til 131 BPM.**  
> **Din optimale fettforbrenningssone er 121–131 BPM.**

---

### 2.2 Automatisk 3–6 Måneders Re-evaluering & Formoppgradering
Dr. Phil Maffetones metode bygger på at kroppen tilpasser seg over tid. Dette gjør re-evaluering til en av appens **viktigste motivasjonsdrivere**:

1. **Intelligent Tidsplan for Påminnelse:**
   * **Kategori A & B (Rekonvalesens / Skade):** Påminnelse etter **3 måneder** (fordi skadefri opptrening raskt gjør at man kan oppgraderes til Kategori C).
   * **Kategori C & D (Stabile mosjonister):** Påminnelse etter **6 måneder** (eller ved bursdag/alder).
2. **Motiverende Push-varsel:**
   * *«🎉 Gratulerer med 6 måneders jevn trening! La oss ta en 60-sekunders sjekk for å se om din MAF-puls kan justeres opp.»*
3. **Formoppgradering i Praksis (+5 til +10 BPM):**
   * En bruker som startet i Kategori B med MAF Max 126 bpm og som har vært skadefri i 3–6 måneder, oppgraderes automatisk til Kategori C (131 bpm).
   * Brukeren feires i appen med en visuell oppgraderingsplakett: *"Du har bygget en sterkere aerob motor! Du kan nå trene på 131 BPM med høyere hastighet og brenne fett like effektivt."*

---

## 🏛️ 3. Arkitektoniske Beslutninger

### 3.1 Rammeverk & Teknologistack
* **Kjernemobilapp:** **React Native (med Expo SDK & EAS)**.
  * *Hvorfor:* Ekte native bakgrunnstråder for Bluetooth LE (1 Hz), native Audio Ducking, bakgrunns-GPS og HealthKit/Health Connect.
* **Lokal Database:** **SQLite (Offline-First)**.
  * Full funksjonalitet i skog og mark uten internett. Data synkroniseres asynkront mot medlemmets lokale SUN Node via Autonomina ID.
* **Standard Sportsformater:**
  * Innebygd eksport til `.FIT` og `.GPX` slik at brukere eier egne treningsdata og kan dele med Strava, TrainingPeaks eller fastlege.

---

## 📱 4. Brukeropplevelse (UX) & Universell Utforming

### 4.1 "Ett-Trykks" Hurtigstart (Zero-Friction Onboarding)
1. **Automatisk Bluetooth-paring:**
   * Når appen åpnes og treningsskjermen vises, søker den automatisk etter standard BLE-pulssensorer (`0x180D`).
2. **3 Valgfrie Visningsmoduser:**
   * **Enkel / Senior Modus (Standard):**
     * Gigantisk pulsvisning (72pt tall).
     * Tydelig fargering: **Grønn** = *"Perfekt sone"*, **Gul** = *"Litt lav"*, **Rød** = *"Ro ned / Ta pause"*.
   * **Klassisk MAF Modus:**
     * Puls, nøyaktig avvik fra MAF Max, tempo (min/km), distanse, tid i MAF-sone (%).
   * **Longevity & Analyse Modus:**
     * Sanntids fettforbrenningsrate (gram/time estimat), aerob indeks, HRV-sanntids trend.

---

## 🎙️ 5. Sanntids Lyd- & Haptisk Coaching (Audio Ducking)

### 5.1 Taleveiledning på Norsk & Audio Ducking
* **Ved overskridelse av MAF Max:** *"Pulsen er 134. Ro ned farten litt og pust rolig."*
* **I sonen (hvert 10. minutt):** *"Du har vært i perfekt MAF-sone i 20 minutter. Gjennomsnittspuls 128."*
* **Audio Ducking:** Musikk fra Spotify eller podcaster dempes automatisk med **70 %** under stemmebeskjeden og fader mykt tilbake.
* **Haptisk Tilbakemelding:** 1 vibrasjon = For lav, 2 vibrasjoner = I sonen, 3 kraftige vibrasjoner = For høy puls.

---

## 💓 6. Sensor- & Maskinvarestøtte

* **Bluetooth Low Energy (BLE):** Standard GATT `0x180D` (Polar H10/H9, Garmin HRM-Pro, Wahoo TICKR, Suunto, CooSpo).
* **Smartklokker:** Apple Watch (HealthKit) & Wear OS (Google Health Connect).
* **Skyimport:** Garmin Connect API & Strava Webhook Sync.

---

## 🌿 7. Longevity-Pilarer i Appen

1. **60-Sekunders Morgen-HRV:** Måler rMSSD for dagsfersk restitusjonsstatus (Grønt = Klar, Gult = Skånsom, Rødt = Hviledag).
2. **Dr. Maffetones 2-Ukers Kostholdstest:** 14-dagers evaluering av karbohydratintoleranse uten kaloritelling.
3. **Månedlig MAF-Test Progresjonskurve:** Dokumenterer hvordan tempoet øker ved identisk lav puls.

---

## 🚀 8. Lanseringsveikart for Google Play & Apple App Store

| Fase | Milepæl | Nøkkelaktiviteter |
| :--- | :--- | :--- |
| **Fase 1: Prosjektoppsett** | Expo / React Native Core | Initialisere `projects/11_sun_helse/mobile`, konfigurere TypeScript, Tailwind (NativeWind) og SQLite. |
| **Fase 2: Onboarding & BLE** | Veileder & Sensor-paring | Bygge den 4-spørsmåls MAF-veilederen, 3/6 mnd resertifiseringsmodulen og Bluetooth GATT-driveren. |
| **Fase 3: Løpemotor & Audio** | Sanntids MAF Coaching | Bygge bakgrunns-GPS, Audio Ducking, haptikk og 3 visningsmoduser (Senior, Standard, Data). |
| **Fase 4: Longevity-moduler** | HRV, MAF-test & Kost | Implementere 60s morgen-HRV, månedlig test-tracker og 2-ukers kostholdsmodul. |
| **Fase 5: Store Compliance** | Google Play & App Store | Klargjøre `Info.plist`, `AndroidManifest.xml`, Privacy Policy (GDPR Art. 9), Medical Disclaimer og TestFlight / Play Console Internal Track. |
