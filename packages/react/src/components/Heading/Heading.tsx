import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';
import { Text, type TextProps } from '../Text/Text';

const headingVariants = cva('font-bold', {
    variants: {
        level: {
            1: 'text-4xl',
            2: 'text-3xl',
            3: 'text-2xl',
            4: 'text-xl',
            5: 'text-lg',
            6: 'text-base',
        },
    },
    defaultVariants: {
        level: 1,
    },
});

export interface HeadingProps extends Omit<TextProps, 'size' | 'weight' | 'as'>, VariantProps<typeof headingVariants> {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ className, level = 1, as, children, ...props }, ref) => {
        // Determine tag from level if 'as' is not provided
        const tagMap: Record<number, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = {
            1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6'
        };
        const Tag = as || tagMap[level as number] || 'h1';

        return (
            <Text
                as={Tag}
                ref={ref}
                className={cn(headingVariants({ level, className }))}
                {...props}
            >
                {children}
            </Text>
        );
    }
);

Heading.displayName = 'Heading';
export { Heading };
