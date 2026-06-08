import React, { forwardRef } from "react";
import { cn } from "../../utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  washiTape?: 'none' | 'primary' | 'pink' | 'mint' | 'yellow' | 'lavender' | 'peach' | 'sky';
  washiTapePosition?: 'top' | 'top-left' | 'top-right';
  hasBindingHoles?: boolean;
  hasCornerFold?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, washiTape, washiTapePosition = 'top', hasBindingHoles, hasCornerFold, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "card-paper relative",
      washiTape && washiTape !== 'none' && `washi-tape-${washiTapePosition} washi-color-${washiTape}`,
      hasBindingHoles && "has-binding-holes",
      hasCornerFold && "has-corner-fold",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

export const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-0", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const CardTitle = forwardRef<HTMLDivElement, CardTitleProps>(
  ({ className, level = 3, ...props }, ref) => (
    <div
      ref={ref}
      role="heading"
      aria-level={level}
      className={cn(
        "text-xl font-normal leading-none tracking-tight",
        className
      )}
      style={{ fontFamily: 'var(--font-handwritten)' }}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-muted-foreground text-sm opacity-80", className)}
    style={{ fontFamily: 'var(--font-rounded)' }}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";
