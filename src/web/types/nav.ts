export const AVAILABLE_MODES = [
  'RIGHT_BAR_TEST',
] as const;

export type BarModeAlias = (typeof AVAILABLE_MODES)[number];

export type BarMode = {
  alias: BarModeAlias;
  title: string;
};

export type BarModesMap = Record<BarModeAlias, BarMode>;
