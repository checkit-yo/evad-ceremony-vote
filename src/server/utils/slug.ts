/**
 * Génère un slug URL-friendly depuis une chaîne libre.
 * - retire accents (NFD)
 * - lowercase
 * - remplace tout caractère non [a-z0-9] par un tiret
 * - trim et déduplique les tirets
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}
