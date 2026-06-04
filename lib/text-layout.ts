import type { TextObject } from './design-types';

/**
 * Derive the displayed text for a given layout mode.
 * The user-typed `text` field is preserved untouched on the object — this is
 * applied at render/export time only, so toggling layouts is non-destructive.
 *
 *   - 'horizontal': single line; existing newlines flattened to spaces.
 *   - 'multiline':  honors line breaks the user typed.
 *   - 'stacked':    one character per line, so "HELLO" reads vertically.
 *                   Arabic and other complex scripts will still stack per
 *                   code point — for those, prefer 'horizontal' or 'multiline'.
 */
export function applyTextLayout(text: string, layout: TextObject['textLayout']): string {
  if (layout === 'stacked') {
    return text.replace(/\r?\n/g, '').split('').join('\n');
  }
  if (layout === 'multiline') {
    return text;
  }
  return text.replace(/\r?\n/g, ' ');
}
