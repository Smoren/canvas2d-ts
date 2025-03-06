import type { BarModeAlias } from '@/web/types/nav';

export function isRightBarModeIn(mode: BarModeAlias | undefined, modes: BarModeAlias[]): boolean {
  if (mode === undefined) {
    return false;
  }
  return modes.includes(mode);
}
