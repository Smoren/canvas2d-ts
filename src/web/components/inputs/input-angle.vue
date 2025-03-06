<script lang="ts" setup>
import InputHeader from '@/web/components/base/input-header.vue';
import { type Ref, ref, watch } from 'vue';
import { withToggleLock } from '@/web/helpers/lock';
import { round } from '@/lib/math';

defineProps<{
  name: string;
}>();

const { modelValue } = defineModels<{
  modelValue: number;
}>();

const convertToAngle = (value: number): number => {
  value = Number(value)
  const result = (2 * Math.PI) / value;
  if (!isFinite(result)) {
    return 0;
  }
  return result;
};

const convertToDivider = (value: number): number | '' => {
  value = Number(value)
  const result = round((2 * Math.PI) / value, 2)
  if (!isFinite(result)) {
    return '';
  }
  return result;
};

const onInputChange = () => {
  modelValue.value = (String(angle.value) !== '') ? Number(angle.value) : 0;
}

const divider: Ref<number | ''> = ref(convertToDivider(modelValue.value));
const angle: Ref<number | ''> = ref(modelValue.value);

const lock = ref(false);

watch(modelValue, () => {
  if (Number(angle.value) !== modelValue.value) {
    angle.value = modelValue.value;
  }

  withToggleLock(lock, () => {
    const value = convertToDivider(modelValue.value);
    if (value === modelValue.value) {
      lock.value = false;
      return;
    }
    divider.value = value;
  });
});

watch(divider, () => {
  withToggleLock(lock, () => {
    const value = convertToAngle(Number(divider.value));
    if (value === modelValue.value) {
      lock.value = false;
      return;
    }
    modelValue.value = value;
  });
});
</script>

<template>
  <input-header :name="name" />
  <div class="input-angle">
    <div>2&pi; ÷</div>
    <input type="number" v-model="divider" min="0" placeholder="∞" />
    <div class="input-angle__sign">&nbsp; = &nbsp;</div>
    <input type="number" v-model="angle" min="0" :placeholder="String(modelValue)" @input="onInputChange" />
  </div>
</template>

<style lang="scss" scoped>
@use '../config-editor/assets/config-editor';

.input-angle {
  display: grid;
  grid-template-columns: 1fr 6fr 1fr 6fr;
  align-items: center;

  &__sign {
    margin: auto;
  }
}
</style>
