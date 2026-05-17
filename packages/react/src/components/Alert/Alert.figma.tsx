import figma from '@figma/code-connect';
import { Alert } from './Alert';
figma.connect(Alert, "https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD", {
  props: {
    variant: figma.enum('Variant', {
      'Default': 'default',
      'Destructive': 'destructive',
      'Success': 'success',
      'Warning': 'warning',
      'Info': 'info'
    }),
    title: figma.string('Title')
  },
  example: (props) => <Alert {...props} />
});
