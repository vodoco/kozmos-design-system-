import figma from '@figma/code-connect';
import { FloatingActionButton } from './FloatingActionButton';

/**
 * Figma Code Connect: FloatingActionButton
 * @url https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD
 */
figma.connect(FloatingActionButton, "https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD", {
  props: { disabled: figma.boolean('Disabled') },
  example: (props) => <FloatingActionButton {...props} />
});