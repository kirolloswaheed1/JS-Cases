# JS Cases Customizer

External web app that lets JS Cases customers design their own phone case and
send the customized product into the Shopify cart on **jscases.co**.

The app is fully external — it lives at `designer.jscases.co` (or any
domain/subdomain you point at the deployment). It does **not** replace Shopify
checkout. Customers design here, then are redirected to the standard Shopify
cart with the customized variant and line item properties attached.

---

## What's in the MVP

End-to-end working flow:

1. Select a phone model (10 iPhone/Samsung models pre-configured).
2. Choose a case color.
3. Upload images from the device.
4. Add and style text (English + Arabic fonts, RTL works via `dir="auto"`).
5. Move / resize / rotate / duplicate / delete objects.
6. Camera-cutout area is shown as a visual guide — objects can pass over it, and the camera area is automatically masked out of the final print file.
7. Safe-area warnings + low-resolution warnings.
8. Export at click time: preview PNG (web res) + print PNG (model's print res) + editable JSON.
9. Upload the three files to a storage adapter (placeholder / Supabase / Cloudinary).
10. Redirect to `https://{shop}/cart/{variantId}:1?attributes[...]=...` so the
    customized item lands in the Shopify cart with all metadata.

The architecture is ready to expand with: assets/stickers library, layers
panel, advanced text effects, image cropping, save/edit-design.

---

## Tech stack

- Next.js 14 (App Router) + TypeScript
- React 18 + react-konva for the canvas editor
- Tailwind CSS for styling
- API route (`/api/upload-design`) for persisting files
- Storage adapter pattern: `placeholder` (default, dev), `supabase`, or `cloudinary`

---

## Local setup

```bash
# 1. Install
npm install

# 2. Set env vars
cp .env.example .env.local
# Edit .env.local — for local dev you can keep STORAGE_PROVIDER=placeholder.

# 3. Run
npm run dev
# → http://localhost:3000
```

The placeholder storage adapter returns mock URLs without uploading, so you can
test the end-to-end flow locally without setting up Supabase or Cloudinary.

---

## Connecting to Shopify

### 1. Set the shop domain

In `.env.local`:

```
NEXT_PUBLIC_SHOPIFY_DOMAIN=jscases.co
```

Use the primary domain (not `*.myshopify.com`) so the checkout stays branded.

### 2. Set the Shopify variant IDs for each phone model

Open `lib/phone-models.ts`. Each phone model has a `shopifyVariantId` field
that currently reads `REPLACE_WITH_SHOPIFY_VARIANT_ID`. Replace each one with
the numeric variant ID from Shopify.

**Where to find a variant ID in Shopify Admin:**
Shopify Admin → Products → click the customizable case product → click the
variant for that phone model. The URL ends with `/variants/{NUMERIC_ID}` —
that number is what you paste in.

If you sell one product with one variant per phone model, you'll paste a
unique ID per model. If you sell separate products per phone, set the variant
ID of the relevant product on each model.

### 3. Test the add-to-cart flow

1. Run `npm run dev`.
2. Build a design.
3. Click **Add Custom Case to Cart**.
4. You should be redirected to `https://jscases.co/cart/{variantId}:1?attributes[...]`.
5. The Shopify cart should show the item with these line item properties:
   - `Customized Case: Yes`
   - `Phone Model: iPhone 15 Pro Max`
   - `Case Color: Black`
   - `Design ID: JS-CASE-...`
   - `Preview URL: https://...`
   - `Print File URL: https://...`
   - `Editable Design JSON: https://...`

### 4. Where the data appears in Shopify orders

When a customer completes checkout, the Shopify order admin shows each line
item's properties (Order details → line item → "Custom item properties"). The
store owner can click `Print File URL` to download the print-ready PNG, and
the `Design ID` is a stable reference.

---

## Storage providers

### Placeholder (default)

```
STORAGE_PROVIDER=placeholder
```

Nothing is uploaded. The API returns mock URLs. Useful for local dev.

### Supabase Storage

```
STORAGE_PROVIDER=supabase
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=service-role-key
SUPABASE_BUCKET=js-cases-designs
```

1. Create a Supabase project.
2. Create a **public** Storage bucket called `js-cases-designs` (or whatever
   you set `SUPABASE_BUCKET` to).
3. Copy the project URL and service role key from Project Settings → API.

### Cloudinary

```
STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_FOLDER=js-cases-designs
```

To switch providers later: change `STORAGE_PROVIDER` and the corresponding env
vars. No code changes required.

---

## Deploying to `designer.jscases.co`

### On Vercel (recommended)

1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Add all env vars from `.env.example` in Vercel → Project → Settings → Environment Variables.
4. In Vercel → Project → Settings → Domains, add `designer.jscases.co`.
5. In your DNS provider, add a `CNAME` record:
   - **Name:** `designer`
   - **Value:** `cname.vercel-dns.com`
6. Wait for SSL.
7. Update the JS Cases Shopify store: change the "Customize Your Design"
   button on the product page to link to `https://designer.jscases.co`.

### Anywhere else

Any host that runs Next.js 14 will work (Netlify, Render, AWS, self-hosted Node).
The only server-side code is the `/api/upload-design` route.

---

## Adding new phone models

Open `lib/phone-models.ts` and append a new entry:

```ts
{
  id: 'iphone-16-pro',
  name: 'iPhone 16 Pro',
  brand: 'iPhone',
  shopifyVariantId: '41234567890123',
  canvas: { width: 400, height: 810 },
  print:  { width: 1206, height: 2622 },
  safeArea:     { x: 22, y: 22, width: 356, height: 766, radius: 44 },
  cameraCutout: { x: 36, y: 36, width: 140, height: 140, radius: 30 },
}
```

`canvas` = on-screen editor size in logical pixels.
`print` = print-ready output size (use the manufacturer's real screen pixel
dimensions; the printer can scale).
`safeArea` = inset where design content should stay.
`cameraCutout` = the camera area — printable artwork is forbidden here, and
the export masks this region transparent.

---

## How camera cutout protection works

- The canvas overlays the camera cutout as a dark rounded rectangle so the
  customer can see where it is.
- `lib/validation.ts` checks every visible object's bounding box (after rotation)
  against the cutout rectangle. If any visible object intersects the cutout,
  a blocking error is emitted and **Add to Cart** is disabled.
- The export pass (`lib/export-design.ts`) uses Konva's
  `globalCompositeOperation: 'destination-out'` to *punch a transparent hole*
  in the print-ready PNG at the cutout location — so even if something slips
  past validation, the camera area is guaranteed transparent in the print
  file. UI elements (handles, safe-area lines, warning overlays) are never
  drawn into the export because we render to a fresh offscreen Stage.

---

## Project structure

```
app/
  layout.tsx               # root layout, fonts
  page.tsx                 # client-only loader for CustomizerApp
  api/
    upload-design/route.ts # POST endpoint that writes to storage

components/
  CustomizerApp.tsx        # main state + composition
  PhoneCanvas.tsx          # the Konva editor
  Toolbar.tsx              # tab navigation
  ImageTools.tsx           # image upload UI
  TextTools.tsx            # text styling controls
  ProductOptions.tsx       # phone model + colors
  ValidationPanel.tsx      # error/warning display
  AddToCartPanel.tsx       # add-to-cart button + status

lib/
  phone-models.ts          # phone catalog + variant IDs
  case-colors.ts           # case color palette
  design-types.ts          # TS types for design objects
  design-id.ts             # JS-CASE-... ID generator
  validation.ts            # camera/safe-area/resolution checks
  export-design.ts         # offscreen Konva render → preview + print PNG
  storage.ts               # storage adapter (placeholder/supabase/cloudinary)
  shopify.ts               # cart permalink builder

styles/
  globals.css              # Tailwind + base styles
```

---

## Roadmap (post-MVP)

- Assets/stickers library (data structure already documented in the spec).
- Layers panel with reorder/lock/visibility.
- Advanced text effects: stroke, shadow, curve.
- Image cropping with crop frame.
- Save/edit design — re-hydrate from the stored JSON via a magic link.
- A/B variants (clear case, matte case, MagSafe ring) as Shopify variant options.

---

## Deploying to Vercel (public preview link)

The fastest way to get a shareable URL to send the client. All steps assume the
placeholder storage adapter, so the preview will work end-to-end except for the
final upload (it returns mock URLs, and the Shopify redirect URL is still
constructed correctly).

### 1. Push to GitHub

```bash
# inside the project folder
git init
git add .
git commit -m "JS Cases customizer"
git branch -M main

# create an empty repo on github.com first, then:
git remote add origin https://github.com/<your-username>/js-cases-customizer.git
git push -u origin main
```

### 2. Import the repo into Vercel

1. Go to https://vercel.com/new
2. Click **Import Git Repository** and select the repo you just pushed.
3. Framework Preset → **Next.js** (auto-detected).
4. Build & Output settings → leave at defaults.
5. **Environment Variables** — add:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SHOPIFY_DOMAIN` | `jscases.co` |
   | `STORAGE_PROVIDER` | `placeholder` |

   > Use the bare domain `jscases.co`, not `https://jscases.co` — the
   > `buildShopifyCartUrl` helper prepends `https://` itself.

6. Click **Deploy**.

### 3. Get the preview URL

After ~1 minute Vercel gives you a URL like:

```
https://js-cases-customizer-<hash>.vercel.app
```

That's the public preview link you can send to the client. Every push to `main`
auto-redeploys; every branch push gets its own preview URL too.

### 4. (Later) Wire up the real domain and real storage

When you're ready to launch:

1. In Vercel → Project → **Domains**, add `designer.jscases.co`.
2. In your DNS, add a CNAME record:
   `designer` → `cname.vercel-dns.com`
3. Switch `STORAGE_PROVIDER` to `supabase` or `cloudinary` and fill in the
   matching env vars (see `.env.example`).
4. Replace each `shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID'` in
   `lib/phone-models.ts` with the real variant ID from your Shopify admin
   (the long numeric ID, not the GID).
5. Replace `/public/js-cases-logo.svg` with your real logo file (PNG or SVG).

### Build verification

Before pushing, you can verify everything builds locally:

```bash
npm install
npm run build
```

A successful build ends with the route table and no red errors.

---

## Mobile layout & Preview mode

The editor is mobile-first. On phones:

- The **phone case preview is always the focus** — it fills the screen above a
  compact bottom bar.
- Tools live in a **collapsible bottom drawer**. It's collapsed by default,
  showing only the tool tabs (Phone / Upload / Text / Stickers / Colors) and the
  Add to Cart button. Tap **Show tools** (or any tab) to slide it up; it's capped
  at 50vh with internal scroll, and tapping the dimmed area or **Hide tools**
  collapses it again so the full design is visible.
- **Preview** (top-right) opens a clean, chrome-free, branded view of the case
  with no handles, guides, or panels — just the design and a **Back to editing**
  button. Good for customer confidence before adding to cart.

Desktop keeps the existing three-column layout (tools / canvas / cart).

## Security

Practical hardening appropriate for a public, no-auth customizer:

- **Image uploads** (`components/ImageTools.tsx`): allowlist of `image/jpeg`,
  `image/png`, `image/webp` only — **SVG is rejected** (script/XSS vector). Max
  **8MB**, max 8000px on the longest side (prevents memory crashes), low-res
  images warn instead of blocking. Friendly inline errors, no `alert()`.
- **Safe IDs** (`lib/design-id.ts`): every design gets a generated
  `JS-CASE-…` ID. Original uploaded filenames are never trusted or used as
  storage keys.
- **Payload validation** (`lib/design-payload.ts`): the API validates required
  fields (`designId`, `phoneModel`, `caseColor`, `objects`, `createdAt`),
  enforces a 25MB cap and a 200-object limit, whitelists colors, strips control
  characters from text, and only persists a sanitized object.
- **API route** (`app/api/upload-design/route.ts`): POST-only (others get 405),
  size-guarded, validates before storing, and returns safe error messages —
  never internal stack traces (those are logged server-side only).
- **Security headers** (`next.config.js`): a practical `Content-Security-Policy`
  (tuned so canvas/image/font loading and PNG export keep working),
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`,
  `X-Frame-Options`, and `frame-ancestors` that allow embedding only on
  `jscases.co` / Shopify. **Adjust `img-src` / `connect-src` when you add a
  storage provider** — comments in the file mark where.
- **Secrets**: nothing is hardcoded. Shopify domain and storage settings come
  from environment variables (see `.env.example`).

---

## Sticker library

Stickers are plain PNG files served from `/public/stickers/` and registered in
`lib/assets-library.ts`. There's no inline SVG and no script injection — every
sticker is a static image the browser loads like any other `<img>`.

### Folder structure

```
public/stickers/
├── _manifest.json        ← original → renamed filename map (for reference)
├── men/                  ← Men category (43 stickers, men-001.png … men-043.png)
└── women/                ← Women category (16 stickers, women-001.png … women-016.png)
```

`_manifest.json` records the original filename for each renamed sticker. If
you ever need to find one (e.g. "what was `men-017.png` called originally?"),
it's all there.

### How to remove a specific sticker

1. Open `lib/assets-library.ts`.
2. Find and delete the matching `{ id: 'men-NNN', ... }` line from the array.
3. *(Optional)* Delete the matching PNG file from
   `public/stickers/men/` or `public/stickers/women/`. Leaving it on disk is
   harmless — it just won't appear in the sticker picker once it's removed
   from the array.

### How to replace a sticker

1. Drop the new PNG into the right folder, overwriting (or renaming) the file.
2. If you renamed it, update the `src` path in the matching array entry in
   `lib/assets-library.ts`.

### How to add a sticker

1. Drop a PNG into `public/stickers/men/` or `public/stickers/women/`.
2. Add an entry to the matching `assets` array in `lib/assets-library.ts`:
   ```ts
   { id: 'men-044', name: 'Men sticker 044', src: '/stickers/men/men-044.png' },
   ```

### How to add a whole new category

Append a new top-level entry to `ASSET_CATEGORIES` in `lib/assets-library.ts`.
The `id` should be lowercase and stable (it gets persisted in design JSON);
`name` is what shows on the chip in the sticker picker.

### A note on the current sticker set

The PNGs included in this build came directly from the client-provided
`Stickers.zip` for internal preview/testing. Some contain logos, branded
products, or recognizable photos that may not be safe for public commercial
sale without licensing. Filter the catalog (`assets-library.ts`) before
launching to public customers.

## Transparent / Clear Case

`caseType: 'solid' | 'transparent'` is now part of the design state.

- **Solid**: the case is filled with the selected `caseColor`, exactly as before.
- **Transparent**: the case is shown in the editor with a dashed outline and a
  light tint so the customer can still see the case shape. The **print PNG has
  no case fill** — it's a clean alpha PNG of just the artwork, which the printer
  overlays on a clear case.

Shopify properties include `Case Type: Solid Color | Transparent`. `Case Color`
is only attached for solid cases.

## Other / Not listed phone model

There's a new `other` phone model with `isOther: true`. When the customer
picks it from the model dropdown, a text input appears asking them to type
their phone model. Add to Cart is gated until they fill it in. Shopify
properties get `Phone Model: Other` plus `Custom Phone Model: <their text>`,
and the design JSON includes `customPhoneModel`.

The current `other` model uses a generic mockup geometry as a fallback. When
your real phone-mockup images are wired in (next pass), the Other option will
keep its generic mockup with the "Our team will confirm availability before
production." note.

## Text controls

Each text object stores a `textLayout`:

- `horizontal` (default) — single line; existing newlines flatten to spaces.
- `multiline` — honors line breaks the customer typed (textarea editor).
- `stacked` — one character per line, so "HELLO" reads top-to-bottom.

The user-typed `text` field is preserved verbatim — toggling the layout is
non-destructive. `lineHeight` (a multiplier) and `letterSpacing` are independent
controls. Bold / italic / size / family / alignment / color are all per-object
on the existing `TextObject` interface.

---

## Phone mockups

The editor draws each iPhone model on top of a real mockup PNG from
`/public/phone-mockups/`. The mockup is a line-drawing outline with a
transparent interior, so the case-color fill shows through, the outline
frames the design, and the camera bump area is visible.

### Where mockups live

```
public/phone-mockups/
├── iphone-11.png
├── iphone-11-pro.png
├── iphone-11-pro-max.png
├── iphone-12.png
├── … (21 files total, iPhone 11 → 17, all variants)
└── iphone-17-pro-max.png
```

Each filename is the kebab-case version of the phone model id (the `id` field
in `lib/phone-models.ts`).

### How to replace a mockup

Drop the new PNG into `public/phone-mockups/` with the same filename. The
editor picks it up automatically — no code change required as long as the
filename matches.

### How to tune the design area / camera cutout per model

Every model in `lib/phone-models.ts` has two rectangles you can adjust:

```ts
{
  id: 'iphone-15-pro-max',
  // ...
  safeArea:     { x: 21, y: 35, width: 378, height: 807, radius: 42 },
  cameraCutout: { x:  0, y:  0, width: 282, height: 288, radius: 51 },
}
```

- `safeArea`: dashed rectangle shown in the editor as "keep important content
  inside here". Used by the validation system to warn when objects extend
  outside.
- `cameraCutout`: the **Not printed** zone. Drawn as a soft dashed outline
  with the "Not printed" pill label in the editor. The print-ready PNG masks
  this area out so anything overlapping the camera bump is removed before
  production.

Both are in canvas pixel coordinates relative to the top-left of the mockup.
The shipped values are **per-mockup** — for each iPhone mockup I detected
the case body and camera bump using image analysis, then converted to
canvas coordinates. They line up closely with the actual camera bump in
every mockup. A couple of models (iPhone 14 Pro Max in particular) had
their bump outline merged with the case outline and were filled in by
hand-tuning against a sibling model.

To refine any model:

1. Open the customizer at the model you want to tune.
2. Note where the dashed safe area / camera outline lands vs the actual
   mockup outline.
3. Edit the matching numbers in `lib/phone-models.ts`.
4. Dev hot-reload picks the change up immediately.

### Models without a mockup (Samsung, "Other")

The three Samsung models and the "Other / Not listed" placeholder don't have
mockup files yet. They render with the existing generic rounded-rect case
fallback — fully functional, just less product-photo-realistic than the
iPhones. Adding mockups for these is the same flow: drop a PNG with the
matching slug into `public/phone-mockups/` and set `mockupImage` on the
model entry in `lib/phone-models.ts`.

### Heads-up on the included mockups

The PNGs shipped in this build came directly from the client-provided
`Final_mockups.zip`. The iPhone 11 mockup (and faintly some others) shows
the Apple logo on the case back — Apple's logo is a trademark. Same
understanding as the stickers: treat as internal-preview placeholders and
filter or replace before a public commercial launch.

---

## UX polish

This pass added four customer-facing improvements wired into the existing flow:

### 1. Branded loading screen
`components/CustomizerLoader.tsx` replaces the plain "Loading the customizer…"
fallback used by the dynamic import in `app/page.tsx`. Beige background (#CCC0B4),
JS Cases logo centered, brand-maroon spinner, and a **Reload designer** button
that surfaces after 8 seconds for stalled chunk fetches on flaky networks.

### 2. Step indicator
`components/StepIndicator.tsx` adds a four-step header row — *Choose Phone →
Design → Preview → Add to Cart* — below the hero. The current step is derived
from app state (no new source of truth):

| Step    | Condition                                    |
|---------|----------------------------------------------|
| phone   | empty canvas, no objects yet                 |
| design  | at least one object placed                   |
| preview | preview mode is open                         |
| cart    | summary modal is open OR redirect is in motion |

Each step is also clickable up to one step ahead — tapping "Preview" opens
preview mode, tapping "Add to Cart" opens the summary modal.

### 3. Layers tab
`components/LayersPanel.tsx` adds a sixth tool tab (Phone, Upload, Text,
Stickers, Colors, **Layers**) listing every object on the canvas in z-order
(top of list = drawn last = on top). Each row supports select, reorder
(up/down), visibility toggle, and delete. Wired to the same
`updateObject` / `deleteObject` / new `reorderObject` handlers in
`CustomizerApp.tsx`.

### 4. Pre-cart summary modal
`components/CartSummaryModal.tsx` is shown the moment a customer clicks
**Add Custom Case to Cart**. It mirrors the exact Shopify line item properties
that will be sent — Phone Model, Custom Phone Model (only for "Other"),
Case Type, Case Color (only for solid), and "Customized Case: Yes" — so the
customer reviews the order one last time before the cart redirect. The
"Confirm & checkout" button runs the actual export/upload/redirect; "Back to
editing" closes the modal without doing anything.

### Minor adjustments
- Mobile drawer button now reads simply **Tools** (chevron rotates on
  toggle); max-height tightened from 50vh to 45vh so more of the canvas
  stays visible while the drawer is open.
- Camera helper text under the canvas shortened to **"Camera area — not
  printed."** to match the customer-facing copy in the spec.

All changes are incremental — phone model selector, case colors, image
upload, text tools, stickers library, Shopify redirect, security headers,
mockup overlay layer, and camera-mask logic are untouched.
