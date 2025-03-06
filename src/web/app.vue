<script setup lang="ts">
import { onMounted } from 'vue';
import type { VisualizableInterface } from "@/lib/models/types";
import ConfigEditor from "@/web/components/config-editor/config-editor.vue";
import { startApp } from "@/lib/app/app";

onMounted(() => {
  startApp(document.getElementById('canvas2d') as HTMLCanvasElement);
});

</script>

<template>
  <config-editor />
  <canvas id="canvas2d" class="canvas"></canvas>
</template>

<style scoped lang="scss">
.canvas {
  border: 1px solid black !important;
  width: 100%;
  height: 100%;
}
</style>
