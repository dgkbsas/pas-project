/**
 * Utilidades para manejo de números de teléfono
 */

/**
 * Verifica si un número de teléfono es un celular argentino válido para WhatsApp
 * Los números de celular en Argentina tienen el formato: +54 9 [área] [número]
 * @param phone - Número de teléfono a validar
 * @returns true si es un celular argentino válido
 */
export function isArgentinaMobileNumber(phone: string): boolean {
  if (!phone) return false;

  // Limpiar el número de espacios, guiones, paréntesis, etc.
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

  // Verificar si comienza con +54 9 (formato internacional de celular argentino)
  // Formato: +54 9 XXXX XXXXXXXX o +549XXXXXXXXXXXX
  const argMobilePattern = /^\+549\d{10,11}$/;

  return argMobilePattern.test(cleanPhone);
}

/**
 * Verifica si un número parece ser un celular (formato genérico)
 * Esta función es más permisiva y puede usarse para números de otros países
 * @param phone - Número de teléfono a validar
 * @returns true si parece ser un número móvil
 */
export function isMobileNumber(phone: string): boolean {
  if (!phone) return false;

  // Limpiar el número
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

  // Verificar patrones comunes de celular:
  // 1. Números que empiezan con + y tienen al menos 10 dígitos
  // 2. Números argentinos que empiezan con +54 9
  // 3. Números que empiezan con 9 (celular local)

  if (cleanPhone.startsWith('+549')) {
    // Celular argentino formato internacional
    return /^\+549\d{10,11}$/.test(cleanPhone);
  }

  if (cleanPhone.startsWith('+')) {
    // Formato internacional genérico (al menos 10 dígitos después del +)
    return /^\+\d{10,15}$/.test(cleanPhone);
  }

  // Formato local argentino (empieza con 9 o 15)
  if (cleanPhone.startsWith('9') || cleanPhone.startsWith('15')) {
    return /^(9|15)\d{8,10}$/.test(cleanPhone);
  }

  return false;
}

/**
 * Limpia un número de teléfono para usarlo en WhatsApp
 * @param phone - Número de teléfono
 * @returns Número limpio para WhatsApp
 */
export function cleanPhoneForWhatsApp(phone: string): string {
  // Eliminar todos los caracteres que no sean números ni el +
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Genera la URL de WhatsApp para un número de teléfono
 * @param phone - Número de teléfono
 * @param message - Mensaje inicial opcional
 * @returns URL de WhatsApp
 */
export function getWhatsAppUrl(phone: string, message?: string): string {
  const cleanPhone = cleanPhoneForWhatsApp(phone);
  let url = `https://wa.me/${cleanPhone}`;

  if (message) {
    url += `?text=${encodeURIComponent(message)}`;
  }

  return url;
}
