# Landing Page Redesign — "Premium Racetrack"

Date: 2026-06-16
Status: Approved (direction A), build in progress

## Goal
Redesign the Joki Umamusume landing page (`app/page.tsx` + section components) from
scratch. Keep all data flows and links intact; upgrade the visual system and structure.
Real images are deferred — every image slot is replaced by a labelled image-icon
placeholder (`ImagePlaceholder`) so we can drop in AI-generated art later.

## Direction: "Premium Racetrack"
Keep the pink Umamusume identity but elevate it to feel professional and trustworthy
(this is a paid service where customers worry about account safety). Playful + premium.

## Visual system (Tailwind v4, tokens in `app/globals.css` `@theme`)
- `primary` `#ff6b9c` (pink) — brand + primary CTA
- `primary-dark` `#e04e84`
- `accent` `#00D4AA` (teal/green, "racetrack") — **NEW: was referenced but never defined**
- `accent-dark` `#04b290`
- ink `#1d0c12` (plum-black) for headings
- `background-light` `#FFF8F0` (cream); white surfaces; soft pink tint for alternation
- Font: Plus Jakarta Sans (`--font-display`, already body+display); headings weight 800, tight tracking
- Effects: rounded-2xl/3xl, soft shadows, glassmorphism nav, radial gradient glows, diagonal
  speed-line accents, micro-interactions (hover scale ~1.02, card translate-y)
- Motion: 150–300ms, transform/opacity only, respect `prefers-reduced-motion`
- Icons: Material Symbols (already loaded) — consistent set, no emoji as icons

## Section structure (top → bottom)
1. **Navbar** — revamp; glassmorphism on scroll; CTAs "Pesan Sekarang" + "Cek Pesanan"
2. **Hero** — revamp; energetic headline + 🖼️ hero-art slot + 4-stat trust bar + dual CTA + speed-line bg
3. **Service Portal** — revamp; 2 premium cards (Joki Utama / Event & Extra) each with 🖼️ slot
4. **Why Pilih Kami** — NEW; quick trust-badge row (Manual, No VPN, No Bot, Garansi)
5. **Cara Kerja** — NEW; 3–4 step process (Pilih paket → Chat admin → Pengerjaan → Selesai+bukti)
6. **Safety** — revamp; keep 4 accordion points + 🖼️ illustration slot
7. **Testimonials** — revamp visuals; keep `useTestimonials` (Supabase) + Swiper + Drive button + payment methods
8. **Footer / CTA** — revamp; keep WA/Discord/Facebook contact block

## Components (units)
- `ImagePlaceholder` (new, reusable) — dashed/tinted box, centered image icon + label of needed image
- `ServicePortal` (new, extracted from inline `page.tsx`)
- `WhyUs` (new), `HowItWorks` (new)
- Revamp: `Navbar`, `Hero`, `Safety`, `Testimonials`, `Footer`

## Constraints / keep working
- Cart overlay (rendered by `Providers`), `/joki`, `/event`, `/track` links, WA/Discord/FB URLs,
  Drive testimoni link, payment methods, Supabase testimonials, SEO metadata.

## Out of scope
- Real image generation (deferred — use OGAI/nano-banana later)
- Admin/track/cart page redesigns (landing only)
