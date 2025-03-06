import { createApp } from "vue";
import { createPinia } from "pinia";

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import Toast, { POSITION } from 'vue-toastification';
import "vue-toastification/dist/index.css";
library.add(fas, far);

import App from "./app.vue";
import "@/web/assets/main.css";

const app = createApp(App);

app.use(createPinia());
app.use(Toast, {
  position: POSITION.BOTTOM_CENTER,
});
app.mount('#app');
