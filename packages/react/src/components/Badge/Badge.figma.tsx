import figma from '@figma/code-connect';
import { Badge } from './Badge';

figma.connect(Badge, "https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD", {
  props: {
    variant: figma.enum('Variant', {
      'Default': 'default',
      'Secondary': 'secondary',
      'Destructive': 'destructive',
      'Outline': 'outline'
    })
  },
  example: (props) => <Badge {...props}>Badge</Badge>
});
