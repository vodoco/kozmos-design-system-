import figma from '@figma/code-connect';
import { SplitButton } from './SplitButton';

figma.connect(SplitButton, "https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD", {
  props: { 
      disabled: figma.boolean('Disabled'),
      size: figma.enum('Size', { Small: 'sm', Default: 'default', Large: 'lg' })
  },
  example: (props) => (
    <SplitButton 
      {...props} 
      onMainClick={() => {}} 
      menuItems={[
        { label: 'Action 1', onClick: () => {} },
        { label: 'Action 2', onClick: () => {} }
      ]} 
    />
  )
});