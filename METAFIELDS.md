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
| `tct.fabric` | single-line text | optional | `6.1 oz garment-dyed ring-spun cotton` | Detail strip context |
| `tct.hangtag_prefix` | single-line text | optional | `042` | Shown in PDP hangtag preview as `042 / 250` |

## Collection metafields (namespace: `tct`)

Used on drop collections (Saturday Morning, After School, etc.).

| Key | Type | Required | Example | Purpose |
|-----|------|----------|---------|---------|
| `tct.drop_number` | single-line text | yes | `01` | Drop number (two digits) |
| `tct.drop_status` | single-line text (choice) | yes | `airing` | One of: `airing`, `next`, `soon`, `archived` |
| `tct.ritual_tagline` | single-line text | yes | `Saturday morning, properly dressed.` | Displayed under drop name |
| `tct.air_date` | date | optional | `2026-04-26` | Drop launch date |

Here are anchored regexes for each field, tuned to the examples in the doc. All are case-sensitive (matches the lowercase choice lists).

## Product metafields (`tct.*`)

| Key              | Regex                                            |
| ---------------- | ------------------------------------------------ |
| `slot_time`      | `^(1[0-2]\|[1-9]):[0-5][0-9] (AM\|PM)$`          |
| `run_position`   | `^\d{2} / \d{2}$`                                |
| `run_size`       | `^[1-9]\d*$`                                     |
| `card_color`     | `^(mustard\|teal\|rose\|ink\|tangerine\|cream)$` |
| `short_desc`     | `^[^\r\n]{1,160}\.$`                             |
| `title_card_svg` | `^\s*<svg\b[\s\S]*<\/svg>\s*$`                   |
| `fabric`         | `^[^\r\n]{1,80}$`                                |
| `hangtag_prefix` | `^\d{3}$`                                        |

## Collection metafields (`tct.*`)

| Key              | Regex                                              |
| ---------------- | -------------------------------------------------- |
| `drop_number`    | `^\d{2}$`                                          |
| `drop_status`    | `^(airing\|next\|soon\|archived)$`                 |
| `ritual_tagline` | `^[^\r\n]{1,120}\.$`                               |
| `air_date`       | `^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$` |

Notes on the judgment calls:

- **`slot_time`** — 12-hour with `AM`/`PM` in caps, matching `8:00 AM`. Swap to `^([01]\d\|2[0-3]):[0-5]\d$` if you ever move to 24-hour.
- **`run_position`** — enforces the `01 / 06` spacing exactly, since the grid depends on it.
- **`short_desc` / `ritual_tagline`** — require a trailing period and ban line breaks. Length caps (160/120) are soft guards for card layout; loosen if you hit them.
- **`title_card_svg`** — structural check only (starts with `<svg`, ends with `</svg>`). Can't verify SVG validity with a regex.
- **`air_date`** — validates month/day ranges but won't catch Feb 30; treat as good-enough for data entry.

Paste these into a metafield validation rule in Shopify admin (Settings → Custom data → field → Validations → "Matches regex") to enforce them at the source.

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

