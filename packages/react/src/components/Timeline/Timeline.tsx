import React from 'react';
import { cn } from '../../utils';

export type TimelineProps = React.HTMLAttributes<HTMLOListElement>;

const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(
    ({ className, ...props }, ref) => (
        <ol
            ref={ref}
            className={cn('relative border-l border-muted ml-3', className)}
            {...props}
        />
    )
);
Timeline.displayName = 'Timeline';

export type TimelineItemProps = React.LiHTMLAttributes<HTMLLIElement>;

const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
    ({ className, children, ...props }, ref) => (
        <li ref={ref} className={cn('mb-10 ml-6', className)} {...props}>
            <span className="absolute flex items-center justify-center w-6 h-6 bg-secondary rounded-full -left-3 ring-8 ring-background">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
            </span>
            {children}
        </li>
    )
);
TimelineItem.displayName = 'TimelineItem';

const TimelineTime = React.forwardRef<
    HTMLTimeElement,
    React.TimeHTMLAttributes<HTMLTimeElement>
>(({ className, ...props }, ref) => (
    <time
        ref={ref}
        className={cn(
            'block mb-2 text-sm font-normal leading-none text-muted-foreground',
            className
        )}
        {...props}
    />
));
TimelineTime.displayName = 'TimelineTime';

const TimelineTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn('flex items-center mb-1 text-lg font-semibold', className)}
        {...props}
    />
));
TimelineTitle.displayName = 'TimelineTitle';

const TimelineDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn('mb-4 text-base font-normal text-muted-foreground', className)}
        {...props}
    />
));
TimelineDescription.displayName = 'TimelineDescription';

export {
    Timeline,
    TimelineItem,
    TimelineTime,
    TimelineTitle,
    TimelineDescription,
};
