import figma from '@figma/code-connect';
import { Checkbox } from './Checkbox';

/**
 * Figma Code Connect: Checkbox
 * @url https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD
 * 
 * TODO: Replace node-id=TBD with the exact Figma component node ID.
 */
figma.connect(Checkbox, "https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD", {
    props: { checked: figma.boolean('Checked'), disabled: figma.boolean('Disabled') },
  example: (props) => <Checkbox {...props} />
});
