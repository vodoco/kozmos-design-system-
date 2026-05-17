import figma from '@figma/code-connect';
import { Input } from './Input';

/**
 * Figma Code Connect: Input
 * @url https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD
 * 
 * TODO: Replace node-id=TBD with the exact Figma component node ID.
 */
figma.connect(Input, "https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD", {
    props: { disabled: figma.boolean('Disabled'), error: figma.boolean('Error'), placeholder: figma.string('Placeholder') },
  example: (props) => <Input {...props} />
});
