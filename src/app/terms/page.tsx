import Link from "next/link";
import { AlertTriangle, ArrowLeft, ShieldAlert } from "lucide-react";

export default function TermsAndMedicalDisclaimerPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 selection:bg-emerald-500 selection:text-slate-950">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300">
          <ArrowLeft className="w-4 h-4" /> Tilbake til Dashboard
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Vilkår & Medisinsk Forbehold</h1>
            <p className="text-xs text-slate-400 font-mono">End User License Agreement (EULA) & Medical Disclosure</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 text-xs text-slate-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-rose-400">
              <AlertTriangle className="w-4 h-4" /> Viktig Medisinsk Ansvarsfraskrivelse
            </div>
            <p>
              SUN Longevity er et pedagogisk verktøy for aerob trening (Dr. Phil Maffetones MAF 180-metode), hjertefrekvensovervåking og livsstilsveiledning. 
              **Appen verken stiller diagnoser, foreskriver medisiner eller erstatter profesjonell medisinsk rådgivning eller behandling fra autorisert lege/kardiolog.**
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider">1. Akutte Symptomer og Nødsituasjoner</h2>
            <p>
              Dersom du opplever brystsmerter, uvanlig hjertebank, svimmelhet, akutt åndenød eller kraftig ubehag under trening, skal du umiddelbart **avbryte treningen og ringe Nødnummer 113 eller legevakt 116 117**.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider">2. Eget Ansvar ved Fysisk Aktivitet</h2>
            <p>
              All fysisk trening og kostholdsendringer utføres på eget ansvar. Dersom du har kjent hjertesykdom, høyt blodtrykk eller nylig har gjennomgått operasjoner, bør du konsultere din fastlege før oppstart av treningsprogrammer.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider">3. Lisens og Bruksrett</h2>
            <p>
              Appen leveres under SUN Community Source License. Programvaren leveres «som den er» uten garantier for uavbrutt eller feilfri drift.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
