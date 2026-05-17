import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Box, type BoxProps } from '../Box/Box';
import { cn } from '../../utils';

const gridVariants = cva('grid', {
    variants: {
        cols: {
            1: 'grid-cols-1',
            2: 'grid-cols-2',
            3: 'grid-cols-3',
            4: 'grid-cols-4',
            5: 'grid-cols-5',
            6: 'grid-cols-6',
            12: 'grid-cols-12',
            none: 'grid-cols-none',
        },
        rows: {
            1: 'grid-rows-1',
            2: 'grid-rows-2',
            3: 'grid-rows-3',
            4: 'grid-rows-4',
            5: 'grid-rows-5',
            6: 'grid-rows-6',
            none: 'grid-rows-none',
        },
        flow: {
            row: 'grid-flow-row',
            col: 'grid-flow-col',
            dense: 'grid-flow-dense',
            'row-dense': 'grid-flow-row-dense',
            'col-dense': 'grid-flow-col-dense',
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
        gap: {
            0: 'gap-0',
            1: 'gap-1',
            2: 'gap-2',
            3: 'gap-3',
            4: 'gap-4',
            6: 'gap-6',
            8: 'gap-8',
        },
        xGap: {
            0: 'gap-x-0',
            1: 'gap-x-1',
            2: 'gap-x-2',
            4: 'gap-x-4',
            8: 'gap-x-8',
        },
        yGap: {
            0: 'gap-y-0',
            1: 'gap-y-1',
            2: 'gap-y-2',
            4: 'gap-y-4',
            8: 'gap-y-8',
        }
    },
    defaultVariants: {
        cols: 'none',
        flow: 'row',
        gap: 4,
    },
});

export interface GridProps extends BoxProps, VariantProps<typeof gridVariants> { }

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
    ({ className, cols, rows, flow, align, justify, gap, xGap, yGap, ...props }, ref) => {
        return (
            <Box
                ref={ref}
                className={cn(gridVariants({ cols, rows, flow, align, justify, gap, xGap, yGap, className }))}
                {...props}
            />
        );
    }
);
Grid.displayName = 'Grid';

export { Grid };
