import type { CSSProperties, ReactElement } from 'react';

export type DitherVeilPattern = 'floyd' | 'atkinson' | 'bayer' | 'noise' | 'lines';
export type DitherVeilPalette = 'duotone' | 'mono' | string;
export type DitherVeilFit = 'contain' | 'cover';

export interface DitherVeilProps {
  src?: string;
  fit?: DitherVeilFit;
  pattern?: DitherVeilPattern;
  pixelSize?: number;
  levels?: number;
  palette?: DitherVeilPalette;
  inkColor?: string;
  paperColor?: string;
  contrast?: number;
  brightness?: number;
  revealRadius?: number;
  softness?: number;
  linger?: number;
  rimColor?: string;
  rim?: number;
  reverse?: boolean;
  wander?: boolean;
  clickBurst?: boolean;
  /** Key out solid photo matte so the page background shows through. */
  transparentBackdrop?: boolean;
  className?: string;
  style?: CSSProperties;
}

declare function DitherVeil(props: DitherVeilProps): ReactElement | null;

export default DitherVeil;
