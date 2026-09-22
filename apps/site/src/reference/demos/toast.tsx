import { useState } from "react";
import {
  Button,
  Stack,
  Text,
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@kozmos/react";
import type { DemoModule } from "../types";

function Saved() {
  const [open, setOpen] = useState(false);
  return (
    <ToastProvider>
      <Stack gap={3} align="start">
        <Text size="sm" color="muted">
          A toast appears at the viewport’s edge and leaves after a while. The
          provider and viewport wrap the app once; Toast is opened where the
          event happens.
        </Text>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Save the bookshop
        </Button>
      </Stack>
      <Toast open={open} onOpenChange={setOpen}>
        <Stack gap={1}>
          <ToastTitle>Saved</ToastTitle>
          <ToastDescription>
            The bookshop is in your favourites.
          </ToastDescription>
        </Stack>
        <ToastAction
          altText="Undo saving the bookshop"
          onClick={() => setOpen(false)}
        >
          Undo
        </ToastAction>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}

export const demos: DemoModule["demos"] = [
  {
    title: "Saved, with undo",
    description:
      "Title, description, an action with an altText for assistive technology, and a close button.",
    Component: Saved,
  },
];
