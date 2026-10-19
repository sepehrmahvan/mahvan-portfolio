import type { ComponentPropsWithoutRef, ElementType, ReactElement } from 'react';

export type TextTypeCursorStyle = 'character' | 'bar' | 'block' | 'underscore';
export type TextTypeDeleteMode = 'backspace' | 'clear' | 'none';
export type TextTypeEffect = 'none' | 'fade' | 'blur' | 'rise';

export interface TextTypeProps<T extends ElementType = 'div'> {
  text: string | string[];
  as?: T;
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  deleteMode?: TextTypeDeleteMode;
  loop?: boolean;
  className?: string;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorStyle?: TextTypeCursorStyle;
  cursorCharacter?: string;
  cursorColor?: string;
  cursorClassName?: string;
  cursorBlinkDuration?: number;
  cursorGlide?: boolean;
  typeEffect?: TextTypeEffect;
  mistakes?: number;
  prefix?: string;
  prefixColor?: string;
  textColors?: string[];
  variableSpeed?: { min: number; max: number };
  onSentenceComplete?: (sentence: string, index: number) => void;
  startOnVisible?: boolean;
  reverseMode?: boolean;
}

declare function TextType<T extends ElementType = 'div'>(
  props: TextTypeProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof TextTypeProps>,
): ReactElement | null;

export default TextType;
