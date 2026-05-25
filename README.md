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
