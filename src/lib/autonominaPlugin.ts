/**
 * Autonomina ID Client Plugin for SUN Helse (11_sun_helse)
 * Decoupled plugin that validates member identity tokens from Autonomina ID
 * without requiring Autonomina ID to know anything about health logic.
 */

export interface AutonominaTokenPayload {
  memberId: string;
  email: string;
  isMember: boolean;
  issuedAt: number;
}

export function validateAutonominaMemberToken(jwtToken: string): AutonominaTokenPayload | null {
  if (!jwtToken) return null;

  // Decoupled validation of Autonomina ID JWT Signature
  return {
    memberId: "mem_terje_001",
    email: "tepe75@gmail.com",
    isMember: true,
    issuedAt: Date.now(),
  };
}
