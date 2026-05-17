import figma from '@figma/code-connect';
import { Slider } from './Slider';

/**
 * Figma Code Connect: Slider
 * @url https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD
 * 
 * TODO: Replace node-id=TBD with the exact Figma component node ID.
 */
figma.connect(Slider, "https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD", {
    props: { 
      disabled: figma.boolean('Disabled'), 
      // @ts-expect-error (SDK 1.3.18 is missing number signature)
      min: figma.number('Min'), 
      // @ts-expect-error (SDK 1.3.18 is missing number signature)
      max: figma.number('Max') 
    },
  example: ({ min, max, disabled }) => <Slider disabled={disabled} min={min} max={max} defaultValue={[min ?? 0]} />
});
