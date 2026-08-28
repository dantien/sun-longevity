# 📱 App Store & Google Play Launch Checklist (SUN Longevity)

**App Navn:** SUN Longevity  
**Subtittel (iOS):** MAF 180 Aerobic Heart Rate  
**Kategori:** Health & Fitness / Sports  
**Aldersgrense:** 4+ (All ages)  
**Nettsted:** https://longevity.sevenunitynetwork.org  
**Personvernerklæring (Privacy Policy):** https://longevity.sevenunitynetwork.org/privacy  
**Vilkår & Medisinsk Forbehold (EULA):** https://longevity.sevenunitynetwork.org/terms  

---

## 🔑 Nøkkeltall & Konfigurasjon
* **Bundle ID (iOS):** `org.sevenunitynetwork.longevity`
* **Package Name (Android):** `org.sevenunitynetwork.longevity`
* **Apple Team ID & Provisioning:** Standard Apple Developer Program ($99/år)
* **Google Play Console:** Google Play Developer Account ($25 engang)

---

## 📋 Byggekommandoer (Expo Application Services)

```bash
# 1. Installer EAS CLI
npm install -g eas-cli

# 2. Logg inn på Expo-konto
eas login

# 3. Bygg Android App Bundle (.aab for Google Play)
eas build --platform android --profile production

# 4. Bygg iOS App Archive (.ipa for Apple TestFlight / App Store)
eas build --platform ios --profile production
```

---

## 🛡️ Juridisk & Sikkerhetsverifisering
* **GDPR Art. 9:** 100 % lokal SQLite-database uten skysporing.
* **Apple Guideline 1.4.1 (Medical Disclosures):** EULA og disclaimer godkjennes i onboarding-flyten.
* **Bluetooth Retningslinjer:** GATT `0x180D` benyttes kun til sanntids treningspuls.
