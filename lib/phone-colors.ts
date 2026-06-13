/**
 * Phone (device) colors — the color of the customer's actual phone,
 * NOT the case color.
 *
 * Used to tint the device body that shows behind / around the case in the
 * editor preview, so the customer can imagine how their case will look on
 * their own phone. Especially important when the case is transparent.
 *
 * The `value` field is a CSS color string. For most entries it's a hex; for
 * 'natural-titanium' / 'desert-titanium' we use a subtle gradient encoded
 * as a CSS gradient string to suggest the brushed-titanium finish.
 *
 * To add a new option: append to PHONE_COLORS below. The `id` must be a
 * lowercase slug (it gets persisted in design JSON).
 */

export interface PhoneColor {
  id: string;
  name: string;
  /** Hex color used everywhere we need a single color (Shopify property, dot fill). */
  hex: string;
  /** Optional richer CSS background (gradient) for the swatch + body preview. */
  background?: string;
}

export const PHONE_COLORS: PhoneColor[] = [
  { id: 'black',             name: 'Black',             hex: '#111111' },
  { id: 'white',             name: 'White',             hex: '#F5F5F2' },
  { id: 'silver',            name: 'Silver',            hex: '#D4D4D2',
    background: 'linear-gradient(135deg, #E8E8E6 0%, #BFBFBC 100%)' },
  { id: 'gold',              name: 'Gold',              hex: '#D4B97A',
    background: 'linear-gradient(135deg, #EBD9A8 0%, #C2A459 100%)' },
  { id: 'blue',              name: 'Blue',              hex: '#4A6E91' },
  { id: 'pink',              name: 'Pink',              hex: '#F0CFCB' },
  { id: 'natural-titanium',  name: 'Natural Titanium',  hex: '#C7C2B8',
    background: 'linear-gradient(135deg, #D9D4CA 0%, #B0AA9F 100%)' },
  { id: 'desert-titanium',   name: 'Desert Titanium',   hex: '#B4A48A',
    background: 'linear-gradient(135deg, #C5B69D 0%, #9F8E73 100%)' },
];

export const CUSTOM_PHONE_COLOR_ID = 'custom';
export const DEFAULT_PHONE_COLOR_ID = 'black';

export function getPhoneColor(id: string, customHex: string | undefined): {
  id: string;
  name: string;
  hex: string;
  background: string;
} {
  if (id === CUSTOM_PHONE_COLOR_ID) {
    const hex = isHex(customHex) ? customHex! : '#888888';
    return { id, name: 'Custom', hex, background: hex };
  }
  const found = PHONE_COLORS.find((c) => c.id === id) ?? PHONE_COLORS[0];
  return {
    id: found.id,
    name: found.name,
    hex: found.hex,
    background: found.background || found.hex,
  };
}

function isHex(v: string | undefined): v is string {
  return typeof v === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(v);
}
