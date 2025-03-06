import type { Ref } from 'vue';

export function withLock(lock: Ref<boolean>, action: () => void) {
  if (lock.value) {
    return;
  }
  lock.value = true;
  action();
  lock.value = false;
}

export async function withLockAsync(lock: Ref<boolean>, action: () => Promise<void>) {
  if (lock.value) {
    return;
  }
  lock.value = true;
  await action();
  lock.value = false;
}

export function withToggleLock(lock: Ref<boolean>, action: () => void) {
  if (lock.value) {
    lock.value = false;
    return;
  }
  lock.value = true;
  action();
}

export async function withAsyncToggleLock(lock: Ref<boolean>, action: () => Promise<void>) {
  if (lock.value) {
    lock.value = false;
    return;
  }
  lock.value = true;
  await action();
}
