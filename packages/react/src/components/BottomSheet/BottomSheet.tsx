import React from 'react';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription } from '../Drawer';
import { cn } from '../../utils';

const BottomSheet = Drawer;
const BottomSheetTrigger = DrawerTrigger;
const BottomSheetClose = DrawerClose;

const BottomSheetContent = React.forwardRef<
    React.ElementRef<typeof DrawerContent>,
    React.ComponentPropsWithoutRef<typeof DrawerContent>
>(({ className, children, ...props }, ref) => (
    <DrawerContent
        ref={ref}
        side="bottom"
        className={cn(
            'inset-x-0 bottom-0 mt-24 flex h-auto flex-col rounded-t-md border-t bg-background',
            className
        )}
        {...props}
    >
        <div className="mx-auto mt-4 h-2 w-24 rounded-full bg-muted" />
        {children}
    </DrawerContent>
));
BottomSheetContent.displayName = 'BottomSheetContent';

const BottomSheetHeader = DrawerHeader;
const BottomSheetFooter = DrawerFooter;
const BottomSheetTitle = DrawerTitle;
const BottomSheetDescription = DrawerDescription;

export {
    BottomSheet,
    BottomSheetTrigger,
    BottomSheetClose,
    BottomSheetContent,
    BottomSheetHeader,
    BottomSheetFooter,
    BottomSheetTitle,
    BottomSheetDescription,
};
