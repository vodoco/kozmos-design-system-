import figma from '@figma/code-connect';
import { IconButton } from './IconButton';

/**
 * Figma Code Connect: IconButton
 * @url https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD
 */
figma.connect(IconButton, "https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD", {
  props: { variant: figma.enum('Variant', { 'Default': 'default', 'Destructive': 'destructive', 'Outline': 'outline', 'Secondary': 'secondary', 'Ghost': 'ghost', 'Link': 'link', 'Glass': 'glass' }), disabled: figma.boolean('Disabled') },
  example: (props) => <IconButton {...props} />
});