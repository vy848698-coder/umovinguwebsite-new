<template>
  <div class="lp" :class="{ 'calm-mode': isCalmMode, [`variant-${ctaVariant.toLowerCase()}`]: true }">
    <!-- ─────────────────────────── NAVBAR ─────────────────────────── -->
    <header class="lp-nav">
      <div class="lp-shell lp-nav-inner">
        <button class="lp-brand" type="button" @click="scrollToTop" aria-label="umovingu home">
          <img src="/logo-new.png" alt="umovingu" class="lp-brand-img" />
          <span class="lp-brand-name">umovingu</span>
          <span class="lp-brand-beta">BETA</span>
        </button>

        <nav class="lp-nav-links" aria-label="Primary navigation">
          <button type="button" @click="scrollToSection('homescore')">HomeScore</button>
          <button type="button" @click="scrollToSection('passport')">Passport</button>
          <button type="button" @click="scrollToSection('story')">Story</button>
          <button type="button" @click="scrollToSection('market')">Market</button>
          <button type="button" @click="scrollToSection('reviews')">Reviews</button>
        </nav>

        <div class="lp-nav-actions">
          <button class="lp-btn lp-btn--ghost lp-nav-signin" type="button" @click="navigateTo('/onboarding/signin')">Sign in</button>
          <button class="lp-btn lp-btn--solid" type="button" @click="navigateTo('/onboarding/signup')">Get started</button>
          <button
            class="lp-nav-burger"
            type="button"
            :aria-expanded="mobileMenuOpen"
            aria-label="Toggle navigation menu"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <span :class="{ open: mobileMenuOpen }" />
          </button>
        </div>
      </div>

      <!-- Mobile dropdown menu -->
      <transition name="lp-menu">
        <nav v-if="mobileMenuOpen" class="lp-mobile-menu" aria-label="Mobile navigation">
          <div class="lp-shell">
            <button type="button" @click="scrollToSection('homescore')">HomeScore</button>
            <button type="button" @click="scrollToSection('passport')">Passport</button>
            <button type="button" @click="scrollToSection('story')">Story</button>
            <button type="button" @click="scrollToSection('market')">Market</button>
            <button type="button" @click="scrollToSection('reviews')">Reviews</button>
            <button class="lp-mobile-signin" type="button" @click="navigateTo('/onboarding/signin')">Sign in</button>
          </div>
        </nav>
      </transition>
    </header>

    <main>
      <!-- ─────────────────────────── HERO ─────────────────────────── -->
      <section class="lp-hero reveal is-visible" data-reveal>
        <div class="lp-shell lp-hero-grid">
          <div class="lp-hero-copy">
            <p class="lp-eyebrow">Know your home inside out</p>
            <h1 class="lp-hero-title">
              Have the<br />
              answers ready,<br />
              <span class="lp-hero-accent">before anyone</span><br />
              asks<span class="lp-dot">.</span>
            </h1>
            <p class="lp-hero-sub">
              A free <strong>HomeScore</strong> shows where your home stands today. A
              <strong>Property Passport</strong> has every answer a buyer's solicitor will ask
              for — so you sell without the surprises, and stay in control.
            </p>

            <div class="lp-hero-cta">
              <button class="lp-btn lp-btn--solid lp-btn--lg" type="button" @click="goToHomeScoreFrom('hero_cta')">
                Check my HomeScore — free
              </button>
            </div>

            <ul class="lp-hero-ticks">
              <li>No card needed</li>
              <li>60-second result</li>
              <li>HM Land Registry connected</li>
            </ul>
          </div>

          <!-- Passport card mockup -->
          <div class="lp-hero-visual">
            <article class="lp-passport-card">
              <span class="lp-passport-kicker">Your HomeScore</span>
              <div class="lp-passport-logo">
                <img src="/op-icons/logo.svg" alt="umu" class="lp-passport-logo-mark" />
              </div>
              <div class="lp-passport-addr">
                <strong>55, Woodfield Road</strong>
                <span>Coventry · CV5 6AJ</span>
              </div>
              <div class="lp-hs-top">
                <div class="lp-hs-ring-wrap">
                  <svg class="lp-hs-ring" viewBox="0 0 140 140">
                    <circle class="lp-hs-ring-bg" cx="70" cy="70" r="58" />
                    <circle class="lp-hs-ring-meter" cx="70" cy="70" r="58" />
                  </svg>
                  <div class="lp-hs-center"><strong>74</strong><span>Good</span></div>
                </div>
                <ul class="lp-hs-rows">
                  <li><span>Bills vs. your street</span><b class="warn">22% above</b></li>
                  <li><span>EPC rating</span><b>C</b></li>
                  <li><span>Potential saving</span><b class="up">£330/yr</b></li>
                  <li><span>Value vs. neighbours</span><b class="up">+£13k</b></li>
                </ul>
              </div>
              <div class="lp-hs-note">
                <span class="lp-hs-note-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </span>
                <p>Add your real bills and improvements to sharpen your score — then move from
                <strong>HomeScore</strong> to a <strong>Property Passport</strong> when you're move-ready.</p>
              </div>
            </article>

            <div class="lp-badge lp-badge--solicitor lp-float-b">
              <span class="lp-badge-eyebrow"><i class="lp-badge-pip" />Buyer's solicitor asks</span>
              <div class="lp-badge-q-wrap">
                <transition name="lp-q-fade" mode="out-in">
                  <span class="lp-badge-q" :key="solicitorIndex">"{{ currentQuestion }}"</span>
                </transition>
              </div>
              <span class="lp-badge-line"><i class="lp-tick" />Already answered in the Passport</span>
            </div>

            <div class="lp-badge lp-badge--score lp-float-c">
              <span class="lp-badge-eyebrow">Your HomeScore</span>
              <strong><span data-count="74">74</span><small>/100</small></strong>
              <span class="lp-badge-score-sub">Good · ready to improve</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ───────────────────── PROPERTY STRIP ───────────────────── -->
      <section class="lp-strip reveal" data-reveal>
        <div class="lp-shell">
          <p class="lp-strip-eyebrow">Homes already moving with UMU</p>
          <p class="lp-strip-sub">A live ribbon of HomeScores and Passports near you · illustrative</p>
        </div>
        <div class="lp-strip-viewport">
          <div class="lp-strip-track">
            <article v-for="(h, i) in stripLoop" :key="`strip-${i}`" class="lp-strip-card" aria-hidden="true">
              <div class="lp-strip-media" :class="`tone-${h.tone}`">
                <!-- Flat house illustrations -->
                <svg v-if="h.house === 'townhouse'" class="lp-house" viewBox="0 0 120 76">
                  <rect x="2" y="64" width="116" height="8" fill="#bcd6c4" />
                  <rect x="30" y="22" width="58" height="46" rx="2" fill="#e7e2d6" />
                  <rect x="30" y="16" width="58" height="7" fill="#231d45" />
                  <rect x="40" y="32" width="11" height="11" fill="#9ad7d2" />
                  <rect x="67" y="32" width="11" height="11" fill="#9ad7d2" />
                  <rect x="40" y="49" width="11" height="11" fill="#9ad7d2" />
                  <rect x="63" y="49" width="14" height="19" fill="#00a19a" />
                </svg>
                <svg v-else-if="h.house === 'bungalow'" class="lp-house" viewBox="0 0 120 76">
                  <rect x="2" y="64" width="116" height="8" fill="#bcd6c4" />
                  <rect x="28" y="40" width="64" height="28" fill="#231d45" />
                  <path d="M22 40 60 16l38 24Z" fill="#c98a3a" />
                  <rect x="36" y="48" width="14" height="14" fill="#f0d28a" />
                  <rect x="70" y="48" width="14" height="14" fill="#f0d28a" />
                  <rect x="56" y="48" width="9" height="20" fill="#00a19a" />
                </svg>
                <svg v-else-if="h.house === 'block'" class="lp-house" viewBox="0 0 120 76">
                  <rect x="2" y="64" width="116" height="8" fill="#bcd6c4" />
                  <rect x="34" y="14" width="52" height="54" rx="2" fill="#e7e2d6" />
                  <rect x="34" y="10" width="52" height="6" fill="#231d45" />
                  <rect x="42" y="22" width="11" height="11" fill="#9ad7d2" />
                  <rect x="67" y="22" width="11" height="11" fill="#9ad7d2" />
                  <rect x="42" y="40" width="11" height="11" fill="#9ad7d2" />
                  <rect x="67" y="40" width="11" height="11" fill="#00a19a" />
                </svg>
                <svg v-else-if="h.house === 'cottage'" class="lp-house" viewBox="0 0 120 76">
                  <rect x="2" y="64" width="116" height="8" fill="#bcd6c4" />
                  <rect x="32" y="40" width="56" height="28" fill="#e7e2d6" />
                  <path d="M26 40 52 18l10 0 26 22Z" fill="#8a6a3a" />
                  <rect x="74" y="20" width="9" height="16" fill="#8a6a3a" />
                  <rect x="40" y="48" width="13" height="13" fill="#f0d28a" />
                  <rect x="60" y="48" width="11" height="20" fill="#231d45" />
                </svg>
                <svg v-else-if="h.house === 'detached'" class="lp-house" viewBox="0 0 120 76">
                  <rect x="2" y="64" width="116" height="8" fill="#bcd6c4" />
                  <rect x="30" y="42" width="60" height="26" fill="#e7e2d6" />
                  <path d="M22 42 60 14l38 28Z" fill="#231d45" />
                  <rect x="40" y="50" width="13" height="13" fill="#9ad7d2" />
                  <rect x="68" y="50" width="13" height="13" fill="#9ad7d2" />
                  <rect x="55" y="50" width="11" height="18" fill="#00a19a" />
                </svg>
                <svg v-else class="lp-house" viewBox="0 0 120 76">
                  <rect x="2" y="64" width="116" height="8" fill="#bcd6c4" />
                  <rect x="36" y="40" width="48" height="28" fill="#e7e2d6" />
                  <path d="M32 40 60 18l28 22Z" fill="#3dbda3" />
                  <rect x="46" y="48" width="12" height="12" fill="#f0d28a" />
                  <rect x="63" y="48" width="10" height="20" fill="#231d45" />
                </svg>
                <span class="lp-strip-score">
                  <i class="lp-score-dot" :style="{ background: scoreDot(h.score) }" />{{ h.score }}<small>/100</small>
                </span>
              </div>
              <div class="lp-strip-body">
                <strong>{{ h.addr }}</strong>
                <span>{{ h.area }}</span>
                <em class="lp-strip-tag" :class="`is-${h.kind}`">
                  <svg v-if="h.kind === 'passport'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  <svg v-else-if="h.kind === 'sold'" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.6 6.3 6.8.5-5.2 4.4 1.6 6.6L12 16.9 6.2 20.3l1.6-6.6L2.6 9.3l6.8-.5z" /></svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
                  {{ h.tag }}
                </em>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- ───────────────────── PASSPORT (DARK) ───────────────────── -->
      <section id="passport" class="lp-section lp-dark reveal" data-reveal>
        <div class="lp-shell lp-split lp-split--passport">
          <div class="lp-copy">
            <p class="lp-eyebrow lp-eyebrow--teal">The product · solicitor-grade</p>
            <h2 class="lp-h2 lp-h2--sans">Find out now.<br />Not three weeks in<span class="lp-q">.</span></h2>
            <p class="lp-lede">
              This is where a sharpened HomeScore becomes move-ready. Everything a buyer's
              solicitor needs — and will ask for — title deeds, searches, fixtures, boundaries
              and compliance, gathered into one verified record before you list. The questions
              that break sales are answered on day one, and you stay in control of who sees what.
            </p>
            <div class="lp-feature-tiles">
              <div><span class="lp-ft-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h11l5 5v11H4z" /><path d="M9 9h6M9 13h6M9 17h4" /></svg></span><strong>Title &amp; deeds</strong><p>Pulled automatically from HM Land Registry.</p></div>
              <div><span class="lp-ft-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg></span><strong>Local searches</strong><p>Council, drainage and environmental, up front.</p></div>
              <div><span class="lp-ft-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V8l9-5 9 5v13" /><path d="M9 21v-6h6v6" /></svg></span><strong>Fixtures &amp; boundaries</strong><p>The forms and plans solicitors request.</p></div>
              <div><span class="lp-ft-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v6c0 5 3.4 7.8 8 9 4.6-1.2 8-4 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg></span><strong>Compliance &amp; certs</strong><p>FENSA, building regs, gas — verified.</p></div>
            </div>
            <p class="lp-dark-foot"><span class="lp-star">★</span> Transferable, owned by you, accepted by your buyer's solicitor.</p>
          </div>

          <div class="lp-dark-card-col">
            <article class="lp-card lp-dark-card">
              <div class="lp-dark-card-head">
                <div><strong>55, Woodfield Road</strong><span>CV5 6AJ</span></div>
                <span class="lp-issued">Issued</span>
              </div>
              <p class="lp-dark-card-body">
                Open the live Property Passport — 17 <span class="lp-hl">verified sections</span>, <span class="lp-hl">documents</span>,
                <span class="lp-hl">buyer matching</span> and collaborator access.
              </p>
              <button class="lp-btn lp-btn--solid lp-btn--block" type="button" @click="navigateTo('/passport/sample')">Open the sample Passport</button>
            </article>
          </div>
        </div>
      </section>

      <!-- ─────────────────────────── STORY ─────────────────────────── -->
      <section id="story" class="lp-section reveal" data-reveal>
        <div class="lp-shell lp-story">
          <p class="lp-story-eyebrow">A real story · Coventry, March 2026</p>
          <h2 class="lp-story-title">Aisha sold her two-bed<br />in <span class="lp-story-accent">fourteen days.</span></h2>

          <div class="lp-story-stats">
            <article><strong class="teal" data-count="14">14</strong><span>Days, offer to completion</span></article>
            <article><strong data-count="0" data-prefix="£">£0</strong><span>Lost in survey fees</span></article>
            <article><strong data-count="2.7" data-prefix="£" data-suffix="k" data-decimals="1">£2.7k</strong><span>Saved vs UK average</span></article>
          </div>

          <div class="lp-timeline-toggle" :class="`mode-${timelineMode}`">
            <button type="button" :class="{ active: timelineMode === 'without' }" @click="timelineMode = 'without'">Without a Passport</button>
            <button type="button" :class="{ active: timelineMode === 'with' }" @click="timelineMode = 'with'">With UMU</button>
          </div>
          <div class="lp-tl-headline" :class="`is-${timelineMode}`">
            <strong>{{ timelineHeadline.days }}<small>days</small></strong>
            <span>{{ timelineHeadline.sub }}</span>
          </div>
          <div class="lp-timeline" :class="`is-${timelineMode}`" :key="`tl-bar-${timelineMode}`">
            <div v-for="(t, i) in timeline" :key="`tl-${timelineMode}-${i}`" class="lp-timeline-step">
              <span class="lp-tl-dot">{{ t.n }}</span>
              <strong>{{ t.day }}</strong>
              <span>{{ t.label }}</span>
            </div>
          </div>

          <blockquote class="lp-quote">
            "We had a Passport ready before our first viewing. The buyer's solicitor had
            everything they needed in a day. No surveys lost, no fall-through."
            <cite>— Aisha Patel, seller</cite>
          </blockquote>
        </div>
      </section>

      <!-- ───────────────────── MARKET (DARK) ───────────────────── -->
      <section id="market" class="lp-section lp-dark lp-market reveal" data-reveal>
        <div class="lp-shell lp-market-inner">
          <p class="lp-pill"><i class="lp-pill-ic" />Policy update · Upfront information is becoming mandatory</p>
          <h2 class="lp-h2 lp-h2--sans">UK home sales<br />are broken<span class="lp-q">.</span></h2>
          <p class="lp-lede lp-lede--wide">
            A third collapse before completion. The ones that survive take <span class="lp-hl">nearly six
            months</span> — almost all of it spent waiting for paperwork that could have been
            ready on day one.
          </p>

          <div class="lp-market-grid">
            <article class="lp-market-card">
              <strong>179<small>days</small></strong>
              <em>Average sale</em>
              <p>Offer accepted to completion. With a Passport: around 14.</p>
            </article>
            <article class="lp-market-card">
              <strong>1<small>in</small>3</strong>
              <em>Sales collapse</em>
              <p>Usually a problem surfaced weeks in — after both sides have spent thousands.</p>
            </article>
            <article class="lp-market-card">
              <strong>£2.7<small>k</small></strong>
              <em>Lost per fall-through</em>
              <p>Roughly £900m a year nationwide in wasted fees and stress.</p>
            </article>
          </div>

          <div class="lp-founder">
            <span class="lp-founder-av">M</span>
            <div>
              <p>"I've spent over 34 years in this industry, watching the same thing happen again and again. People lose homes they'd already moved into, lose deposits they couldn't afford to lose — because every answer they need only arrives <strong>after</strong> they've committed. <strong>None of it has to be like this.</strong> Surface the record on day one, and the whole rhythm of the sale changes."</p>
              <em>UMU's founder · 34 years in UK property</em>
            </div>
          </div>
        </div>
      </section>

      <!-- ─────────────────────────── CTA ─────────────────────────── -->
      <section id="reviews" class="lp-section lp-cta reveal" data-reveal>
        <div class="lp-shell lp-cta-inner">
          <p class="lp-eyebrow">Ready when you are</p>
          <h2 class="lp-h2 lp-h2--sans lp-cta-title">Start with a free HomeScore.<br />Sell like Aisha did<span class="lp-q">.</span></h2>
          <p class="lp-lede">
            See what your home tells you in 60 seconds. <span class="lp-hl-dark">Upgrade to a Property Passport</span>
            when you're ready to list — and <span class="lp-hl-dark">stay in control</span> the whole way.
          </p>
          <div class="lp-cta-actions">
            <button class="lp-btn lp-btn--solid lp-btn--lg" type="button" @click="goToHomeScore">Get my free HomeScore</button>
            <button class="lp-btn lp-btn--ghost-dark lp-btn--lg lp-btn--icon" type="button" @click="navigateTo('/passport/sample')"><OPIcon name="passport" class="lp-btn-ic" />See a sample Passport</button>
          </div>
          <p class="lp-cta-foot">No card needed · Free HomeScore · Property Passport from day one</p>
        </div>
      </section>

      <!-- ─────────────────────────── FOOTER ─────────────────────────── -->
      <footer class="lp-footer">
        <div class="lp-shell lp-footer-grid">
          <div class="lp-footer-intro">
            <div class="lp-footer-brand">
              <OPIcon name="logo" class="lp-brand-logo" />
              <strong>umovingu</strong>
            </div>
            <p>The consumer-side property passport. Free HomeScore, solicitor-grade Passport, ready before your first viewing.</p>
            <div class="lp-footer-chips">
              <span>OPDA standard</span>
              <span>Property Redress Scheme</span>
              <span>HM Land Registry</span>
            </div>
          </div>

          <div class="lp-footer-col">
            <h5>Product</h5>
            <button type="button" @click="navigateTo('/homescore')">HomeScore</button>
            <button type="button" @click="navigateTo('/passport/collections')">Property Passport</button>
            <button type="button" @click="navigateTo('/explore')">For landlords</button>
            <button type="button" @click="navigateTo('/explore')">For buyers</button>
          </div>

          <div class="lp-footer-col">
            <h5>Company</h5>
            <button type="button" @click="scrollToSection('story')">Our story</button>
            <button type="button" @click="scrollToSection('market')">Why we built it</button>
            <button type="button" @click="scrollToSection('reviews')">Reviews</button>
          </div>

          <div class="lp-footer-col">
            <h5>Get started</h5>
            <button type="button" @click="navigateTo('/homescore')">Free HomeScore</button>
            <button type="button" @click="navigateTo('/onboarding/signin')">Sign in</button>
            <button type="button" @click="navigateTo('/passport/sample')">Sample Passport</button>
          </div>
        </div>
        <div class="lp-shell lp-footer-bottom">© 2026 umovingu. All rights reserved.</div>
      </footer>
    </main>

    <transition name="cta-fade">
      <button v-if="showStickyCta" class="lp-sticky-cta" type="button" @click="goToStickyCtaDestination">
        {{ stickyCtaLabel }}
      </button>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import PropertySearchInput from '~/components/property/PropertySearchInput.vue'
