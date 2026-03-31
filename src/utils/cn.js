/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utilidad para combinar clases de Tailwind de forma segura.
 * Combina clsx para condicionales y tailwind-merge para resolver conflictos.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
