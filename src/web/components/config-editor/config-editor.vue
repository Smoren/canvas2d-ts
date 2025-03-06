<script setup lang="ts">

import 'bootstrap/dist/css/bootstrap.min.css';
import { onMounted, ref } from 'vue';
import { useLeftBarStore } from '@/web/store/left-bar';
import { useRightBarStore } from '@/web/store/right-bar';
import { useRightBar } from '@/web/components/config-editor/hooks/use-right-bar';
import { MDBAccordion, MDBAccordionItem } from 'mdb-vue-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Navbar from '@/web/components/config-editor/components/containers/navbar.vue';
import Sidebar from '@/web/components/config-editor/components/containers/sidebar.vue';
import FirstSection from "@/web/components/config-editor/components/sections/first-section.vue";
import SecondSection from "@/web/components/config-editor/components/sections/second-section.vue";

const activeAccordionItem = ref();

const leftBarStore = useLeftBarStore();
const rightBarStore = useRightBarStore();
const rightBar = useRightBar();

onMounted(() => {
  activeAccordionItem.value = 'collapse-contours';
});
</script>

<template>
  <navbar :on-burger-click="leftBarStore.open">
    <template #title>
      Shell Emulator &nbsp;
      <font-awesome-icon icon="fa-solid fa-location-crosshairs" />
    </template>
    <template #body>
      <sidebar
        :visible="leftBarStore.isOpened"
        :close-action="leftBarStore.close"
        position="left"
        class="sidebar"
      >
        <template #title> Конфигурация </template>
        <template #body>
          <MDBAccordion v-model="activeAccordionItem">
            <MDBAccordionItem headerTitle="Первый" collapseId="collapse-first">
              <first-section />
            </MDBAccordionItem>
            <MDBAccordionItem headerTitle="Второй" collapseId="collapse-second">
              <second-section />
            </MDBAccordionItem>
          </MDBAccordion>
        </template>
      </sidebar>
      <sidebar
        :visible="rightBarStore.isOpened"
        :close-action="rightBarStore.close"
        position="right"
      >
        <template #title>
          <div class="sidebar__header">
            <button
              v-if="rightBarStore.canReturnBack"
              @click="rightBarStore.returnBack"
              type="button"
              class="btn btn-outline-secondary"
            >
              <font-awesome-icon :icon="['fas', 'arrow-left']" />
            </button>
            {{ rightBar.title.value }}
          </div>
        </template>
        <template #body>
          Третий
        </template>
      </sidebar>
    </template>
  </navbar>
</template>

<style scoped lang="scss">
@use './assets/config-editor.scss';

.sidebar {
  overflow: hidden;
  resize: horizontal;

  &__header {
    display: flex;
    align-items: center;
    gap: 15px;
  }
}
</style>
