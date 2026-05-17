import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';
import { X } from 'lucide-react';
import { useKozmosAnalytics } from '../../utils/analytics';

const tagVariants = cva(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default:
                    'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
                secondary:
                    'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
                destructive:
                    'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
                outline: 'text-foreground',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export interface TagProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagVariants> {
    onRemove?: () => void;
}

const Tag = React.forwardRef<HTMLDivElement, TagProps>(
    ({ className, variant, onRemove, children, ...props }, ref) => {
        const { trackEvent } = useKozmosAnalytics();
        return (
            <div ref={ref} className={cn(tagVariants({ variant }), className)} {...props}>
                {children}
                {onRemove && (
                    <button
                        type="button"
                        onClick={() => {
                            if (typeof children === 'string') {
                                trackEvent('Tag', 'tag_removed', { label: children });
                            } else {
                                trackEvent('Tag', 'tag_removed');
                            }
                            onRemove();
                        }}
                        className="ml-1 rounded-full p-0.5 hover:bg-accent focus:outline-none"
                    >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                    </button>
                )}
            </div>
        );
    }
);
Tag.displayName = 'Tag';

export { Tag, tagVariants };
