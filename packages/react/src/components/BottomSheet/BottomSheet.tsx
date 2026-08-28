import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "../Drawer";
import { X } from "lucide-react";
import { cn } from "../../utils";

const BottomSheet = Drawer;
const BottomSheetTrigger = DrawerTrigger;
const BottomSheetClose = DrawerClose;

const BottomSheetContent = React.forwardRef<
  React.ElementRef<typeof DrawerContent>,
  React.ComponentPropsWithoutRef<typeof DrawerContent>
>(({ className, children, showClose = true, ...props }, ref) => (
  <DrawerContent
    ref={ref}
    side="bottom"
    showClose={false}
    className={cn(
      "inset-x-0 bottom-0 mt-24 flex h-auto max-h-[calc(100dvh-env(safe-area-inset-top)-1rem)] flex-col overscroll-contain rounded-t-container border-t bg-background !px-4 !pb-[max(1.5rem,env(safe-area-inset-bottom))] !pt-0",
      className,
    )}
    {...props}
  >
    <div
      aria-hidden="true"
      className="mx-auto my-2 h-[5px] w-12 shrink-0 rounded-pill bg-muted-foreground/40"
    />
    {children}
    {showClose ? (
      <BottomSheetClose className="absolute right-0 top-2 inline-flex h-11 w-11 items-start justify-end rounded-control p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none">
        <X aria-hidden="true" className="h-4 w-4" />
        <span className="sr-only">Close bottom sheet</span>
      </BottomSheetClose>
    ) : null}
  </DrawerContent>
));
BottomSheetContent.displayName = "BottomSheetContent";

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
