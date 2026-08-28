import Link from "next/link";
import { ShieldCheck, Lock, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 selection:bg-emerald-500 selection:text-slate-950">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300">
          <ArrowLeft className="w-4 h-4" /> Tilbake til Dashboard
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Personvernerklæring (Privacy Policy)</h1>
            <p className="text-xs text-slate-400 font-mono">SUN Longevity • GDPR Art. 9 Sovereign Health Shield</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">1. Vårt Grunnleggende Personvernprinsipp</h2>
            <p>
              SUN Longevity (drevet av Seven Unity Network / SUN OS) er bygget etter prinsippet om **100 % lokal datasuverenitet**. 
              Dine personlige helsedata, pulsmålinger, hjerteratevariabilitet (HRV) og treningsøkter tilhører deg alene.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">2. Særlige Kategorier av Personopplysninger (GDPR Art. 9)</h2>
            <p>
              Helse- og treningsdata regnes som særlige kategorier av personopplysninger under EUs personvernforordning (GDPR). 
              SUN Longevity lagrer alle opplysninger lokalt på din enhet i en isolert SQLite-database. Ingen helsedata selges, spores eller deles med kommersielle tredjepartsannonsører.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">3. Bruk av Bluetooth & Posisjonsdata (GPS)</h2>
            <p>
              * **Bluetooth Low Energy (BLE):** Brukes utelukkende for å motta sanntids hjertefrekvensdata fra ditt personlige pulsbelte (GATT 0x180D) eller smartklokke under aktive treningsøkter.
              * **GPS & Posisjon:** Brukes under treningsøkter for å beregne tempo (min/km), tilbakelagt distanse og høydeprofil.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">4. Innsyn, Eksport og Sletting</h2>
            <p>
              Du har når som helst rett til fullt innsyn i, eksport av (.FIT / .GPX / JSON) eller fullstendig sletting av dine lagrede data. 
              Sletting i appen fjerner dataene permanent fra enheten uten gjenværende sky-kopier.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">5. Kontakt</h2>
            <p>
              Henvendelser vedrørende personvern kan rettes til: <span className="font-mono text-emerald-400">privacy@sevenunitynetwork.org</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
