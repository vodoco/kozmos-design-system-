import figma from '@figma/code-connect';
import { Drawer, DrawerContent } from './Drawer';
figma.connect(DrawerContent, "https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD", {
  props: { side: figma.enum('Side', { 'Top': 'top', 'Bottom': 'bottom', 'Left': 'left', 'Right': 'right' }) },
  example: (props) => (
    <Drawer>
      <DrawerContent {...props}>
        <div>Drawer Content</div>
      </DrawerContent>
    </Drawer>
  )
});
