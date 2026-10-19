import type { ComponentPropsWithoutRef, ReactElement } from 'react';

export interface PlasmaProps extends Omit<ComponentPropsWithoutRef<'div'>, 'color'> {
  color?: string;
  speed?: number;
  direction?: 'forward' | 'reverse' | 'pingpong';
  scale?: number;
  twist?: number;
  wave?: number;
  softness?: number;
  shine?: number;
  brightness?: number;
  grain?: number;
  quality?: number;
  mouseInteractive?: boolean;
  intro?: boolean;
  fade?: number;
  opacity?: number;
  lightMode?: boolean;
  paused?: boolean;
  dpr?: number;
  className?: string;
}

declare const Plasma: (props: PlasmaProps) => ReactElement | null;

export { Plasma };
export default Plasma;
