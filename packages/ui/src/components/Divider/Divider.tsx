import React from 'react';
import { cn } from '../../utils';
import styles from './Divider.module.css';

export type DividerType = 'dashed' | 'dotted' | 'dots' | 'hairline' | 'hanko' | 'spacing';
export type DividerSize = 'small' | 'normal' | 'large';

export interface DividerProps {
  type?: DividerType;
  size?: DividerSize;
  className?: string;
}

const sizeMap: Record<DividerSize, string> = {
  small: styles.sizeSmall,
  normal: styles.sizeNormal,
  large: styles.sizeLarge,
};

export const Divider: React.FC<DividerProps> = ({
  type = 'dashed',
  size = 'normal',
  className,
}) => (
  <div
    className={cn(styles.divider, styles[type], sizeMap[size], className)}
    aria-hidden="true"
    role="separator"
  />
);
