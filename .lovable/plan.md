# Photography project pages — sectioned reveal scroll

Rework `PhotoLayout` so each photography project page (e.g. /photography/exposure, /photography/landfill-to-catwalk) reads as four full-viewport "pages" that snap/reveal one after another, matching the Portfolio-01 → 04 reference and the homepage's page-turn feel.

## Sections

1. **Cover** — full-viewport (`100svh`) hero. The featured image fills the frame edge-to-edge with a subtle dark gradient; the "Ra" wordmark sits top-left, menu button top-right, and the project title sits bottom-left in large display type (as in Portfolio-01). No auto-playing slideshow here — this is a static cover. Scrolling glides down to…
2. **Details** — a full-viewport light section holding the contextual info: SCOPE, LOCATION, YEAR (plus CREDITS only when collaborators exist), a divider, then the project write-up — laid out as in Portfolio-02. Scroll reveals…
3. **Gallery** — the existing cycling image frame with caption and thumbnail strip, re-fitted into its own full-viewport section so the active photo is comfortably framed (as in Portfolio-03).
4. **Footer** — the existing `SiteFooter` full-viewport page (Portfolio-04), unchanged.

## Scroll behaviour

- Each of the four sections is a full-viewport snap stop using the same behaviour already in `SiteFooter`/homepage: wheel gestures glide decisively to the next/previous section with a 600ms ease-in-out tween; slow scrolls settle onto the nearest stop; touch input cancels snaps so mobile stays natural.
- Backgrounds are clipped strictly to their own section — the dark cover and light details/gallery sections cover each other cleanly with no colour bleed at the seams.
- `prefers-reduced-motion` disables the snapping and parallax.

## Technical notes

- Extract the snap/glide logic from `SiteFooter` into a small shared hook (e.g. `useSnapSections` in `src/hooks/`) and use it for both the footer and the photography sections, so behaviour stays consistent with the homepage.
- All work is in `src/components/PhotoLayout.tsx` plus the new hook; project data (`src/data/photography.ts`) needs no changes.
- The header (Ra + menu button) remains visible on the cover; over light sections the fixed header inherits the existing light styling already used on these pages.
- Verify with a typecheck and a Playwright pass on /photography/exposure: cover fills the first viewport, one wheel gesture moves to Details, next to Gallery, then Footer.
