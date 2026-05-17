import figma from '@figma/code-connect';
import { Avatar, AvatarImage, AvatarFallback } from './Avatar';
figma.connect(Avatar, "https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD", {
  props: {
    src: figma.string('Image URL'),
    alt: figma.string('Alt Text'),
    fallback: figma.string('Fallback')
  },
  example: (props) => (
    <Avatar>
      <AvatarImage src={props.src} alt={props.alt} />
      <AvatarFallback>{props.fallback}</AvatarFallback>
    </Avatar>
  )
});
