# Title Card Tees — Shopify theme

Shopify Online Store 2.0 theme for a title-card-inspired T-shirt brand that operates on a drop model (one drop live, six pieces, 250 of each, no restocks).

## Reference documents (gospel)

- `brand-guide-v3.html` — brand voice, color, type, typographic rules
- `logo-system-v3.html` — lockups, clear space, minimum sizes
- `homepage.html` — the homepage composition being ported

All theme decisions derive from these. Treat as source of truth.

## Structure

```
assets/
  base.css           brand tokens, shared utilities, responsive rules
  customer.css       account/login/register styles
  theme.js           countdown, cart drawer, AJAX add-to-cart, variant picker
config/
  settings_schema.json   current + next drop, manifesto copy, favicon/OG
  settings_data.json
layout/theme.liquid   head, fonts, OG tags, structured data
locales/en.default.json
sections/
  announcement-ticker.liquid   ticker with brand dot-separators
  header.liquid                nav locked to Shop · About · Bag
  header-group.json
  footer.liquid
  footer-group.json
  hero-airing.liquid          homepage hero with black now-airing card
  detail-strip.liquid         14oz · limited · numbered · ships 48h · returns
  drop-grid.liquid            six-piece grid, sold-out overlay, card colors
  manifesto.liquid            ink background, tangerine italic accent
  next-drop.liquid            countdown + single-email capture
  main-product.liquid         PDP with size pills, hangtag preview, specs
  main-cart.liquid            full cart page (JS-off fallback)
  cart-drawer-contents.liquid for AJAX drawer refreshes
  main-collection.liquid      redirects non-current drops to homepage
  main-list-collections.liquid "No archive. Just the drop."
  main-page.liquid / main-page-contact.liquid
  main-login / main-register / main-account.liquid
  main-search.liquid
  main-404.liquid             "Off the air."
snippets/
  logo-horizontal.liquid      primary lockup, 120px min
  logo-monogram.liquid        TCT mark for ≤120px
  logo-stacked.liquid         square formats
  squiggle.liquid             six-wave signature
  cart-drawer.liquid / cart-drawer-contents.liquid
  structured-data.liquid      Product + Organization JSON-LD
templates/
  index.json                  homepage: hero → detail → drop → manifesto → next
  product.json / cart.json / collection.json / list-collections.json
  page.json / page.contact.json
  search.json / 404.json
  customers/*.json + *.liquid
```

## Drop mechanic (how it's enforced)

1. **Theme setting `current_drop`** points to the active collection. The homepage `drop-grid` reads from it.
2. **`main-collection.liquid`** checks `collection.handle == settings.current_drop.handle`. If it doesn't match (or the collection is flagged `archived`), it shows "This drop is retired." and links back to homepage.
3. **`main-list-collections.liquid`** refuses to browse all collections — there is no archive.
4. **Nav** is hard-coded to Shop · About · Bag. No collection dropdown.
5. **Sold out** — each product card shows a SOLD OUT overlay driven by `product.available`.

## Metafields

See `METAFIELDS.md` for the full spec. You need to set these up in the Shopify admin before products will render correctly.

## Starter content

See `CONTENT.md` for brand-voice-approved page copy (About, How we drop, Sizing, Returns, Fabric, Contact, Accessibility, Shipping). Paste as-is into Pages.

## Deploy

```
shopify theme push --store=your-store.myshopify.com
```

The theme does not commit `settings_data.json` secrets. You'll want to set the favicon and og_image through the customizer.

## Voice rules

Forbidden in all user-facing copy: throwback, retro, vibes, IYKYK, 90s kids, epic/rad/totally awesome, "Remember this?", emoji. The theme does not lint copy — this is editorial discipline at data-entry time. The manifesto line "Not a throwback." is the one intentional use, because it's a rejection.

## What's left for the merchant

1. Create metafield definitions (see `METAFIELDS.md`)
2. Create collections: `saturday-morning`, `after-school`, etc. Set `tct.drop_status` on each.
3. Set `current_drop` in theme customizer to point to the live collection.
4. Create the six products under the live collection, fill metafields (`slot_time`, `run_position`, `run_size`, `card_color`, `short_desc`).
5. Upload product photography into product media (replaces the fallback title-card SVGs).
6. Create pages from `CONTENT.md`.
7. Set favicon (monogram) and OG image (1200×630 hero composition) in customizer.
8. Hook Klaviyo or Shopify Email to the `next-drop-reminder` customer tag.
