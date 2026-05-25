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

export interface CartLineProperties {
  'Customized Case': 'Yes';
  'Phone Model': string;
  'Case Color': string;
  'Design ID': string;
  'Preview URL': string;
  'Print File URL': string;
  'Editable Design JSON': string;
}

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
