import figma from '@figma/code-connect';
import { ToggleButton } from './ToggleButton';
figma.connect(ToggleButton, "https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD", {
  props: { 
    variant: figma.enum('Variant', { 'Default': 'default', 'Outline': 'outline' }), 
    pressed: figma.boolean('Pressed'), 
    disabled: figma.boolean('Disabled') 
  },
  example: (props) => <ToggleButton {...props} />
});