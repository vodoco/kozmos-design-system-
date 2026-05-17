import React from 'react';
import { cn } from '../../utils';

const List = React.forwardRef<
    HTMLUListElement,
    React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)}
        {...props}
    />
));
List.displayName = 'List';

const ListItem = React.forwardRef<
    HTMLLIElement,
    React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
    <li ref={ref} className={cn(className)} {...props} />
));
ListItem.displayName = 'ListItem';

export { List, ListItem };
