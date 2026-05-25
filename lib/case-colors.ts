export interface CaseColor {
  id: string;
  name: string;
  hex: string;
}

export const CASE_COLORS: CaseColor[] = [
  { id: 'black', name: 'Black', hex: '#0A0A0A' },
  { id: 'white', name: 'White', hex: '#FFFFFF' },
  { id: 'pink', name: 'Pink', hex: '#FF4D8D' },
  { id: 'baby-pink', name: 'Baby Pink', hex: '#FFC7DA' },
  { id: 'lilac', name: 'Lilac', hex: '#C8B6FF' },
  { id: 'mint', name: 'Mint', hex: '#B7E4C7' },
  { id: 'sky', name: 'Sky', hex: '#A0D8F1' },
  { id: 'sunshine', name: 'Sunshine', hex: '#FFD84D' },
  { id: 'red', name: 'Red', hex: '#E63946' },
  { id: 'cream', name: 'Cream', hex: '#F5EBDD' },
];

export const DEFAULT_CASE_COLOR = 'white';
