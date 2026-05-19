import figma from "@figma/code-connect";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { Label } from "../Label/Label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./Dialog";

const dialogUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=101-8101";

figma.connect(DialogContent, dialogUrl, {
  variant: { Content: "Basic" },
  props: {
    title: figma.string("Title Text"),
    description: figma.string("Description Text"),
    body: figma.string("Body Text"),
  },
  example: ({ body, description, title }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <p>{body}</p>
      </DialogContent>
    </Dialog>
  ),
});

figma.connect(DialogContent, dialogUrl, {
  variant: { Content: "Form" },
  props: {
    title: figma.string("Title Text"),
    description: figma.string("Description Text"),
    body: figma.string("Body Text"),
    primaryAction: figma.string("Primary Action Text"),
  },
  example: ({ body, description, primaryAction, title }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>{body}</p>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">{primaryAction}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
});

figma.connect(DialogContent, dialogUrl, {
  variant: { Content: "Footer" },
  props: {
    title: figma.string("Title Text"),
    description: figma.string("Description Text"),
    body: figma.string("Body Text"),
    primaryAction: figma.string("Primary Action Text"),
    secondaryAction: figma.string("Secondary Action Text"),
  },
  example: ({ body, description, primaryAction, secondaryAction, title }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Review changes</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <p>{body}</p>
        <DialogFooter>
          <Button variant="outline">{secondaryAction}</Button>
          <Button>{primaryAction}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
});
