<script lang="ts" setup>
import { computed, withDefaults, watch } from 'vue';
import { type ValidationRule, validateRule } from '@/web/helpers/validate';

const { modelValue } = defineModels<{
  modelValue?: string | number;
}>();

const props = withDefaults(
  defineProps<{
    title?: string;
    rules?: ValidationRule | ValidationRule[];
    type?: 'text' | 'number' | 'date' | 'datetime-local';
    placeholder?: string;
    mask?: string;
    tokens?: string;
    step?: number;
  }>(),
  {
    type: 'text',
    placeholder: '',
    step: 0,
  }
);

const updatedPlaceholder = props.placeholder || props.title || '';

const message = computed(() => {
  if (props.rules !== undefined) {
    if (Array.isArray(props.rules)) {
      return (
        (props.rules as ValidationRule[])?.find((rule) => rule.invalid)
          ?.message || ''
      );
    }
    return (props.rules as ValidationRule)?.invalid
      ? (props.rules as ValidationRule)?.message
      : '';
  }

  return '';
});

watch(modelValue, () => {
  validateRule(
    props.rules ?? [],
    modelValue.value as unknown as string | number
  );
});
</script>

<template>
  <div class="input-validated">
    <div class="title">
      <slot name="title">
        {{ title }}
      </slot>
    </div>
    <div class="input">
      <slot
        :invalid="message !== ''"
        :validateRule="validateRule"
        :rule="rules"
        :value="modelValue as unknown as string | number"
      >
        <input
          class="input"
          v-model="modelValue"
          :placeholder="updatedPlaceholder"
          :invalid="message !== ''"
          @input="
            validateRule(rules ?? [], modelValue as unknown as string | number)
          "
          :type="type"
          :mask="mask"
          :tokens="tokens"
          :step="step"
        />
      </slot>
    </div>
    <div class="message">
      <slot name="message">
        {{ message }}
      </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-validated {
  display: flex;
  flex-direction: column;
  width: 100%;
  // height: 100%;
  gap: 3px;

  .message {
    color: #df0000;
    font-size: 12px;
  }

  .input {
    width: 100%;
  }
}
</style>
