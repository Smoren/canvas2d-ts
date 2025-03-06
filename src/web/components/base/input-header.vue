<script setup lang="ts">
import type { Placement } from 'floating-vue';
import Tooltip from './tooltip.vue';

type Position = 'center' | 'left' | 'right';

withDefaults(
  defineProps<{
    name: string;
    position?: Position;
    tooltip?: string;
    tooltipPosition?: Placement;
    tooltipWidth?: number;
    styleBold?: boolean;
  }>(),
  {
    position: 'left',
    styleBold: true,
  }
);
</script>

<template>
  <div :style="{ textAlign: position }">
    <label>
      <slot />
      <span :style="{ fontWeight: styleBold ? 600 : 'normal' }">{{
        name
      }}</span>
    </label>
    <tooltip v-if="tooltip" :text="tooltip" :placement="tooltipPosition" :max-width="tooltipWidth" />
  </div>
</template>
