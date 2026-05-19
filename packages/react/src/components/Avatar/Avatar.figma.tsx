import figma from "@figma/code-connect";
import { Avatar, AvatarImage, AvatarFallback } from "./Avatar";
figma.connect(
  Avatar,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=83-272",
  {
    props: {
      src: figma.string("Image URL"),
      alt: figma.string("Alt Text"),
      fallback: figma.string("Fallback"),
    },
    example: (props) => (
      <Avatar>
        <AvatarImage src={props.src} alt={props.alt} />
        <AvatarFallback>{props.fallback}</AvatarFallback>
      </Avatar>
    ),
  },
);
