import type { CSSProperties, ReactElement } from 'react';

export type LatticeLoaderStatus = 'working' | 'done' | 'error';
export type LatticeLoaderPattern =
  | 'arrow'
  | 'dots'
  | 'ripple'
  | 'spiral'
  | 'orbit'
  | 'snake'
  | 'sweep'
  | 'spin'
  | 'rain'
  | 'pulse'
  | string;
export type LatticeLoaderShape = 'round' | 'square' | string;

export interface LatticeLoaderProps {
  label?: string;
  doneLabel?: string;
  errorLabel?: string;
  status?: LatticeLoaderStatus;
  pattern?: LatticeLoaderPattern;
  grid?: 3 | 4;
  shape?: LatticeLoaderShape;
  color?: string;
  doneColor?: string;
  errorColor?: string;
  cellSize?: number;
  gap?: number;
  fontSize?: number;
  step?: number;
  idleOpacity?: number;
  glow?: boolean;
  glowColor?: string;
  showTimer?: boolean;
  elapsed?: number;
  className?: string;
  style?: CSSProperties;
}

declare function LatticeLoader(props: LatticeLoaderProps): ReactElement | null;

export default LatticeLoader;
