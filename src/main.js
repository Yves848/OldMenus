// @ts-check
import Vue from "vue";
// @ts-ignore
import App from "./App.vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.css";
import { store } from "./store/store";
import VueRouter from "vue-router";
import { routes } from "./routes";
import VueFire from "vuefire";

Vue.use(Vuetify);
Vue.use(VueRouter);
Vue.use(VueFire);

const router = new VueRouter({
  mode: "history",
  routes
});

new Vue({
  el: "#app",
  store,
  router,
  render: h => h(App)
});
