import figma from '@figma/code-connect';
import { Progress } from './Progress';

/**
 * Figma Code Connect: Progress
 * @url https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD
 * 
 * TODO: Replace node-id=TBD with the exact Figma component node ID.
 */
figma.connect(Progress, "https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD", {
    props: { 
      // @ts-expect-error (SDK 1.3.18 is missing number signature on definition despite Native support)
      value: figma.number('Value') 
    },
  example: ({ value }) => <Progress value={value} />
});
