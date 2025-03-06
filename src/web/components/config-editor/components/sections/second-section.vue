<script lang="ts" setup>

import ConfigSection from "@/web/components/config-editor/components/containers/config-section.vue";
import { useRightBarStore } from "@/web/store/right-bar";

const rightBarStore = useRightBarStore();

</script>

<template>
  <config-section>
    <template #body>
      Вторая секция
      <br />
      <br />
      <button class="btn btn-primary" @click="rightBarStore.toggle('RIGHT_BAR_TEST')">Open right bar</button>
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
