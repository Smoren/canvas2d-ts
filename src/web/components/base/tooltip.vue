<script setup lang="ts">
import 'floating-vue/dist/style.css';
import { Dropdown, type Placement, type TriggerEvent } from 'floating-vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

type TextAlign =
  | 'start'
  | 'end'
  | 'left'
  | 'right'
  | 'center'
  | 'justify'
  | 'match-parent';

interface Props {
  text: string;
  triggers?: TriggerEvent[];
  shown?: boolean;
  placement?: Placement;
  disabled?: boolean;
  maxWidth?: string | number;
  textAlign?: TextAlign;
}

const props = withDefaults(defineProps<Props>(), {
  //@ts-ignore
  triggers: ['hover', 'click'] as TriggerEvent[],
  shown: false,
  placement: 'top',
  disabled: false,
  textAlign: 'center',
});

const style = {
  'max-width': `${props.maxWidth}` + 'px',
  'text-align': props.textAlign,
};
</script>

<template>
  <Dropdown
    class="dropdown"
    :triggers="triggers"
    :placement="placement"
    :shown="shown"
    :disabled="disabled"
  >
    <div class="slot-container">
      <div class="slot-content">
        <slot />
        <font-awesome-icon
          icon="fa-regular fa-circle-question"
          style="color: #bbb; margin-left: 5px"
        />
      </div>
    </div>

    <template #popper>
      <div class="tooltip-wrapper" :style="style">
        {{ text }}
      </div>
    </template>
  </Dropdown>
</template>

<style lang="scss">
.v-popper__arrow-container,
.v-popper__arrow-outer,
.v-popper__arrow-inner {
  display: none !important;
}
</style>

<style scoped lang="scss">
.slot-container {
  display: inline-block;
}

.tooltip-wrapper {
  background: #1e1e1e;
  color: rgb(180, 180, 180);
  padding: 7px 15px;
  border-radius: 5px;
  box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.9);
  transition: 0.3s opacity ease, 0.3s bottom ease;
  // text-align: center;
}

.dropdown {
  display: inline-block;
}
</style>
