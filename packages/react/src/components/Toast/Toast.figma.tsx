import figma from "@figma/code-connect";
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./Toast";

const toastUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=101-8189";

figma.connect(Toast, toastUrl, {
  variant: { Content: "Basic" },
  props: {
    title: figma.string("Title Text"),
    description: figma.string("Description Text"),
  },
  example: ({ description, title }) => (
    <ToastProvider>
      <Toast open>
        <div className="grid gap-1">
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription>{description}</ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
});

figma.connect(Toast, toastUrl, {
  variant: { Content: "Action" },
  props: {
    title: figma.string("Title Text"),
    description: figma.string("Description Text"),
    action: figma.string("Action Text"),
  },
  example: ({ action, description, title }) => (
    <ToastProvider>
      <Toast open>
        <div className="grid gap-1">
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription>{description}</ToastDescription>
        </div>
        <ToastAction altText={action}>{action}</ToastAction>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
});
