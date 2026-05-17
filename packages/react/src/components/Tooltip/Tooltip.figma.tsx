import figma from '@figma/code-connect';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from './Tooltip';

/**
 * Figma Code Connect: Tooltip
 * @url https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD
 * 
 * TODO: Replace node-id=TBD with the exact Figma component node ID.
 */
figma.connect(TooltipContent, "https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD", {
    props: { children: figma.children('*') } /* Connect to TooltipContent */,
  example: (props) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent {...props} />
      </Tooltip>
    </TooltipProvider>
  )
});
