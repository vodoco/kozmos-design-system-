import figma from '@figma/code-connect';
import { Switch } from './Switch';

/**
 * Figma Code Connect: Switch
 * @url https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD
 * 
 * TODO: Replace node-id=TBD with the exact Figma component node ID.
 */
figma.connect(Switch, "https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD", {
    props: { checked: figma.boolean('Checked'), disabled: figma.boolean('Disabled') },
  example: (props) => <Switch {...props} />
});
