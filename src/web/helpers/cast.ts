import { computed, isRef, type Ref, type WritableComputedRef } from 'vue';

export function cast<T, U>(caster: (value: unknown) => U, source: T | Ref<T>, key?: keyof T): WritableComputedRef<U> {
  if (key === undefined && !isRef(source)) {
    throw new Error('Key must be defined for non-refs');
  }

  const getValue = () => {
    if (isRef(source)) {
      if (key === undefined) {
        return source.value;
      }
      return source.value[key];
    }

    return source[key as keyof T] as T;
  }
  const setValue = (value: U): void => {
    if (isRef(source)) {
      if (key === undefined) {
        source.value = value as unknown as T;
      } else {
        source.value[key] = value as T[keyof T];
      }
    } else {
      source[key as keyof T] = value as T[keyof T];
    }
  }

  return computed<U>({
    get() {
      return caster(getValue());
    },
    set(value) {
      setValue(caster(value));
    },
  });
}

export function castNumber<T>(source: T | Ref<T>, key?: keyof T): WritableComputedRef<number> {
  return cast<T, number>(Number, source, key);
}
