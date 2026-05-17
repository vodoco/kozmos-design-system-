import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Box, type BoxProps } from '../Box/Box';
import { cn } from '../../utils';

const stackVariants = cva('flex', {
    variants: {
        direction: {
            row: 'flex-row',
            column: 'flex-col',
            'row-reverse': 'flex-row-reverse',
            'column-reverse': 'flex-col-reverse',
        },
        align: {
            start: 'items-start',
            center: 'items-center',
            end: 'items-end',
            baseline: 'items-baseline',
            stretch: 'items-stretch',
        },
        justify: {
            start: 'justify-start',
            center: 'justify-center',
            end: 'justify-end',
            between: 'justify-between',
            around: 'justify-around',
        },
        wrap: {
            nowrap: 'flex-nowrap',
            wrap: 'flex-wrap',
            'wrap-reverse': 'flex-wrap-reverse',
        },
        gap: {
            0: 'gap-0',
            1: 'gap-1',
            2: 'gap-2',
            3: 'gap-3',
            4: 'gap-4',
            6: 'gap-6',
            8: 'gap-8',
        },
    },
    defaultVariants: {
        direction: 'column',
        align: 'stretch',
        justify: 'start',
        wrap: 'nowrap',
        gap: 2,
    },
});

export interface StackProps extends BoxProps, VariantProps<typeof stackVariants> { }

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
    ({ className, direction, align, justify, wrap, gap, ...props }, ref) => {
        return (
            <Box
                ref={ref}
                className={cn(stackVariants({ direction, align, justify, wrap, gap, className }))}
                {...props}
            />
        );
    }
);
Stack.displayName = 'Stack';

export { Stack };
