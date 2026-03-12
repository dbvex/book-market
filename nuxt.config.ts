// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    baseURL: '/book-market/'
  },
  modules: ['@pinia/nuxt', '@nuxt/eslint'],
  css: ['~/assets/styles/main.scss'],
  vite: {
    optimizeDeps: {
      exclude: ['#app-manifest']
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "~/assets/styles/_variables.scss" as *;
            @use "~/assets/styles/_mixins.scss" as *;
          `
        }
      }
    }
  }
})
