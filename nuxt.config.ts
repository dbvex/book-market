// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    baseURL: '/book-market/',
  },
  modules: ['@pinia/nuxt', '@nuxt/eslint'],
  css: ['~/assets/styles/global.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
          additionalData: `
            @use "~/assets/styles/_variables.scss" as *;
            @use "~/assets/styles/_mixins.scss" as *;
          `,
        }
      }
    }
  },
})
