<script lang="ts" setup>

import ConfigSection from "@/web/components/config-editor/components/containers/config-section.vue";

</script>

<template>
  <config-section>
    <template #body>
      Первая секция
    </template>
  </config-section>
</template>

<style scoped lang="scss">
@use '../../assets/config-editor';

input[type='text'],
input[type='number'] {
  width: 100%;
}
</style>
