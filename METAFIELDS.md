# Metafield definitions — Title Card Tees

Create these in Shopify admin → Settings → Custom data. The theme reads from these namespaces; changing keys will break the display.

## Product metafields (namespace: `tct`)

| Key | Type | Required | Example | Purpose |
|-----|------|----------|---------|---------|
| `tct.slot_time` | single-line text | yes | `8:00 AM` | Programming slot shown on product card |
| `tct.run_position` | single-line text | yes | `01 / 06` | Position in the drop grid |
| `tct.run_size` | number (integer) | yes | `250` | Total units minted (per the "250 per piece" rule) |
| `tct.card_color` | single-line text (choice) | yes | `mustard` | One of: `mustard`, `teal`, `rose`, `ink`, `tangerine`, `cream` |
| `tct.short_desc` | single-line text | yes | `Mustard heavyweight tee. Cereal-box title card on the front.` | One-sentence card blurb |
| `tct.title_card_svg` | multi-line text (raw SVG) | optional | `<svg>…</svg>` | Title-card illustration. Leave blank to use product featured image. |
| `tct.fabric` | single-line text | optional | `14 oz heavyweight cotton` | Detail strip context |
| `tct.hangtag_prefix` | single-line text | optional | `042` | Shown in PDP hangtag preview as `042 / 250` |

## Collection metafields (namespace: `tct`)

Used on drop collections (Saturday Morning, After School, etc.).

| Key | Type | Required | Example | Purpose |
|-----|------|----------|---------|---------|
| `tct.drop_number` | single-line text | yes | `01` | Drop number (two digits) |
| `tct.drop_status` | single-line text (choice) | yes | `airing` | One of: `airing`, `next`, `soon`, `archived` |
| `tct.ritual_tagline` | single-line text | yes | `Saturday morning, properly dressed.` | Displayed under drop name |
| `tct.air_date` | date | optional | `2026-04-26` | Drop launch date |

## Shop-level metafields (optional — theme settings also cover these)

These live on the shop and are edited via theme customizer settings. See `config/settings_schema.json`.

## Email capture

The "Set reminder" form on the homepage posts to Shopify's native customer contact handler. New signups are created as customers tagged `next-drop-reminder` + `drop-{number}`. To broadcast the drop-day email, create a customer segment on that tag and send from Shopify Email or Klaviyo.

Brand rule: one email per drop. No drip, no teasers.

## Voice gate

Every product description, collection description, and metafield value is reviewed against the forbidden-words list:

- throwback, retro, vibes, IYKYK, 90s kids, epic, rad, totally awesome
- No emoji
- No "remember this?" framing
- Always "The [Noun]" for piece names

Theme does not lint copy — this is editorial discipline at data-entry time.
