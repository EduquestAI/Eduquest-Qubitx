// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    '@/assets/css/main.css',
  ],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/google-fonts",
    "@nuxtjs/robots",
    "@nuxt/content",
    "nuxt-icon",
    "nuxt-swiper",
    "@nuxtjs/plausible",
    "@nuxtjs/device"
  ]
})