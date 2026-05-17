import figma from '@figma/code-connect';
import { Dialog, DialogContent, DialogTrigger } from './Dialog';

/**
 * Figma Code Connect: Dialog
 * @url https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD
 * 
 * TODO: Replace node-id=TBD with the exact Figma component node ID.
 */
figma.connect(DialogContent, "https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD", {
    props: { children: figma.children('*') } /* Connect to DialogContent */,
  example: (props) => (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent {...props} />
    </Dialog>
  )
});
