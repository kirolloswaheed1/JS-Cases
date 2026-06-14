/**
 * Shopify cart integration via cart permalink.
 *
 * We don't need the Storefront API or an installed Shopify app for this flow —
 * Shopify provides a public cart permalink that accepts variant IDs and line item
 * properties (called "attributes" in the URL but rendered as line item properties).
 *
 *   https://{shop}/cart/{variantId}:{qty}?attributes[Key]=Value&attributes[Key2]=Value2
 *
 * The customer is redirected to that URL; Shopify auto-adds the item to their cart
 * with the properties attached, then they continue through standard Shopify checkout.
 *
 * The shop's primary domain (jscases.co) is used so checkout stays branded.
 */

/**
 * Shopify line item properties.
 *
 * `Customized Case`, `Phone Model`, `Case Type`, `Design ID`, `Preview URL`,
 * `Print File URL`, and `Editable Design JSON` are always present.
 * `Case Color` is included only for solid cases.
 * `Custom Phone Model` is included only when the customer chose "Other".
 *
 * Defined as a record so callers can omit conditional keys without TS friction.
 */
export type CartLineProperties = Record<string, string>;

export interface BuildCartUrlInput {
  shopDomain: string;       // e.g. 'jscases.co'
  variantId: string;        // numeric variant ID from Shopify
  quantity?: number;
  properties: CartLineProperties;
}

export function buildShopifyCartUrl(input: BuildCartUrlInput): string {
  const qty = input.quantity ?? 1;
  const base = `https://${input.shopDomain}/cart/${encodeURIComponent(input.variantId)}:${qty}`;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input.properties)) {
    // Shopify uses `attributes[Key]=value` for line item properties on cart permalinks.
    params.append(`attributes[${key}]`, String(value));
  }

  return `${base}?${params.toString()}`;
}

/**
 * Pick the Shopify variant ID to use for an Add to Cart redirect.
 *
 * The store only needs ONE product/variant for the custom case — the phone
 * model is carried as a line item property, not as a Shopify variant. If the
 * store later wants different prices per case type, they can configure
 * separate variants by setting the optional case-type-specific env vars.
 *
 * Resolution order:
 *   1. `NEXT_PUBLIC_SOLID_CASE_VARIANT_ID` / `NEXT_PUBLIC_TRANSPARENT_CASE_VARIANT_ID`
 *      if set for the active case type.
 *   2. `NEXT_PUBLIC_DEFAULT_CUSTOM_CASE_VARIANT_ID` as the shared fallback.
 *   3. `null` if nothing is configured (or only placeholders are set) — the
 *      caller must show an error and refuse to redirect.
 */
export function resolveCartVariantId(
  caseType: 'solid' | 'transparent'
): string | null {
  const perType =
    caseType === 'transparent'
      ? process.env.NEXT_PUBLIC_TRANSPARENT_CASE_VARIANT_ID
      : process.env.NEXT_PUBLIC_SOLID_CASE_VARIANT_ID;
  const fallback = process.env.NEXT_PUBLIC_DEFAULT_CUSTOM_CASE_VARIANT_ID;
  const id = (perType || fallback || '').trim();
  if (!id) return null;
  if (id.startsWith('REPLACE_')) return null;
  return id;
}
