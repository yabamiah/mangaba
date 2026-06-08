import React from 'react';
import { cn } from '../../utils';

export interface MoodIconProps {
  src: string;
  alt?: string;
  className?: string;
}

export const MoodIcon: React.FC<MoodIconProps> = ({
  src,
  alt = '',
  className,
}) => (
  <div
    className={cn('inline-block bg-current', className)}
    style={{
      maskImage: `url('${src}')`,
      maskSize: 'contain',
      maskRepeat: 'no-repeat',
      maskPosition: 'center',
      WebkitMaskImage: `url('${src}')`,
      WebkitMaskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
    }}
    role="img"
    aria-label={alt}
  />
);