import OPIcon from '~/components/ui/OPIcon.vue'

definePageMeta({})

const gaugeScore = 74
// Number shown inside the HomeScore ring — counts up from 0 → gaugeScore
// in step with the ring fill when the section first scrolls into view.
const displayScore = ref(0)
let scoreCounted = false

// Rotating "buyer's solicitor asks" questions — each shown for a few seconds
// then cross-faded to the next, looping forever.
const solicitorQuestions = [
  'Where are the title deeds?',
  'Who maintains the side boundary?',
  'FENSA certificate for the windows?',
  'Building regs for the loft conversion?',
  'Any disputes with the neighbours?',
]
const solicitorIndex = ref(0)
const currentQuestion = computed(() => solicitorQuestions[solicitorIndex.value])
let solicitorTimer: ReturnType<typeof setInterval> | null = null

// Shared timing so every animated number (and the ring) decelerates in step.
const COUNT_DURATION = 1400
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function runScoreCountUp() {
  if (scoreCounted || typeof window === 'undefined') return
  scoreCounted = true

  if (prefersReducedMotion()) {
    displayScore.value = gaugeScore
    return
  }

  const start = performance.now()
  const tick = (now: number) => {
    const t = Math.min((now - start) / COUNT_DURATION, 1)
    displayScore.value = Math.round(easeOutCubic(t) * gaugeScore)
    if (t < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

// Count up every [data-count] number inside a section, all sharing one start
// time so the values land together. data-prefix/-suffix/-decimals format it.
const countedNodes = new WeakSet<HTMLElement>()
function runCountUpIn(root: HTMLElement) {
  if (typeof window === 'undefined') return
  const nodes = Array.from(
    root.querySelectorAll<HTMLElement>('[data-count]'),
  ).filter((el) => !countedNodes.has(el))
  if (!nodes.length) return

  const targets = nodes.map((el) => {
    countedNodes.add(el)
    return {
      el,
      to: parseFloat(el.dataset.count || '0'),
      prefix: el.dataset.prefix || '',
      suffix: el.dataset.suffix || '',
      decimals: parseInt(el.dataset.decimals || '0', 10),
    }
  })

  const render = (tgt: (typeof targets)[number], value: number) => {
    tgt.el.textContent = `${tgt.prefix}${value.toFixed(tgt.decimals)}${tgt.suffix}`
  }

  if (prefersReducedMotion()) {
    targets.forEach((tgt) => render(tgt, tgt.to))
    return
  }

  const start = performance.now()
  const tick = (now: number) => {
    const t = Math.min((now - start) / COUNT_DURATION, 1)
    const eased = easeOutCubic(t)
    targets.forEach((tgt) => render(tgt, eased * tgt.to))
    if (t < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

const showStickyCta = ref(false)
const isCalmMode = ref(false)
const ctaVariant = ref<'A' | 'B'>('A')
const mobileMenuOpen = ref(false)

// Static illustrative content for the property ribbon. `house` picks one of
// the flat-illustration variants, `tone` the pastel backdrop, `kind` the tag
// style (passport = teal/tick, sold = amber/star, score = grey/search).
const stripHomes = [
  { score: 68, addr: '27 Eaton Place', area: 'Coventry · CV1', tag: 'HomeScore checked', kind: 'score', house: 'townhouse', tone: 1 },
  { score: 90, addr: '9 Briar Close', area: 'Kenilworth · CV8', tag: 'Passport ready', kind: 'passport', house: 'bungalow', tone: 2 },
  { score: 74, addr: '55 Woodfield Road', area: 'Coventry · CV5 6AJ', tag: 'Passport issued', kind: 'passport', house: 'block', tone: 1 },
  { score: 77, addr: '18 Kingsway', area: 'Leamington · CV31', tag: 'Passport ready', kind: 'passport', house: 'cottage', tone: 3 },
  { score: 85, addr: '3 Oak Lane', area: 'Warwick · CV34', tag: 'Sold in 18 days', kind: 'sold', house: 'detached', tone: 1 },
  { score: 81, addr: '41 Cedar Avenue', area: 'Coventry · CV6', tag: 'HomeScore checked', kind: 'score', house: 'gable', tone: 4 },
]

// Doubled list so the marquee can loop seamlessly.
const stripLoop = computed(() => [...stripHomes, ...stripHomes])

function scoreDot(score: number): string {
  if (score >= 80) return '#00a19a'
  if (score >= 70) return '#d99a2b'
  return '#8b8799'
}

// Two journeys behind the Without/With toggle. `n` is the dot number,
// `day` the label, `label` the step. The "with" path is the calm teal one,
// the "without" path is the slow maroon one (matches the reference).
const timelineWith = [
  { n: '-30', day: 'DAY -30', label: 'Passport ready' },
  { n: '0', day: 'DAY 0', label: 'Offer accepted' },
  { n: '2', day: 'DAY 2', label: 'Solicitor reviews record' },
  { n: '11', day: 'DAY 11', label: 'Exchange' },
  { n: '14', day: 'DAY 14', label: 'Completion' },
]
const timelineWithout = [
  { n: '0', day: 'DAY 0', label: 'Offer accepted' },
  { n: '21', day: 'DAY 21', label: 'Survey reveals an issue' },
  { n: '47', day: 'DAY 47', label: 'Buyer renegotiates' },
  { n: '74', day: 'DAY 74', label: 'Pulls out — start again' },
  { n: '179', day: 'DAY 179', label: 'Eventual completion' },
]
const timelineMode = ref<'with' | 'without'>('without')
const timeline = computed(() =>
  timelineMode.value === 'with' ? timelineWith : timelineWithout,
)
// Big figure above the timeline — switches with the toggle.
const timelineHeadline = computed(() =>
  timelineMode.value === 'with'
    ? { days: '14', sub: 'offer to completion, with a Passport ready' }
    : { days: '179', sub: 'offer to completion — the UK average sale' },
)

let revealObserver: IntersectionObserver | null = null

const gaugeLabel = computed(() => {
  if (gaugeScore >= 80) return 'Excellent'
  if (gaugeScore >= 60) return 'Good'
  return 'Needs work'
})

const primaryCtaLabel = computed(() =>
  ctaVariant.value === 'A' ? 'Check HomeScore' : 'Start in 60 seconds',
)

const stickyCtaLabel = computed(() => 'Check your HomeScore')


function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function scrollToSection(id: string) {
  mobileMenuOpen.value = false
  const target = document.getElementById(id)
  if (!target) return
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function trackLandingEvent(eventName: string, payload: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  const eventData = {
    event: eventName,
    page: 'landing',
    ctaVariant: ctaVariant.value,
    ...payload,
    ts: Date.now(),
  }
  const win = window as Window & { dataLayer?: Array<Record<string, unknown>> }
  if (!Array.isArray(win.dataLayer)) {
    win.dataLayer = []
  }
  win.dataLayer.push(eventData)
  window.dispatchEvent(new CustomEvent('umu:analytics', { detail: eventData }))
}

function trackCtaClick(source: string, destination: string) {
  trackLandingEvent('landing_cta_click', { source, destination })
}

function goToHomeScore() {
  goToHomeScoreFrom('general_cta')
}

function goToHomeScoreFrom(source: string) {
  trackCtaClick(source, '/homescore')
  navigateTo('/homescore')
}

function onHomeScoreResultSelect(property: { id: string }) {
  trackLandingEvent('landing_homescore_search_select', {
    source: 'hero_search',
    propertyId: property.id,
  })
  navigateTo(`/homescore/${property.id}`)
}

function onHomeScoreSearchEnter(_q: string) {
  // PropertySearchInput opens/selects from dropdown on enter, mirroring /homescore.
}

function onHomeScoreCheckClick() {
  trackLandingEvent('landing_homescore_search_check_click', {
    source: 'hero_search',
  })
  const input = document.querySelector<HTMLInputElement>('.lp-hero-search input')
  input?.focus()
}

function goToStickyCtaDestination() {
  goToHomeScoreFrom('sticky_cta')
}

function onWindowScroll() {
  if (typeof window === 'undefined') return
  const threshold = window.innerWidth <= 760 ? 320 : 520
  showStickyCta.value = window.scrollY > threshold
  isCalmMode.value = window.scrollY > 760
}

function initCtaVariant() {
  if (typeof window === 'undefined') return
  const key = 'umu_landing_cta_variant'
  const saved = window.localStorage.getItem(key)
  if (saved === 'A' || saved === 'B') {
    ctaVariant.value = saved
    return
  }
  const assigned = Math.random() >= 0.5 ? 'B' : 'A'
  ctaVariant.value = assigned
  window.localStorage.setItem(key, assigned)
}

function trackVariantExposure() {
  if (typeof window === 'undefined') return
  const key = `umu_landing_exposure_${ctaVariant.value}`
  if (window.sessionStorage.getItem(key)) return
  window.sessionStorage.setItem(key, '1')
  trackLandingEvent('landing_cta_variant_exposure', {
    variant: ctaVariant.value,
  })
}

onMounted(() => {
  if (typeof window === 'undefined') return

  initCtaVariant()
  trackVariantExposure()

  if ('IntersectionObserver' in window) {
    const sections = document.querySelectorAll<HTMLElement>('[data-reveal]')
    revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            // Kick off the ring count-up + any [data-count] numbers in this
            // section the first time it scrolls into view (all synchronized).
            if (entry.target.id === 'homescore') runScoreCountUp()
            runCountUpIn(entry.target as HTMLElement)
          }
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px',
      },
    )

    sections.forEach((section) => revealObserver?.observe(section))
  }

  onWindowScroll()
  window.addEventListener('scroll', onWindowScroll, { passive: true })

  // Cycle the solicitor question every 3.2s.
  solicitorTimer = setInterval(() => {
    solicitorIndex.value = (solicitorIndex.value + 1) % solicitorQuestions.length
  }, 3200)
})

onUnmounted(() => {
  revealObserver?.disconnect()
  revealObserver = null
  window.removeEventListener('scroll', onWindowScroll)
  if (solicitorTimer) clearInterval(solicitorTimer)
})
</script>

<style scoped>
.lp {
  --navy: #231d45;
  --navy-2: #2c2456;
  --teal: #00a19a;
  --teal-dark: #00857f;
  --teal-bright: #2fd0c6;
  --ink: #231d45;
  --ink-soft: #5a5570;
  --ink-faint: #8b8799;
  --line: #ececf2;
  --bg: #f3f2ef;
  --card: #ffffff;
  --serif: 'Plus Jakarta Sans', sans-serif;

  position: relative;
  min-height: 100dvh;
  color: var(--ink);
  background: var(--bg);
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  /* `clip` prevents horizontal overflow without creating a scroll container,
     which would break the sticky navbar (as `overflow-x: hidden` does). */
  overflow-x: clip;
}

.lp-shell {
  width: min(1120px, calc(100% - 48px));
  margin: 0 auto;
}

/* ── Shared bits ─────────────────────────────────────────────────── */
.lp-serif { font-family: var(--serif); font-weight: 500; }
.lp-serif-italic { font-family: var(--serif); font-style: italic; font-weight: 500; color: var(--teal); }

.lp-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  /* margin: 0 0 18px; */
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 1.75px;
  text-transform: uppercase;
  color: #00a19a;
}
.lp-eyebrow--teal { color: var(--teal-bright); }

.lp-h2 {
  margin: 0 0 16px;
  font-family: var(--serif);
  font-weight: 500;
  font-size: clamp(30px, 4vw, 46px);
  line-height: 1.04;
  letter-spacing: -0.4px;
  color: var(--ink);
}
/* Heavy sans variant (matches the bold headline style) */
.lp-h2--sans {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 800;
  font-size: clamp(32px, 3.6vw, 50px);
  letter-spacing: -.025em;
  /* Looser leading + tiny vertical padding so ascenders/descenders of the
     heavy 800 weight aren't visually clipped where the two lines meet. */
  line-height: 1.15;
  padding: 0.06em 0;
}
.lp-q { color: var(--teal); }

.lp-lede {
  margin: 15px 0 26px;
  font-size: 18px;
  line-height: 1.65;
  color: #a7a1c2;
  max-width: 46ch;
}
.lp-lede--wide { max-width: 60ch; }

.lp-tick {
  display: inline-block;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--teal);
  position: relative;
  flex-shrink: 0;
}
.lp-tick::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 2.5px;
  width: 3.5px;
  height: 6px;
  border: solid #fff;
  border-width: 0 1.6px 1.6px 0;
  transform: rotate(45deg);
}

/* ── Buttons ─────────────────────────────────────────────────────── */
.lp-btn {
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 11px 18px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
  white-space: nowrap;
}
.lp-btn--lg { padding: 14px 22px; font-size: 15px; }
.lp-btn--icon { display: inline-flex; align-items: center; gap: 8px; }
.lp-btn-ic { width: 17px; height: 17px; }
.lp-btn--block { width: 100%; }
.lp-btn--solid {
  background: var(--teal);
  color: #fff;
  box-shadow: 0 10px 22px rgba(0, 161, 154, 0.26);
}
.lp-btn--solid:hover { transform: translateY(-1px); background: var(--teal-dark); }
.lp-btn--navy {
  background: var(--navy);
  color: #fff;
  box-shadow: 0 10px 22px rgba(35, 29, 69, 0.22);
}
.lp-btn--navy:hover { transform: translateY(-1px); background: var(--navy-2); }
.lp-btn--ghost {
  background: #fff;
  color: var(--ink);
  border-color: var(--line);
}
.lp-btn--ghost:hover { border-color: var(--teal); }
.lp-btn--ghost-dark {
  background: transparent;
  color: #fff;
  border-color: rgba(255, 255, 255, 0.28);
}
.lp-btn--ghost-dark:hover { border-color: #fff; }

/* ── Navbar ──────────────────────────────────────────────────────── */
.lp-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(243, 242, 239, 0.86);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(35, 29, 69, 0.07);
}
.lp-nav-inner {
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.lp-brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  border: 0;
  background: transparent;
  cursor: pointer;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.4px;
  color: var(--navy);
}
.lp-brand-logo { width: 26px; height: 26px; color: var(--teal); }
.lp-brand-img { height: 34px; width: auto; display: block; object-fit: contain; }
.lp-brand-name { font-size: 17px; font-weight: 800; letter-spacing: -0.4px; color: var(--navy); }
.lp-brand-beta {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--teal-dark);
  background: rgba(0, 161, 154, 0.1);
  border: 1px solid rgba(0, 161, 154, 0.3);
  border-radius: 6px;
  padding: 2px 7px;
  margin-left: 2px;
}
.lp-nav-links { display: flex; gap: 4px; }
.lp-nav-links button {
  border: 0;
  background: transparent;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-soft);
  padding: 8px 12px;
  border-radius: 9px;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}
