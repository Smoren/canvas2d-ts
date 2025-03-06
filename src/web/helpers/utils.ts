export function coalesce(...args: (string | undefined)[]): string {
  for (const candidate of args) {
    if (candidate) {
      return candidate;
    }
  }
  return '';
}
