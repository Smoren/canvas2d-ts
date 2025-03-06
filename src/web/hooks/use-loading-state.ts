import { type CounterInterface, useCounter } from '@/web/hooks/use-counter';
import { type SwitchInterface, useSwitch } from '@/web/hooks/use-switch';
import { type ComputedRef, computed } from 'vue';

export interface LoadingState {
  isLoading: CounterInterface;
  visible: SwitchInterface;
  listStyle: ComputedRef;
  isLoaderVisible: (forceHide: boolean) => boolean;
  startLoading: () => void;
  finishLoading: () => void;
  cancelLoading: () => void;
}

export const useLoadingState = (): LoadingState => {
  const isLoading = useCounter(0);
  const visible = useSwitch(true);

  const startLoading = (hide: boolean = false) => {
    isLoading.increment();
    if (hide) {
      visible.off();
    }
  };

  const finishLoading = () => {
    isLoading.decrement();
    visible.on();
  };

  const cancelLoading = () => {
    isLoading.decrement();
  };

  const isLoaderVisible = (forceHide: boolean = false) => {
    return Boolean(!forceHide && isLoading.state.value);
  };

  const listStyle = computed(() => {
    return { visibility: visible.state.value ? 'visible' : 'hidden' };
  });

  return {
    isLoading,
    visible,
    listStyle,
    isLoaderVisible,
    startLoading,
    finishLoading,
    cancelLoading,
  };
};
