# 🏃‍♂️ SUN Longevity — Aerobic Base Engine & Preventive Health (MAF 180)

**SUN Longevity** (Prosjekt 11 i SUN OS) er den offisielle helse-, trenings- og livsforlengelsesmotoren bygget på **Dr. Phil Maffetones MAF 180-metode** for maksimal fettforbrenning, skadeforebygging og aerob kapasitet.

Utviklet med **universell utforming (WCAG AAA)** for å være like enkel og trygg å bruke for seniorer og hjerterehab-pasienter som for erfarne mosjonister.

---

## ✨ Hovedfunksjoner

1. **💓 MAF 180 Hjertefrekvens-motor & Sanntids BLE:**
   * Automatisk paring med standard Bluetooth-pulsbelter (Polar, Garmin, Wahoo, CooSpo) via GATT `0x180D`.
   * Integrasjon mot Apple Watch (HealthKit) og Google Health Connect.

2. **🎙️ Norsk Taleveiledning & Audio Ducking:**
   * Sanntids stemmeveiledning i øret som automatisk demper musikk/podcaster med 70 % ved varsel.
   * Haptisk tilbakemelding (vibrasjonskoder) for stillhet eller hørselshemmede.

3. **⏱️ Månedlig MAF-Test Tracker:**
   * Loggfør standardiserte testløp og sykkeløkter på MAF-puls.
   * Sporer automatisk tempo (`min/km`) og viser aerob fremgang over tid.
   * Eksport og import av standard `.FIT` og `.GPX`-treningsfiler.

4. **💓 60-Sekunders Morgen-HRV:**
   * Rask måling av rMSSD for dagsfersk restitusjonsstatus (Grønt = Klar, Gult = Skånsom, Rødt = Hviledag).

5. **🥗 Maffetone Kostholds- og Restitusjonsveileder:**
   * To-ukers testen for karbohydratintoleranse og fettadaptasjon.
   * Evidensbasert veiledning for søvnkvalitet, døgnrytme og næringstetthet.

6. **🔒 100 % Suverent & Lokalt (GDPR Art. 9):**
   * Alle helsedata lagres 100 % lokalt i SQLite uten skysporing.

---

## 🏛️ Arkitektur & Dokumentasjon
* 📖 **Master Blueprint:** [`docs/SUN_LONGEVITY_MASTER_BLUEPRINT.md`](docs/SUN_LONGEVITY_MASTER_BLUEPRINT.md)
* 📜 **SSOT:** [`SSOT_SUN_HELSE.md`](SSOT_SUN_HELSE.md)

## 🚀 Kjøring (Web Dashboard)
```bash
npm run build
pm2 start ecosystem.config.cjs
```
Port: `http://localhost:3011`
