import { Stack } from './Stack';
import figma from '@figma/code-connect';

figma.connect(Stack, 'https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD', {
    props: {
        children: figma.children('*'),
        direction: figma.enum('Direction', {
            Horizontal: 'row',
            Vertical: 'column',
            'Horizontal Reverse': 'row-reverse',
            'Vertical Reverse': 'column-reverse',
        }),
    },
    example: (props) => <Stack {...props} />,
});
