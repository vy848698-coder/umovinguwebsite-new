// Hides the Capacitor native splash once Nuxt has hydrated. The plugin
// runs on the client only (`.client.ts` suffix) and is a no-op outside a
// Capacitor shell — so it's safe on the Vercel web build too.
//
// Capacitor's launch flow:
//   1. iOS shows the LaunchScreen.storyboard (built into the .ipa)
//   2. Capacitor's SplashScreen plugin keeps it visible until either
//      `launchShowDuration` ms elapse OR we explicitly call `hide()`
//   3. We call `hide()` once Nuxt is mounted so the gap between WebView
//      ready and the first Vue paint is covered by the splash, not by a
//      blank white WebView.
//
// `launchAutoHide: false` in capacitor.config.ts means the splash will
// stay forever if this plugin breaks — `launchShowDuration: 2000` is a
// safety cap so it auto-hides after 2 s regardless.

export default defineNuxtPlugin({
  name: 'umu-splash-screen',
  parallel: true,
  async setup() {
    if (typeof window === 'undefined') return
    try {
      const { Capacitor } = await import('@capacitor/core')
      if (!Capacitor.isNativePlatform()) return
      // Keep this import runtime-only so web/SSR builds do not require
      // resolving the native plugin package up-front.
      const splashModule = '@capacitor/splash-screen'
      const { SplashScreen } = await import(/* @vite-ignore */ splashModule)
      // Give the first paint a frame to actually land before fading out.
      requestAnimationFrame(() => {
        SplashScreen.hide({ fadeOutDuration: 300 }).catch(() => {
          /* plugin not installed yet — fine on dev / web */
        })
      })
    } catch {
      // @capacitor/splash-screen isn't in deps yet — also fine; the native
      // launchShowDuration timeout will hide the splash on its own.
    }
  },
})
