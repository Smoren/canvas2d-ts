<script setup lang="ts">
import type { NumericVector } from '@/lib/math/types';

const { modelValue } = defineModels<{
  modelValue: NumericVector;
}>();

defineProps<{
  min?: number;
  max?: number;
  step?: number;
}>();
</script>

<template>
  <table>
    <tr>
      <td v-for="(_, index) in modelValue">
        <input
          type="number"
          v-model="modelValue[index]"
          :min="min"
          :max="max"
          :step="step"
        />
      </td>
    </tr>
  </table>
</template>

<style scoped lang="scss">
@use '../config-editor/assets/config-editor';
</style>
