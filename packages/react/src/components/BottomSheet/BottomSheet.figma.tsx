import figma from "@figma/code-connect";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "./BottomSheet";

const bottomSheetUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=624-4362";

const bottomSheetProps = {
  children: figma.slot("Content Slot"),
  description: figma.string("Description Text"),
  title: figma.string("Title Text"),
};

figma.connect(BottomSheetContent, bottomSheetUrl, {
  variant: { Content: "Basic" },
  props: bottomSheetProps,
  example: ({ children, description, title }) => (
    <BottomSheet>
      <BottomSheetTrigger>Open sheet</BottomSheetTrigger>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetTitle>{title}</BottomSheetTitle>
          <BottomSheetDescription>{description}</BottomSheetDescription>
        </BottomSheetHeader>
        {children}
      </BottomSheetContent>
    </BottomSheet>
  ),
});

figma.connect(BottomSheetContent, bottomSheetUrl, {
  variant: { Content: "Form" },
  props: bottomSheetProps,
  example: ({ children, description, title }) => (
    <BottomSheet>
      <BottomSheetTrigger>Open sheet</BottomSheetTrigger>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetTitle>{title}</BottomSheetTitle>
          <BottomSheetDescription>{description}</BottomSheetDescription>
        </BottomSheetHeader>
        {children}
      </BottomSheetContent>
    </BottomSheet>
  ),
});

figma.connect(BottomSheetContent, bottomSheetUrl, {
  variant: { Content: "Footer" },
  props: bottomSheetProps,
  example: ({ children, description, title }) => (
    <BottomSheet>
      <BottomSheetTrigger>Open sheet</BottomSheetTrigger>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetTitle>{title}</BottomSheetTitle>
          <BottomSheetDescription>{description}</BottomSheetDescription>
        </BottomSheetHeader>
        {children}
      </BottomSheetContent>
    </BottomSheet>
  ),
});
