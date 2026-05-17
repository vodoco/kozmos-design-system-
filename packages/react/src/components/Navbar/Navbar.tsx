import React from 'react';
import { cn } from '../../utils';

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
    logo?: React.ReactNode;
    actions?: React.ReactNode;
}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
    ({ className, logo, actions, children, ...props }, ref) => {
        return (
            <header
                ref={ref}
                className={cn(
                    'sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background px-4 shadow-sm',
                    className
                )}
                {...props}
            >
                <div className="flex items-center gap-4">
                    {logo}
                    <nav className="hidden md:flex items-center gap-4">{children}</nav>
                </div>
                <div className="flex items-center gap-4">{actions}</div>
            </header>
        );
    }
);
Navbar.displayName = 'Navbar';

export { Navbar };