.lp-nav-links button:hover { color: var(--navy); background: rgba(35, 29, 69, 0.05); }
.lp-nav-actions { display: inline-flex; align-items: center; gap: 10px; }

/* Hamburger — hidden on desktop, shown ≤960px */
.lp-nav-burger {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
  padding: 0;
}
.lp-nav-burger span,
.lp-nav-burger span::before,
.lp-nav-burger span::after {
  content: '';
  display: block;
  width: 18px;
  height: 2px;
  border-radius: 2px;
  background: var(--navy);
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.lp-nav-burger span { position: relative; }
.lp-nav-burger span::before { position: absolute; top: -6px; }
.lp-nav-burger span::after { position: absolute; top: 6px; }
.lp-nav-burger span.open { background: transparent; }
.lp-nav-burger span.open::before { top: 0; transform: rotate(45deg); }
.lp-nav-burger span.open::after { top: 0; transform: rotate(-45deg); }

/* Mobile dropdown menu */
.lp-mobile-menu {
  display: none;
  border-top: 1px solid rgba(35, 29, 69, 0.07);
  background: rgba(243, 242, 239, 0.97);
  backdrop-filter: blur(12px);
  padding: 8px 0 14px;
}
.lp-mobile-menu .lp-shell { display: flex; flex-direction: column; }
.lp-mobile-menu button {
  border: 0;
  background: transparent;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  color: var(--navy);
  text-align: left;
  padding: 13px 4px;
  cursor: pointer;
  border-bottom: 1px solid rgba(35, 29, 69, 0.06);
}
.lp-mobile-menu button:last-child { border-bottom: 0; }
.lp-mobile-signin { color: var(--teal-dark) !important; font-weight: 700 !important; }

.lp-menu-enter-active, .lp-menu-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.lp-menu-enter-from, .lp-menu-leave-to { opacity: 0; transform: translateY(-8px); }

/* ── Hero ────────────────────────────────────────────────────────── */
/* The `reveal` animation puts a `transform` on every section, which makes each
   section its own stacking context. Without an explicit z-index the hero would
   sit *below* the following sections, so the search dropdown (rendered inside
   the hero) gets painted over — and clipped — by the grey property strip right
   underneath it. Lifting the hero above the later sections lets the dropdown
   overlay them at full height. Stays below the sticky navbar (z-index: 50). */
.lp-hero { position: relative; z-index: 20; padding: 56px 0 64px; }
.lp-hero-grid {
  display: grid;
  grid-template-columns: 1.02fr 0.98fr;
  gap: 56px;
  align-items: center;
}
.lp-hero-title {
  margin: 0 0 24px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 800;
  font-size: clamp(44px, 5.8vw, 76px);
  line-height: 0.98;
  letter-spacing: -2.4px;
  color: var(--navy);
}
.lp-hero-accent { color: var(--teal); }
.lp-dot { color: var(--teal); }
.lp-hero-sub {
  margin: 0 0 26px;
  font-size: 19px;
  line-height: 1.7;
  color: var(--ink-soft);
  max-width: 50ch;
}
.lp-hero-sub strong { color: var(--navy); font-weight: 700; }

.lp-hero-cta { margin-bottom: 20px; }
.lp-hero-cta .lp-btn--lg { padding: 15px 26px; font-size: 16px; }
.lp-hero-search {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  max-width: 500px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 7px 7px 7px 16px;
  box-shadow: 0 14px 34px rgba(35, 29, 69, 0.08);
}
.lp-hero-search-field {
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
}
.lp-hero-search-field .lp-pin {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--ink-faint);
  z-index: 2;
  pointer-events: none;
}
/* Let the results dropdown escape the narrow input field and align to the
   full search pill (matches the /homescore search), instead of stopping
   short before the CTA button. */
