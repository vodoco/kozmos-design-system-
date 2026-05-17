import figma from '@figma/code-connect';
import { Select, SelectTrigger, SelectValue } from './Select';

figma.connect(SelectTrigger, "https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD", {
  props: {
    disabled: figma.boolean('Disabled'),
    error: figma.boolean('Error'),
  },
  example: (props) => (
    <Select>
      <SelectTrigger {...props}>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
    </Select>
  )
});
