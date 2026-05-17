import figma from '@figma/code-connect';
import { RadioGroup, RadioGroupItem } from './Radio';
figma.connect(RadioGroupItem, "https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD", {
  props: { disabled: figma.boolean('Disabled'), value: figma.string('Value') },
  example: (props) => (
    <RadioGroup defaultValue={props.value}>
      <RadioGroupItem {...props} />
    </RadioGroup>
  )
});
