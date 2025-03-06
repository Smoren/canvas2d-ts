import type { LoadingState } from '@/web/hooks/use-loading-state';

export async function withLoading<T>(state: LoadingState, callback: () => Promise<T>) {
  try {
    state.startLoading();
    return await callback();
  } finally {
    state.finishLoading();
  }
}
