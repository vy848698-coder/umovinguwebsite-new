# legacy/

Superseded page files, kept rather than deleted. Nothing in here is routed —
Nuxt only builds routes from `pages/`, so these files are inert.

## dashboard-old-explore.vue

The original `pages/dashboard.vue`: the pre-redesign "Property Search" Explore
screen (hero + search drawer + action cards + recommended carousel).

It was already dead code before being moved here — a repo-wide grep for
`/dashboard` found no link to it from any page, component, composable or
middleware. The live role-aware dashboard had been built at `pages/explore.vue`
instead, which is what now occupies `pages/dashboard.vue`.
