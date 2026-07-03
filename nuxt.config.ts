// Local dev only: the backend's CORS allowlist doesn't include localhost:3000,
// so the browser blocks direct cross-origin calls to Railway. In dev we instead
// point apiBase at a same-origin path (`/__backend`) and let Nitro's dev server
// proxy it to the real backend — the browser makes a same-origin request, so CORS
// never applies. Production (Vercel) is unaffected: it keeps calling Railway
// directly via NUXT_PUBLIC_API_BASE (Vercel's origin IS in the allowlist).
const isDev = process.env.NODE_ENV !== 'production'
const proxyTarget =
  process.env.NUXT_PROXY_TARGET ||
  'https://demo-umu-backend-production.up.railway.app'

export default defineNuxtConfig({
  devtools: { enabled: false },

  // Dev-only reverse proxy so local requests to `/__backend/**` are forwarded
  // to the real backend server-side (no CORS). Not included in the prod build.
  $development: {
    routeRules: {
      '/__backend/**': { proxy: `${proxyTarget}/**` },
    },
  },
  modules: ['@nuxt/ui', '@pinia/nuxt', '@vite-pwa/nuxt'],
  css: ['~/assets/css/main.css'],

  pwa: {
    registerType: 'autoUpdate',
    strategies: 'generateSW',
    manifest: {
      name: 'UmovingU - Property Toolkit',
      short_name: 'UmovingU',
      description: 'Your complete property toolkit—track progress, store documents, and connect with trusted trades in one place.',
      theme_color: '#00a19a',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait-primary',
      start_url: '/',
      scope: '/',
      categories: ['lifestyle', 'utilities'],
      icons: [
        {
          src: '/logo.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/logo.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/pwa-icon.svg',
          sizes: 'any',
          type: 'image/svg+xml',
          purpose: 'any maskable',
        },
      ],
      screenshots: [],
    },
    workbox: {
      navigateFallback: '/offline',
      navigateFallbackDenylist: [/^\/api\//],
      // Default precache cap is 2 MiB; some images (e.g. Exp.png ~2.16 MB)
      // exceed it. Raise to 3 MiB so they're still precached.
      maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
      globIgnores: ['op-icons/temp/**'],
      runtimeCaching: [
        {
          // Google Fonts — cache-first
          urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts',
            expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          // API calls — network-first so users always get fresh data when online
          urlPattern: /^https?:\/\/.*\/api\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
            cacheableResponse: { statuses: [0, 200] },
            networkTimeoutSeconds: 10,
          },
        },
        {
          // Images — stale-while-revalidate
          urlPattern: /\.(png|jpg|jpeg|svg|gif|webp|ico)(\?.*)?$/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'image-cache',
            expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },
    devOptions: {
      // Service worker disabled in dev — the navigateFallback to /offline
      // hijacks every non-precached route (pages aren't precached in dev),
      // which made all routes redirect to /offline. PWA still runs in prod.
      enabled: false,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },

  app: {
    head: {
      title: 'UmovingU - Your Property Toolkit',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, viewport-fit=cover',
        },
        {
          name: 'description',
          content:
            'Your complete property toolkit—track progress, store documents, and connect with trusted trades in one place.',
        },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-title', content: 'UmovingU' },
        {
          name: 'apple-mobile-web-app-status-bar-style',
          content: 'black-translucent',
        },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'msapplication-TileColor', content: '#00a19a' },
        { name: 'theme-color', content: '#00a19a' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
        },
        { rel: 'apple-touch-icon', href: '/logo.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
      ],
    },
  },
  runtimeConfig: {
    // Private keys (only available on server-side)
    apiSecret: process.env.API_SECRET || '123',
    // Public keys (exposed to client-side)
    public: {
      // In dev, default to the same-origin proxy path so browser calls avoid
      // CORS (see $development.routeRules above). In prod, NUXT_PUBLIC_API_BASE
      // is set to the real backend URL on Vercel.
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE ||
        (isDev ? '/__backend' : 'http://localhost:3002'),
      googleClientId:
        process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID ||
        '869780740735-rlucf6t174rb3dljniqfj3ri2r0kg9cj.apps.googleusercontent.com',
      appleClientId:
        process.env.NUXT_PUBLIC_APPLE_CLIENT_ID || 'io.umovingu.webapp',
      appleRedirectUri:
        process.env.NUXT_PUBLIC_APPLE_REDIRECT_URI ||
        'https://demo-umu-frontend.vercel.app/auth/apple/callback',
      stripeKey:
        process.env.NUXT_PUBLIC_STRIPE_KEY ||
        'pk_test_51RvzhKLR3oJsnvMf4gRG09EZsz4uX4VYt89aqLXTTAdFnphlHHVyfzHlkLyR6I5U0TSi8Su5H3gTaT0Yasza7t6K00h9dldDgB',
      mapboxToken: process.env.NUXT_PUBLIC_MAPBOX_TOKEN || '',
      googleApiKey: process.env.NUXT_PUBLIC_GOOGLE_API_KEY || '',
      osApiKey: process.env.NUXT_PUBLIC_OS_API_KEY || '',
    },
  },
  components: true,
  // Strip console.* from production bundles. The dev server keeps them so
  // engineers can still see logs locally; only the prod build (and SSR
  // server build) is stripped. `debugger` is dropped too.
  vite: {
    esbuild: {
      drop:
        process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
  },
})
