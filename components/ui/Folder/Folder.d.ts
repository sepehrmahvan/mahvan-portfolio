import type { CSSProperties, ReactNode } from 'react';

export type FolderItem = {
  title: string;
  description?: string;
  image?: string;
  alt?: string;
};

export type FolderProps = {
  items?: FolderItem[];
  label?: string;
  mode?: 'flap' | 'book' | string;
  variant?: 'solid' | 'glass' | string;
  color?: string;
  paperColor?: string;
  tabPosition?: 'left' | 'right' | string;
  layout?: string;
  size?: number;
  openOn?: 'click' | 'hover' | string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onItemClick?: (item: FolderItem, index: number) => void;
  onItemDrop?: (item: FolderItem, index: number) => void;
  draggable?: boolean;
  zoomOnClick?: boolean;
  peek?: boolean;
  intro?: boolean;
  tilt?: number;
  bounce?: number;
  speed?: number;
  frost?: number;
  closeOnOutsideClick?: boolean;
  theme?: 'light' | 'dark' | string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

declare function Folder(props: FolderProps): ReactNode;

export default Folder;
