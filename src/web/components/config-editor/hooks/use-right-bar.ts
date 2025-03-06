import { computed } from 'vue';
import { useRightBarStore } from '@/web/store/right-bar';

export const useRightBar = () => {
  const rightBarStore = useRightBarStore();

  const title = computed(() => {
    if (rightBarStore.currentMode === undefined) {
      return '';
    }

    return rightBarStore.currentMode.title;
  });

  return {
    title,
  };
}
