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
// What the CSP's connect-src/frame-src actually allow-list for API/file
// calls — mirrors apiBase's own fallback below so the policy always
// matches whatever host the app is actually calling.
const BACKEND_ORIGIN = process.env.NUXT_PUBLIC_API_BASE || proxyTarget

export default defineNuxtConfig({
  devtools: { enabled: false },

  // Dev-only reverse proxy so local requests to `/__backend/**` are forwarded
  // to the real backend server-side (no CORS). Not included in the prod build.
  $development: {
    routeRules: {
      '/__backend/**': { proxy: `${proxyTarget}/**` },
    },
  },
  modules: ['@nuxt/ui', '@pinia/nuxt', '@vite-pwa/nuxt', 'nuxt-security'],
  css: ['~/assets/css/main.css'],

  // Baseline security headers (security review 2026-10-19) — ported from
  // umu-website-integration's already resource-audited CSP (13/14 Oct
  // 2026), adjusted for this app's actual third-party usage. Google/Apple
  // OAuth was removed from this app in the same batch (dead code calling
  // backend routes that don't exist — see useAuth.ts), so no OAuth
  // domains are needed here either. script-src keeps 'unsafe-inline' for
  // the inline "wide-zoom" head script below and matches the conservative
  // choice already made (and documented as unverified beyond that) in the
  // sibling app this was ported from.
  security: {
    headers: {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", 'https://unpkg.com', 'https://js.stripe.com'],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://api.mapbox.com', 'https://unpkg.com'],
        'style-src-attr': ["'unsafe-inline'"],
        'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
        'img-src': [
          "'self'",
          'data:',
          'blob:',
          'https://api.mapbox.com',
          'https://api.os.uk',
          'https://*.tile.openstreetmap.org',
        ],
        'connect-src': [
          "'self'",
          BACKEND_ORIGIN,
          'https://api.stripe.com',
          'https://api.mapbox.com',
          'https://events.mapbox.com',
          'https://api.os.uk',
          'https://*.tile.openstreetmap.org',
        ],
        'frame-src': ["'self'", 'https://js.stripe.com', 'https://www.openstreetmap.org', BACKEND_ORIGIN],
        'worker-src': ["'self'", 'blob:'],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
      },
      crossOriginEmbedderPolicy: false,
      xFrameOptions: 'DENY',
      referrerPolicy: 'strict-origin-when-cross-origin',
      permissionsPolicy: {
        geolocation: ['self'],
        camera: ['self'],
        microphone: [],
      },
    },
  },

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
      script: [
        {
          // Big-screen scale (--wide-zoom). The passport pages are sized in px
          // against a 1366px laptop; wider windows zoom them by width / 1366
          // so any monitor shows the same layout as the laptop, only bigger:
          // same margins, same proportions. Nothing changes at 1366px or below.
          // Browser zoom shows up as a resize, so it is covered too. The cap
          // (3, per screen pixel) keeps raster artwork from being blown up past
          // its resolution; with the browser zoomed out (devicePixelRatio < 1)
          // the cap rises by the same factor. Inline in <head> so it lands
          // before the first paint; without JS the pages stay at laptop size.
          key: 'wide-zoom',
          tagPosition: 'head',
          innerHTML:
            "(function(){var r=document.documentElement;function s(){var w=innerWidth,d=Math.min(devicePixelRatio||1,1);r.style.setProperty('--wide-zoom',(w<=1366?1:Math.min(w/1366,3/d)).toFixed(3))}s();addEventListener('resize',s)})()",
        },
      ],
    },
  },
  runtimeConfig: {
    // Public keys (exposed to client-side)
    public: {
      // In dev, default to the same-origin proxy path so browser calls avoid
      // CORS (see $development.routeRules above). In prod, prefer
      // NUXT_PUBLIC_API_BASE (set on Vercel); if it's missing, fall back to the
      // real backend URL rather than localhost so a forgotten env var can't
      // silently break production.
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE ||
        (isDev
          ? '/__backend'
          : 'https://demo-umu-backend-production.up.railway.app'),
      // googleClientId/appleClientId/appleRedirectUri removed (security
      // review 2026-10-19): the Google/Apple OAuth flow was dead code —
      // no /auth/google or /auth/apple routes exist on the backend, and
      // no sign-in UI linked to it — that also round-tripped the app's
      // real JWT through a URL query string on redirect (browser
      // history / server-log leak), the exact pattern umu-website-
      // integration removed for the same reason on 2026-09-25.
      // Test-mode PUBLISHABLE key only (safe to ship client-side) — kept as
      // a fallback so a forgotten env var degrades to test-mode Stripe
      // rather than breaking checkout outright; never put a secret key here.
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