.lp-hero-search-field :deep(.psi-wrap) { position: static; width: 100%; }
.lp-hero-search :deep(.psi-drop) {
  left: 0;
  right: 0;
  width: auto;
  top: calc(100% + 8px);
}
.lp-hero-search-field :deep(.psi-input) {
  min-height: 44px;
  border: 0 !important;
  border-radius: 10px;
  padding-left: 28px;
  background: transparent;
  font-size: 14.5px;
  box-shadow: none;
}
.lp-hero-search-field :deep(.psi-input:focus) { border: 0 !important; background: transparent; }
.lp-hero-search-field :deep(.psi-icon) { display: none; }
.lp-hero-search .lp-btn { flex-shrink: 0; box-shadow: none; }

.lp-hero-ticks {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}
.lp-hero-ticks li {
  position: relative;
  padding-left: 16px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink-faint);
}
.lp-hero-ticks li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--teal);
}

/* Hero visual / passport card */
.lp-hero-visual {
  position: relative;
  min-height: 360px;
}
.lp-passport-card {
  position: relative;
  z-index: 1;
  background: linear-gradient(160deg, #2c2456 0%, #231d45 60%, #1c1838 100%);
  border-radius: 22px;
  padding: 30px 28px;
  color: #fff;
  box-shadow: 0 36px 80px rgba(35, 29, 69, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  max-width: 380px;
  margin-left: auto;
  transform: rotate(6deg);
  /* Gentle continuous rotate so the card feels alive. */
  animation: lp-passport-sway 6s ease-in-out infinite;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
/* On hover: straighten, lift and deepen the shadow; the two badges drift
   outward so the layered stack reads as in the reference image. */
.lp-hero-visual:hover .lp-passport-card {
  animation-play-state: paused;
  transform: rotate(0deg) translateY(-6px) scale(1.02);
  box-shadow: 0 46px 100px rgba(35, 29, 69, 0.5);
}
.lp-badge { transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
.lp-hero-visual:hover .lp-badge--solicitor { transform: translate(8px, -8px) rotate(-1deg); }
.lp-hero-visual:hover .lp-badge--score { transform: translate(-8px, 8px) rotate(1deg); }

@keyframes lp-passport-sway {
  0%, 100% { transform: rotate(6deg); }
  50% { transform: rotate(3.5deg); }
}
.lp-passport-kicker {
  display: inline-block;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 1.3px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}
.lp-passport-logo {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(0, 161, 154, 0.12);
  border: 2px solid var(--teal-bright);
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.12);
  display: grid;
  place-items: center;
  margin: 14px 0 18px;
}
.lp-passport-logo-mark { width: 28px; height: auto; display: block; }
.lp-passport-addr strong { display: block; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
.lp-passport-addr span { font-size: 13px; color: rgba(255, 255, 255, 0.55); }
.lp-passport-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 22px 0 20px;
  padding: 20px 0 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.lp-passport-stats b { display: block; font-size: 26px; font-weight: 800; color: var(--teal-bright); }
.lp-passport-stats small { font-size: 13px; color: rgba(255, 255, 255, 0.4); font-weight: 600; }
.lp-passport-stats span { font-size: 10.5px; color: rgba(255, 255, 255, 0.5); letter-spacing: 0.5px; text-transform: uppercase; }
.lp-passport-issued {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 8px;
  background: rgba(0, 161, 154, 0.2);
  border: 1px solid rgba(0, 161, 154, 0.45);
  color: var(--teal-bright);
  font-size: 12px;
  font-weight: 700;
  padding: 7px 12px;
  border-radius: 9px;
}

/* HomeScore content inside the dark hero card (ring + compare rows + note) */
.lp-hs-top {
  display: grid;
  grid-template-columns: 104px 1fr;
  gap: 18px;
  align-items: center;
  margin: 20px 0 18px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.lp-hs-ring-wrap { position: relative; width: 104px; height: 104px; }
.lp-hs-ring { width: 100%; height: 100%; transform: rotate(-90deg); }
.lp-hs-ring-bg, .lp-hs-ring-meter { fill: none; stroke-width: 11; }
.lp-hs-ring-bg { stroke: rgba(255, 255, 255, 0.12); }
.lp-hs-ring-meter {
  stroke: var(--teal-bright);
  stroke-linecap: round;
  stroke-dasharray: 364;
  stroke-dashoffset: 95;
  animation: lp-hs-draw 1.4s cubic-bezier(0.25, 1, 0.3, 1) both;
}
@keyframes lp-hs-draw {
  from { stroke-dashoffset: 364; }
  to { stroke-dashoffset: 95; }
}
.lp-hs-center {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
}
.lp-hs-center strong { font-size: 34px; font-weight: 800; color: #fff; line-height: 1; letter-spacing: -1px; }
.lp-hs-center span { font-size: 9.5px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: var(--teal-bright); margin-top: 4px; }
.lp-hs-rows { list-style: none; margin: 0; padding: 0; }
.lp-hs-rows li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 12.5px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.lp-hs-rows li:first-child { padding-top: 0; }
.lp-hs-rows li:last-child { border-bottom: 0; padding-bottom: 0; }
.lp-hs-rows span { color: rgba(255, 255, 255, 0.6); line-height: 1.3; }
.lp-hs-rows b { color: #fff; font-weight: 700; text-align: right; }
.lp-hs-rows b.up { color: var(--teal-bright); }
.lp-hs-rows b.warn { color: #e6a94e; }
.lp-hs-note {
  display: flex;
  gap: 12px;
  align-items: center;
  background: rgba(0, 161, 154, 0.12);
  border: 1px solid rgba(0, 161, 154, 0.3);
  border-radius: 14px;
  padding: 14px;
}
.lp-hs-note-ic {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--teal-bright);
  color: #10233f;
  display: grid;
  place-items: center;
}
.lp-hs-note-ic svg { width: 15px; height: 15px; }
.lp-hs-note p {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.72);
}
.lp-hs-note p strong { color: #fff; font-weight: 800; }
@media (prefers-reduced-motion: reduce) {
  .lp-hs-ring-meter { animation: none; }
}
.lp-passport-progress-head {
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
}
.lp-passport-track { height: 6px; border-radius: 999px; background: rgba(255, 255, 255, 0.12); overflow: hidden; }
.lp-passport-track i { display: block; height: 100%; background: var(--teal); border-radius: 999px; }

.lp-badge {
  position: absolute;
  background: #fff;
  border-radius: 14px;
  padding: 14px 16px;
  box-shadow: 0 18px 40px rgba(35, 29, 69, 0.16);
  border: 1px solid var(--line);
  z-index: 2;
}
.lp-badge--solicitor {
  top: -30px;
  right: -26px;
  max-width: 224px;
}
.lp-badge-eyebrow {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 8px;
}
.lp-badge-pip {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d99a2b;
}
/* Reserve room for the tallest (two-line) question so the badge height
   stays steady as questions cross-fade. */
.lp-badge-q-wrap {
  display: flex;
  align-items: flex-start;
  min-height: 38px;
  margin-bottom: 10px;
}
.lp-badge-q {
  display: block;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--navy);
  line-height: 1.35;
}
.lp-q-fade-enter-active,
.lp-q-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.lp-q-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.lp-q-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
.lp-badge-line {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin-top: 2px;
  font-size: 12px;
  font-weight: 700;
  color: var(--teal-dark);
  line-height: 1.4;
}
.lp-badge-line .lp-tick {
  margin-top: 2px;
}
.lp-badge--score {
  bottom: -6px;
  left: -22px;
  display: flex;
  flex-direction: column;
  min-width: 150px;
}
.lp-badge--score .lp-badge-eyebrow { margin-bottom: 4px; }
.lp-badge--score strong { font-size: 28px; font-weight: 800; color: var(--navy); line-height: 1; }
.lp-badge--score small { font-size: 13px; color: var(--ink-faint); font-weight: 600; }
.lp-badge-score-sub { font-size: 11.5px; color: var(--teal-dark); font-weight: 700; margin-top: 3px; }

.lp-float-a { animation: lp-float 9s ease-in-out infinite; }
.lp-float-b { animation: lp-float 7s ease-in-out infinite; }
.lp-float-c { animation: lp-float 8s ease-in-out infinite 0.5s; }
/* Pause the float so the hover transform on the badges isn't overridden. */
.lp-hero-visual:hover .lp-float-b,
.lp-hero-visual:hover .lp-float-c { animation-play-state: paused; }

/* ── Property strip ──────────────────────────────────────────────── */
.lp-strip { padding: 26px 0 40px; background: #efeeea; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.lp-strip-eyebrow {
  display: inline-flex; align-items: center; gap: 9px;
  margin: 0 0 4px; font-size: 11px; font-weight: 800; letter-spacing: 1.4px;
  text-transform: uppercase; color: var(--teal-dark);
  justify-content: center; width: 100%;
}
.lp-strip-sub { text-align: center; font-size: 12.5px; color: var(--ink-faint); margin: 0 0 26px; }

/* Marquee viewport with edge fade-out. */
.lp-strip-viewport {
  position: relative;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
}
.lp-strip-track {
  display: flex;
  gap: 16px;
  width: max-content;
  padding: 6px 8px;
  animation: lp-marquee 42s linear infinite;
  will-change: transform;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
}
.lp-strip-viewport:hover .lp-strip-track { animation-play-state: paused; }

.lp-strip-card {
  flex: 0 0 248px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 10px 26px rgba(35, 29, 69, 0.06);
}
.lp-strip-media {
  position: relative;
  height: 120px;
  display: grid;
  place-items: end center;
}
.lp-strip-media.tone-1 { background: #dde9ec; }
.lp-strip-media.tone-2 { background: #d9efe9; }
.lp-strip-media.tone-3 { background: #efe0e2; }
.lp-strip-media.tone-4 { background: #ece6f0; }
.lp-house { width: 132px; height: 84px; display: block; }
.lp-strip-score {
  position: absolute;
  top: 10px;
  right: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 800;
  color: var(--navy);
  box-shadow: 0 4px 12px rgba(35, 29, 69, 0.1);
}
.lp-score-dot { width: 7px; height: 7px; border-radius: 50%; }
.lp-strip-score small { font-size: 9px; color: var(--ink-faint); font-weight: 700; }
.lp-strip-body { padding: 14px 16px 16px; }
.lp-strip-body strong { display: block; font-size: 14.5px; font-weight: 700; color: var(--navy); }
.lp-strip-body span { display: block; font-size: 12px; color: var(--ink-faint); margin: 3px 0 11px; }
.lp-strip-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 700;
  font-style: normal;
  padding: 5px 11px;
  border-radius: 999px;
}
.lp-strip-tag svg { width: 13px; height: 13px; }
.lp-strip-tag.is-passport { background: #e3f3f0; color: var(--teal-dark); }
.lp-strip-tag.is-sold { background: #f6ecd9; color: #9a7c3f; }
.lp-strip-tag.is-score { background: #ecebf1; color: #6b6783; }

@keyframes lp-marquee {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}
.calm-mode .lp-strip-track { animation-play-state: paused; }

/* ── Sections / split layout ─────────────────────────────────────── */
.lp-section { padding: 78px 0; }
.lp-split { display: grid; grid-template-columns: 1fr 1.06fr; gap: 56px; align-items: center; }
.lp-copy { min-width: 0; }
.lp-card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 22px;
  box-shadow: 0 20px 48px rgba(35, 29, 69, 0.08);
}

/* Score card */
.lp-score-card {
  padding: 30px 28px;
  display: grid;
  gap: 22px;
  position: relative;
  border-radius: 24px;
}
.lp-score-top {
  display: grid;
  grid-template-columns: 132px 1fr;
  gap: 26px;
  align-items: center;
}
.lp-score-ring-wrap { position: relative; width: 128px; height: 128px; }
.lp-score-ring { width: 100%; height: 100%; transform: rotate(-90deg); }
.lp-ring-bg, .lp-ring-meter { fill: none; stroke-width: 12; }
.lp-ring-bg { stroke: #e7e5ee; }
.lp-ring-meter {
  stroke: var(--teal);
  stroke-linecap: round;
  stroke-dasharray: 364;
  /* Start empty; the ring "draws" to ~74% when the section reveals. */
  stroke-dashoffset: 364;
  transition: stroke-dashoffset 1.4s cubic-bezier(0.25, 1, 0.3, 1);
}
/* When the section scrolls into view, fill the meter to ~74%. */
.reveal.is-visible .lp-ring-meter { stroke-dashoffset: 95; }
@media (prefers-reduced-motion: reduce) {
  .lp-ring-meter { transition: none; stroke-dashoffset: 95; }
}
.lp-score-center {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
}
.lp-score-center strong { font-size: 40px; font-weight: 800; color: var(--navy); line-height: 1; letter-spacing: -1px; }
.lp-score-center span { font-size: 10.5px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: var(--teal-dark); margin-top: 4px; }
.lp-score-rows { list-style: none; margin: 0; padding: 0; }
.lp-score-rows li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 13.5px;
  padding: 11px 0;
  border-bottom: 1px solid var(--line);
}
.lp-score-rows li:first-child { padding-top: 0; }
.lp-score-rows li:last-child { border-bottom: 0; padding-bottom: 0; }
.lp-score-rows span { color: var(--ink-soft); line-height: 1.3; }
.lp-score-rows b { color: var(--navy); font-weight: 700; text-align: right; }
.lp-score-rows b.up { color: var(--teal-dark); }
.lp-score-rows b.warn { color: #c98a3a; }
.lp-score-note {
  display: flex;
  gap: 13px;
  align-items: center;
  background: #eaf6f3;
  border: 1px solid #cfe9e2;
  border-radius: 16px;
  padding: 16px;
}
.lp-score-note-ic {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--teal);
  color: #fff;
  display: grid;
  place-items: center;
}
.lp-score-note-ic svg { width: 16px; height: 16px; }
.lp-score-note p {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.55;
  color: var(--teal-dark);
}
.lp-score-note p strong { color: var(--navy); font-weight: 800; }

/* Steps */
.lp-steps { list-style: none; margin: 36px 0 40px; padding: 0; display: grid; gap: 30px; }
.lp-steps li { display: grid; grid-template-columns: 30px 1fr; gap: 18px; align-items: start; }
.lp-step-n {
  width: 28px; height: 28px; border-radius: 9px;
  display: grid; place-items: center;
  background: var(--navy); color: var(--teal-bright);
  font-size: 13px; font-weight: 800;
}
.lp-steps strong { display: block; font-size: 15px; color: var(--navy); margin-bottom: 6px; }
.lp-steps p { margin: 0; font-size: 13.5px; line-height: 1.6; color: var(--ink-soft); }

/* ── Dark sections ───────────────────────────────────────────────── */
.lp-dark { background: var(--navy); color: #fff; }
.lp-dark .lp-h2 { color: #fff; }
.lp-dark .lp-h2 .lp-q { color: var(--teal-bright); }
.lp-dark .lp-lede { color: rgba(255, 255, 255, 0.68); }
.lp-hl { color: var(--teal-bright); font-weight: 600; }

/* Passport split: narrower copy, card top-aligned with the left copy so the
   two columns read as a balanced, top-aligned pair (matches design). */
.lp-split--passport {
  grid-template-columns: 1fr 1.05fr;
  gap: 56px;
  /* Pin both columns to the top so the card sits next to the heading
     instead of being vertically centered against the taller copy column. */
  align-items: start;
}
.lp-split--passport .lp-copy { align-self: start; }
.lp-dark-card-col {
  display: flex;
  align-self: start;          /* don't stretch to the copy column's height */
  align-items: flex-start;
  justify-content: flex-end;  /* push the card to the right of its column */
  /* Drop the card down so its top lines up with the lede paragraph
     (below the eyebrow + two-line heading), as in the design. */
  margin-top: 132px;
}
.lp-feature-tiles {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  /* margin-bottom: 22px; */
  /* margin-top:162px */
}
.lp-feature-tiles > div {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 14px;
  padding: 16px;
}
.lp-ft-ic {
  display: inline-flex; width: 30px; height: 30px; border-radius: 9px;
  background: rgba(0, 161, 154, 0.18); color: var(--teal-bright);
  align-items: center; justify-content: center; margin-bottom: 10px;
}
.lp-ft-ic svg { width: 17px; height: 17px; }
.lp-feature-tiles strong { display: block; font-size: 14px; color: #fff; margin-bottom: 4px; }
.lp-feature-tiles p { margin: 0; font-size: 12px; line-height: 1.5; color: rgba(255, 255, 255, 0.6); }
.lp-dark-foot { font-size: 13.5px; font-weight: 700; color: #c18a38; margin-top: 30px; gap: 8px; display: inline-flex; align-items: center; }
.lp-star { color: #c18a38; }

.lp-dark-card {
  background: #fff;
  width: 100%;
  max-width: 480px;
  padding: 20px;
  border-radius: 24px;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.28);
}
/* Navy header bar inside the card */
.lp-dark-card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  background: var(--navy);
  border-radius: 16px;
  padding: 18px 20px;
}
.lp-dark-card-head strong { display: block; font-size: 18px; font-weight: 800; color: #fff; }
.lp-dark-card-head span { font-size: 12.5px; color: rgba(255, 255, 255, 0.55); margin-top: 2px; display: block; }
.lp-issued {
  flex-shrink: 0;
  font-size: 10.5px; font-weight: 800; letter-spacing: 0.6px; text-transform: uppercase;
  background: rgba(217, 154, 43, 0.16); color: #e0a93f;
  border: 1px solid rgba(217, 154, 43, 0.4);
  padding: 5px 11px; border-radius: 8px;
}
.lp-dark-card-body {
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--ink-soft);
  text-align: center;
  margin: 18px 0 18px;
  padding: 0 10px;
}
.lp-dark-card-body .lp-hl { color: var(--teal-dark); font-weight: 700; }
.lp-dark-card .lp-btn--block { padding: 15px 18px; font-size: 15px; border-radius: 14px; }

/* ── Story ───────────────────────────────────────────────────────── */
.lp-story { text-align: center; }
.lp-story-eyebrow {
  font-size: 14px; font-weight: 600;
  color: #c18a38; margin: 0 0 14px; font-family: 'Plus Jakarta Sans';;
}
.lp-story-title {
  margin: 0 0 36px;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-style: normal;
  font-size: clamp(34px, 4.9vw, 58px);
  font-weight: 800;
  line-height: 1.04;
  letter-spacing: -.025em;
  color: var(--ink);
}
/* Teal accent inside the story title — upright bold sans, matching the image */
.lp-story-accent {
  font-family: inherit;
  font-style: normal;
  font-weight: 800;
  color: var(--teal);
}
.lp-story-stats {
  display: flex;
  width: fit-content;
  justify-content: center;
  margin: 0 auto 38px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: 0 14px 34px rgba(35, 29, 69, 0.06);
  overflow: hidden;
}
.lp-story-stats article {
  padding: 22px 34px;
  min-width: 168px;
}
.lp-story-stats article + article { border-left: 1px solid var(--line); }
.lp-story-stats strong { display: block; font-size: 40px; font-weight: 800; color: var(--navy); letter-spacing: -1.3px; }
.lp-story-stats strong.teal { color: var(--teal); }
.lp-story-stats span { font-size: 12.5px; color: var(--ink-soft); }

.lp-timeline-toggle {
  display: flex;
  width: fit-content;
  gap: 4px;
  margin-left: auto;
  margin-right: auto;
  padding: 5px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 999px;
  margin-bottom: 36px;
  box-shadow: 0 6px 18px rgba(35, 29, 69, 0.06);
}
.lp-timeline-toggle button {
  border: 0;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  color: var(--ink-soft);
  padding: 8px 18px;
  border-radius: 999px;
  cursor: pointer;
  background: transparent;
  transition: background 0.18s, color 0.18s;
}
.lp-timeline-toggle button.active { color: #fff; }
.lp-timeline-toggle.mode-with button.active { background: var(--teal); }
.lp-timeline-toggle.mode-without button.active { background: #a23a5b; }

/* Big figure above the timeline — colour follows the toggle state. */
.lp-tl-headline { text-align: center; margin: 0 0 36px; }
.lp-tl-headline strong {
  display: block;
  font-size: 56px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -2px;
}
.lp-tl-headline strong small {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: var(--ink-faint);
  margin-left: 6px;
}
.lp-tl-headline span { display: block; margin-top: 8px; font-size: 13px; color: var(--ink-soft); }
.lp-tl-headline.is-with strong { color: var(--teal); }
.lp-tl-headline.is-without strong { color: #a23a5b; }

.lp-timeline {
  display: flex;
  justify-content: space-between;
  position: relative;
  max-width: 720px;
  margin: 0 auto 44px;
}
/* Faded track — runs full-bleed past the first/last dots, like the image. */
.lp-timeline::before {
  content: '';
  position: absolute;
  top: 26px;
  left: -2%;
  right: -2%;
  height: 3px;
  background: rgba(162, 58, 91, 0.18);
  z-index: 0;
}
.lp-timeline.is-with::before { background: rgba(0, 161, 154, 0.16); }

/* Animated fill — draws from the start to the last dot when the section scrolls in. */
.lp-timeline::after {
  content: '';
  position: absolute;
  top: 26px;
  left: -2%;
  width: 0;
  height: 3px;
  background: #a23a5b;
  z-index: 0;
}
.lp-timeline.is-with::after { background: var(--teal); }
/* Keyframe (not transition) so it replays on every re-mount, including re-toggles.
   Linear + timed so the line reaches each dot exactly as it pops (0.25s → 1.45s). */
.reveal.is-visible .lp-timeline::after {
  animation: tlBarDraw 1.2s linear 0.25s forwards;
}
@keyframes tlBarDraw {
  from { width: 0; }
  to   { width: 104%; }
}
@media (prefers-reduced-motion: reduce) {
  .reveal.is-visible .lp-timeline::after { animation: none; width: 104%; }
}
.lp-timeline-step {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex: 1;
}
.lp-tl-dot {
  width: 54px; height: 54px; border-radius: 50%;
  background: #fff;
  display: grid; place-items: center;
  font-size: 17px; font-weight: 800;
  transition: all 0.2s;
}

/* Each dot pops in as the bar fill reaches it — keeps the line and dots in sync. */
.reveal.is-visible .lp-tl-dot {
  animation: tlDotIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}
.reveal.is-visible .lp-timeline-step:nth-child(1) .lp-tl-dot { animation-delay: 0.25s; }
.reveal.is-visible .lp-timeline-step:nth-child(2) .lp-tl-dot { animation-delay: 0.54s; }
.reveal.is-visible .lp-timeline-step:nth-child(3) .lp-tl-dot { animation-delay: 0.83s; }
.reveal.is-visible .lp-timeline-step:nth-child(4) .lp-tl-dot { animation-delay: 1.12s; }
.reveal.is-visible .lp-timeline-step:nth-child(5) .lp-tl-dot { animation-delay: 1.45s; }
@keyframes tlDotIn {
  0%   { opacity: 0; transform: scale(0.4); }
  100% { opacity: 1; transform: scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .reveal.is-visible .lp-tl-dot { animation: none; }
}
/* With UMU — calm teal */
.lp-timeline.is-with .lp-tl-dot { border: 2px solid #9fd6cf; color: var(--teal-dark); background: #fff; }
.lp-timeline.is-with .lp-timeline-step:last-child .lp-tl-dot { background: var(--teal); border-color: var(--teal); color: #fff; box-shadow: 0 0 0 6px rgba(0, 161, 154, 0.1); }
/* Without — slow maroon, deepening toward the painful end */
.lp-timeline.is-without .lp-tl-dot {
  border: 2px solid #d9a9b8;
  color: #a23a5b;
  background: #faf2f4;
  box-shadow: 0 0 0 5px rgba(162, 58, 91, 0.06);
}
.lp-timeline.is-without .lp-timeline-step:first-child .lp-tl-dot {
  color: var(--ink-faint);
  border-color: #e0dadd;
  background: #fff;
  box-shadow: none;
}
.lp-timeline.is-without .lp-timeline-step:last-child .lp-tl-dot {
  background: #7d2742;
  border-color: #7d2742;
  color: #fff;
  box-shadow: 0 0 0 6px rgba(125, 39, 66, 0.1);
}
.lp-timeline-step strong { font-size: 12.5px; font-weight: 800; letter-spacing: 0.5px; color: var(--navy); }
.lp-timeline-step > span { font-size: 14px; color: var(--ink-soft); text-align: center; max-width: 130px; line-height: 1.4; }

/* Labels fade up in step with their dot. */
.reveal.is-visible .lp-timeline-step strong,
.reveal.is-visible .lp-timeline-step > span {
  animation: tlLabelIn 0.5s ease backwards;
}
.reveal.is-visible .lp-timeline-step:nth-child(1) strong,
.reveal.is-visible .lp-timeline-step:nth-child(1) > span { animation-delay: 0.35s; }
.reveal.is-visible .lp-timeline-step:nth-child(2) strong,
.reveal.is-visible .lp-timeline-step:nth-child(2) > span { animation-delay: 0.64s; }
.reveal.is-visible .lp-timeline-step:nth-child(3) strong,
.reveal.is-visible .lp-timeline-step:nth-child(3) > span { animation-delay: 0.93s; }
.reveal.is-visible .lp-timeline-step:nth-child(4) strong,
.reveal.is-visible .lp-timeline-step:nth-child(4) > span { animation-delay: 1.22s; }
.reveal.is-visible .lp-timeline-step:nth-child(5) strong,
.reveal.is-visible .lp-timeline-step:nth-child(5) > span { animation-delay: 1.55s; }
@keyframes tlLabelIn {
  0%   { opacity: 0; transform: translateY(6px); }
  100% { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .reveal.is-visible .lp-timeline-step strong,
  .reveal.is-visible .lp-timeline-step > span { animation: none; }
}

.lp-quote {
  margin: 60px auto 0;
  font-family: plus-jakarta-sans,;
  font-style: normal;
  font-weight: 600;
  font-size: clamp(22px, 2.6vw, 30px);
  line-height: 1.4;
  /* letter-spacing: -.01em; */
  color: var(--navy);
  text-align: center;
  max-width: 760px;
  margin-inline: auto;
}
.lp-quote cite {
  display: block;
  margin-top: 16px;
  font-family: plus-jakarta-sans,;
  font-style: normal;
  font-size: 14px;
  font-weight: 700;
  margin-top: 20px;
  letter-spacing:.02em;
  color: #6f6a82;
}

/* ── Market ──────────────────────────────────────────────────────── */
.lp-market-inner { max-width: 880px; margin: 0 auto; }
.lp-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  font-weight: 700;
  color: #e0a93f;
  background: rgba(217, 154, 43, 0.12);
  border: 1px solid rgba(217, 154, 43, 0.34);
  border-radius: 999px;
  padding: 6px 13px;
  margin: 0 0 20px;
}
.lp-pill-ic {
  width: 11px; height: 11px; border-radius: 3px;
  border: 1.6px solid currentColor;
}
.lp-market-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 36px 0 24px;
}
.lp-market-card {
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 18px;
  padding: 24px;
}
.lp-market-card strong {
  display: block;
  font-size: 46px;
  font-weight: 800;
  letter-spacing: -1.8px;
  color: #fff;
  line-height: 1;
}
.lp-market-card strong small { font-size: 20px; font-weight: 600; color: rgba(255, 255, 255, 0.5); margin: 0 1px 0 4px; letter-spacing: 0; }
.lp-market-card em {
  display: block;
  font-style: normal;
  font-size: 13px;
  font-weight: 700;
  color: var(--teal-bright);
  margin: 12px 0 8px;
}
.lp-market-card p { margin: 0; font-size: 12.5px; line-height: 1.6; color: rgba(255, 255, 255, 0.55); }

.lp-founder {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 18px;
  padding: 24px 26px;
}
.lp-founder-av {
  flex-shrink: 0;
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--teal); color: #fff;
  display: grid; place-items: center;
  font-weight: 800;
}
.lp-founder p { margin: 0 0 10px; font-size: 14px; line-height: 1.7; color: rgba(255, 255, 255, 0.82); }
.lp-founder p strong { color: #fff; }
.lp-founder em { font-size: 12px; font-style: normal; font-weight: 700; color: var(--teal-bright); }

/* ── CTA ─────────────────────────────────────────────────────────── */
.lp-cta { text-align: center; background: #efeeea; }
.lp-cta-inner { max-width: 640px; margin: 0 auto; }
/* The title's two lines (set by an explicit <br>) are wider than the 640px
   lede column, so let the title break out and never auto-wrap mid-line. */
.lp-cta-title {
  margin-bottom: 16px;
  max-width: none;
  width: max-content;
  max-width: 100%;
  margin-inline: auto;
  white-space: nowrap;
}
.lp-cta .lp-lede { margin-inline: auto; }
.lp-hl-dark { color: var(--teal-dark); font-weight: 600; }
.lp-cta-actions { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin: 6px 0 18px; }
.lp-cta .lp-btn--ghost-dark { color: var(--navy); border-color: rgba(35, 29, 69, 0.2); }
.lp-cta .lp-btn--ghost-dark:hover { border-color: var(--navy); }
.lp-cta-foot { font-size: 12.5px; color: var(--ink-faint); margin: 0; }

/* ── Footer ──────────────────────────────────────────────────────── */
.lp-footer { background: var(--navy); color: #fff; padding: 56px 0 28px; }
.lp-footer-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 28px;
  padding-bottom: 36px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.lp-footer-brand { display: inline-flex; align-items: center; gap: 9px; margin-bottom: 14px; }
.lp-footer-brand .lp-brand-logo { color: var(--teal-bright); }
.lp-footer-brand strong { font-size: 18px; font-weight: 800; color: #fff; }
.lp-footer-intro p { font-size: 13px; line-height: 1.65; color: rgba(255, 255, 255, 0.6); margin: 0 0 16px; max-width: 34ch; }
.lp-footer-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.lp-footer-chips span {
  font-size: 10.5px; font-weight: 700; color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.16); border-radius: 7px; padding: 5px 9px;
}
.lp-footer-col h5 {
  margin: 2px 0 14px;
  font-size: 12px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}
.lp-footer-col button {
  display: block;
  border: 0; background: transparent;
  font-family: inherit; font-size: 13.5px; font-weight: 600;
  color: rgba(255, 255, 255, 0.78);
  padding: 0; margin-bottom: 11px; cursor: pointer;
  text-align: left;
  transition: color 0.15s;
}
.lp-footer-col button:hover { color: var(--teal-bright); }
.lp-footer-bottom {
  padding-top: 22px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
}

/* ── Sticky CTA ──────────────────────────────────────────────────── */
.lp-sticky-cta {
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 60;
  border: 0;
  border-radius: 999px;
  padding: 13px 22px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  background: var(--teal);
  box-shadow: 0 16px 34px rgba(0, 161, 154, 0.4);
  cursor: pointer;
}
.variant-b .lp-sticky-cta { background: #00a19a; box-shadow: 0 16px 34px rgba(0, 161, 154, 0.4); }

/* ── Reveal / animation ──────────────────────────────────────────── */
.reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal.is-visible { opacity: 1; transform: translateY(0); }
.calm-mode .lp-float-a, .calm-mode .lp-float-b, .calm-mode .lp-float-c { animation-play-state: paused; }

.cta-fade-enter-active, .cta-fade-leave-active { transition: opacity 0.22s ease, transform 0.22s ease; }
.cta-fade-enter-from, .cta-fade-leave-to { opacity: 0; transform: translateY(8px); }

@keyframes lp-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
  .lp-float-a, .lp-float-b, .lp-float-c, .lp-strip-track, .lp-passport-card { animation: none; }
}

/* ── Responsive ──────────────────────────────────────────────────── */
@media (max-width: 960px) {
  .lp-hero-grid, .lp-split, .lp-split--passport { grid-template-columns: 1fr; gap: 40px; }
  .lp-hero-visual { min-height: 320px; max-width: 420px; margin: 0 auto; }
  .lp-market-grid { grid-template-columns: 1fr; }
  .lp-dark-card-col { justify-content: flex-start; margin-top: 0; }
  .lp-dark-card { max-width: 100%; }
  .lp-footer-grid { grid-template-columns: 1fr 1fr; }

  /* Swap desktop links for the hamburger menu */
  .lp-nav-links { display: none; }
  .lp-nav-burger { display: inline-flex; }
  .lp-mobile-menu { display: block; }
  .lp-nav-signin { display: none; }
}

@media (max-width: 600px) {
  .lp-shell { width: calc(100% - 32px); }
  .lp-section { padding: 52px 0; }
  /* Let the CTA title wrap naturally on small screens instead of forcing
     the single-line width (which would overflow horizontally). */
  .lp-cta-title { white-space: normal; width: auto; }
  .lp-nav-inner { min-height: 60px; gap: 12px; }
  .lp-nav-actions { gap: 8px; }
  .lp-hero { padding: 36px 0 44px; }
  .lp-hero-search { flex-direction: column; align-items: stretch; padding: 10px; }
  /* Pill padding shrinks to 10px here — keep the pin aligned with the input,
     and anchor the dropdown to the field so it drops under the input rather
     than below the stacked CTA button. */
  .lp-hero-search-field { position: relative; }
  .lp-hero-search-field .lp-pin { left: 0; top: 50%; }
  .lp-hero-search .lp-btn { width: 100%; justify-content: center; }
  .lp-feature-tiles { grid-template-columns: 1fr; }

  /* Property strip — smaller cards + lighter shadow so the marquee stays
     smooth on mobile GPUs (heavy box-shadows are the main repaint cost). */
  .lp-strip-card { flex: 0 0 200px; box-shadow: 0 6px 16px rgba(35, 29, 69, 0.05); }

  /* On mobile the strip sits well below the 760px calm-mode scroll threshold,
     so calm-mode would freeze the marquee before it's ever in view. Keep it
     running so it scrolls like it does on large screens. */
  .calm-mode .lp-strip-track { animation-play-state: running; }
  .lp-strip-media { height: 100px; }
  .lp-house { width: 110px; height: 70px; }

  /* Hero data card — straighten + pull floating badges inside the viewport */
  .lp-hero-visual { max-width: 340px; min-height: 300px; padding: 18px 0; }
  .lp-passport-card { transform: none; margin: 0 auto; max-width: 320px; }
  .lp-badge--solicitor { top: -10px; right: 0; max-width: 200px; }
  .lp-badge--score { bottom: -10px; left: 0; }

  /* Keep the hero HomeScore ring + rows comfortable on narrow screens */
  .lp-hs-top { grid-template-columns: 88px 1fr; gap: 14px; }
  .lp-hs-ring-wrap { width: 88px; height: 88px; }
  .lp-hs-center strong { font-size: 30px; }

  /* HomeScore card — stack ring above the rows so it never squeezes */
  .lp-score-top { grid-template-columns: 1fr; gap: 20px; justify-items: center; }
  .lp-score-rows { width: 100%; }
  .lp-score-card { padding: 26px 20px; }

  /* Story stats — let the card shrink and wrap instead of overflowing */
  .lp-story-stats { width: 100%; max-width: 100%; flex-wrap: wrap; }
  .lp-story-stats article { flex: 1 1 33%; min-width: 0; padding: 16px 12px; }
  .lp-story-stats strong { font-size: 28px; }
  .lp-story-stats article + article { border-left: 0; }

  .lp-timeline-toggle { width: 100%; max-width: 100%; }
  .lp-timeline-toggle button { flex: 1; text-align: center; }
  .lp-timeline { flex-wrap: wrap; gap: 18px; }
  .lp-timeline::before { display: none; }
  .lp-timeline-step { flex: 0 0 28%; }

  .lp-footer-grid { grid-template-columns: 1fr 1fr; gap: 22px; }
}

@media (max-width: 400px) {
  .lp-shell { width: calc(100% - 24px); }
  .lp-hero-title { font-size: clamp(34px, 11vw, 42px); letter-spacing: -1.2px; }
  .lp-h2 { font-size: clamp(26px, 8vw, 30px); }
  .lp-story-stats { flex-direction: column; }
  .lp-story-stats article { flex: 1 1 auto; width: 100%; }
  .lp-story-stats article + article { border-top: 1px solid var(--line); }
  .lp-timeline-step { flex: 0 0 44%; }
  .lp-footer-grid { grid-template-columns: 1fr; gap: 24px; }
  .lp-cta-actions .lp-btn { width: 100%; }
}
</style>
