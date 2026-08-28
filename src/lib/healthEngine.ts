/**
 * SUN Autonomous Health Engine
 * Manages medical appointments (BUP, GP, Dentists), prescription renewals,
 * and encrypted symptom logging.
 */

export interface MedicalAppointment {
  id: string;
  patientName: string; // E.g. Terje or Daughter
  clinicName: string;  // E.g. BUP, Fastlege
  appointmentDate: string; // ISO 8601
  notes?: string;
  category: "BUP" | "FASTLEGE" | "TANNLEGE" | "SYKEHUS" | "ANNET";
}

export interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  renewByDate: string;
  status: "ACTIVE" | "RENEWAL_NEEDED" | "EXPIRED";
}

const APPOINTMENT_STORE: MedicalAppointment[] = [
  {
    id: "app_1",
    patientName: "Datter",
    clinicName: "BUP",
    appointmentDate: "2026-08-11T09:00:00+02:00",
    notes: "Avtale med datter på BUP",
    category: "BUP",
  },
];

export function addMedicalAppointment(appointment: Omit<MedicalAppointment, "id">): MedicalAppointment {
  const newApp: MedicalAppointment = {
    ...appointment,
    id: `app_${Date.now()}`,
  };
  APPOINTMENT_STORE.push(newApp);
  return newApp;
}

export function getMedicalAppointments(): MedicalAppointment[] {
  return APPOINTMENT_STORE;
}
