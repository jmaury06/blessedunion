/**
 * Utility functions for the raffle app
 */

/**
 * Formatea un número a string con ceros a la izquierda (000-999)
 */
export function formatRaffleNumber(num: number): string {
  return num.toString().padStart(3, "0");
}

/**
 * Genera array de números de rifa (000-999)
 */
export function generateRaffleNumbers(): string[] {
  return Array.from({ length: 1000 }, (_, i) => formatRaffleNumber(i));
}

/**
 * Valida si un token tiene el formato correcto
 */
export function isValidToken(token: string): boolean {
  return /^[a-f0-9]{12}$/.test(token);
}

/**
 * Formatea una fecha de expiración de forma legible
 */
export function formatExpirationTime(expiresAt: string): string {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();

  if (diff <= 0) return "Expirado";

  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  if (minutes > 0) {
    return `${minutes}m ${seconds}s restantes`;
  }
  return `${seconds}s restantes`;
}

/**
 * Valida si una fecha ya expiró
 */
export function isExpired(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() < Date.now();
}

/**
 * Valida formato de email
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Valida formato de teléfono (básico)
 */
export function isValidPhone(phone: string): boolean {
  return /^\+?[\d\s\-()]{10,}$/.test(phone);
}

/**
 * Genera un mensaje de error amigable según el código de error
 */
export function getErrorMessage(errorCode: string): string {
  const messages: Record<string, string> = {
    link_not_found: "Link no encontrado",
    link_inactive: "Este link ya no está activo",
    link_expired: "Este link ha expirado. Por favor solicita uno nuevo.",
    invalid_opportunities: "Número de oportunidades inválido",
    not_enough_remaining: "No tienes suficientes oportunidades restantes",
    numbers_already_sold: "Algunos números ya fueron vendidos",
    missing_fields: "Por favor completa todos los campos",
    invalid_input: "Datos inválidos",
  };

  return messages[errorCode] || `Error: ${errorCode}`;
}

/**
 * Calcula el porcentaje de números vendidos
 */
export function calculateProgress(sold: number, total: number = 1000): number {
  return Math.round((sold / total) * 100);
}

/**
 * Agrupa números en rangos para mejor visualización
 */
export function groupNumbersByRange(
  numbers: string[],
  rangeSize: number = 100
): string[][] {
  const groups: string[][] = [];
  for (let i = 0; i < numbers.length; i += rangeSize) {
    groups.push(numbers.slice(i, i + rangeSize));
  }
  return groups;
}
