import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { BarModeAlias, BarModesMap } from '@/web/types/nav';
import { AVAILABLE_MODES } from '@/web/types/nav';
import { useNavHistoryStore } from '@/web/store/nav-history-store';

function createModesMap(input: Array<[BarModeAlias, string]>): BarModesMap {
  const result = {} as BarModesMap;
  for (const [alias, title] of input) {
    result[alias] = { alias, title };
  }
  return result;
}

export const useRightBarStore = defineStore('rightBar', () => {
  const modesMap = createModesMap([
    ['RIGHT_BAR_TEST', 'Right bar test'],
  ]);

  const historyStore = useNavHistoryStore();
  const currentModeAlias = ref<BarModeAlias | undefined>();
  const lastHistoryItem = computed(() => historyStore.last);

  const modes = computed((): Record<BarModeAlias, BarModeAlias> => {
    const result = {} as Record<BarModeAlias, BarModeAlias>;
    for (const alias of AVAILABLE_MODES) {
      result[alias] = alias;
    }
    return result;
  });

  const isOpened = computed(
    (): boolean => currentModeAlias.value !== undefined
  );

  const currentMode = computed(() =>
    isOpened.value ? modesMap[currentModeAlias.value!] : undefined
  );

  const canReturnBack = computed(() => lastHistoryItem.value !== undefined);

  const isMode = (alias: BarModeAlias): boolean =>
    alias === currentModeAlias.value;

  const internalOpen = (alias: BarModeAlias): boolean => {
    const result = alias !== currentModeAlias.value;
    currentModeAlias.value = alias;
    return result;
  };

  const open = (alias: BarModeAlias): boolean => {
    const result = internalOpen(alias)
    if (result) {
      historyStore.clear();
    }
    return result;
  };

  const openNested = (alias: BarModeAlias): boolean => {
    if (currentModeAlias.value === undefined) {
      throw new Error('Current mode is undefined');
    }
    if (alias === currentModeAlias.value) {
      return false;
    }
    historyStore.push(modesMap[currentModeAlias.value]);
    return internalOpen(alias);
  };

  const returnBack = (): void => {
    if (historyStore.empty) {
      throw new Error('History is empty');
    }
    currentModeAlias.value = historyStore.pop()!.alias;
  }

  const close = (): void => (currentModeAlias.value = undefined);

  const toggle = (alias: BarModeAlias): void => {
    if (!open(alias)) {
      close();
    }
  };

  return {
    modes,
    currentModeAlias,
    currentMode,
    isOpened,
    lastHistoryItem,
    canReturnBack,
    isMode,
    open,
    openNested,
    returnBack,
    close,
    toggle,
  };
});
