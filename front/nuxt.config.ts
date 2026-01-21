export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devServer: {
    port: 3001,
    host: "localhost",
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/fonts",
    "@pinia/nuxt",
  ],
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_BECK_URL_API,
      wsUrl: process.env.NUXT_PUBLIC_BECK_URL_WS,
      captcha: process.env.NUXT_PUBLIC_RECAPTCHA_SITE_KEY,
    },
  },
  app: {
    head: {
      title: "Test Comments",
      script: [
        {
          src: `https://www.google.com/recaptcha/api.js?render=${process.env.NUXT_PUBLIC_RECAPTCHA_SITE_KEY}`,
          async: true,
          defer: true,
        },
      ],
    },
  },
  css: ["./app/css/main.css"],
  typescript: {
    strict: true,
  },
  plugins: ["./plugins/ws.client.ts"],
  devtools: { enabled: true },
});
