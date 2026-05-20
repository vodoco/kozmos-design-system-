import figma from "@figma/code-connect";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./Accordion";

const accordionUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-977";

figma.connect(Accordion, accordionUrl, {
  variant: { State: "Closed" },
  props: {
    trigger: figma.string("Trigger Text"),
  },
  example: ({ trigger }) => (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>{trigger}</AccordionTrigger>
      </AccordionItem>
    </Accordion>
  ),
});

figma.connect(Accordion, accordionUrl, {
  variant: { State: "Open" },
  props: {
    trigger: figma.string("Trigger Text"),
    content: figma.string("Content Text"),
  },
  example: ({ content, trigger }) => (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>{trigger}</AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
});
