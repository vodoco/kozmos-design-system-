import figma from '@figma/code-connect';
import { Button } from './Button';

/**
 * Validated Code Connect definition natively mapping physical React 
 * props securely up to the Figma Dev Mode variables dynamically!
 */
figma.connect(
  Button,
  'https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD',
  {
    props: {
        variant: figma.enum('Variant', {
            Default: 'default',
            Secondary: 'secondary',
            Destructive: 'destructive',
            Outline: 'outline',
            Ghost: 'ghost',
            Link: 'link',
            Glass: 'glass'
        }),
        children: figma.string('Label Text'),
        disabled: figma.boolean('Disabled'),
    },
    example: ({ variant, children, disabled }) => (
      <Button variant={variant} disabled={disabled}>
        {children}
      </Button>
    ),
  }
);
