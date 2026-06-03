// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  srcDir: 'src',

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/fonts',
  ],

  fonts: {
    families: [
      { name: 'Montserrat', provider: 'google', weights: [400, 500, 600, 700, 800, 900] },
    ],
  },

  app: {
    head: {
      title: 'Evad Ceremony - Vote pour tes artistes préférés',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Votez pour vos artistes préférés lors de la cérémonie Evad 2026' },
        { name: 'theme-color', content: '#5d0e16' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    adminPassword: process.env.ADMIN_PASSWORD || 'evad2026',
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    supabaseStorageBucket: process.env.SUPABASE_STORAGE_BUCKET || 'nominee-images',
    resendApiKey: process.env.RESEND_API_KEY || '',
    resendFromEmail: process.env.RESEND_FROM_EMAIL || 'EVAD Ceremony <onboarding@resend.dev>',
  },
})
