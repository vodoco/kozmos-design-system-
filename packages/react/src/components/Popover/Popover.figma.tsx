import figma from '@figma/code-connect';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';

/**
 * Figma Code Connect: Popover
 * @url https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD
 * 
 * TODO: Replace node-id=TBD with the exact Figma component node ID.
 */
figma.connect(PopoverContent, "https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD", {
    props: { children: figma.children('*') } /* Connect to PopoverContent */,
  example: (props) => (
    <Popover>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent {...props} />
    </Popover>
  )
});
