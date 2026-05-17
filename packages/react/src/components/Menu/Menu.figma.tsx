import figma from '@figma/code-connect';
import { Menu, MenuContent, MenuTrigger } from './Menu';

/**
 * Figma Code Connect: Menu
 * @url https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD
 * 
 * TODO: Replace node-id=TBD with the exact Figma component node ID.
 */
figma.connect(MenuContent, "https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD", {
    props: { children: figma.children('*') } /* Connect to MenuContent */,
  example: (props) => (
    <Menu>
      <MenuTrigger>Open</MenuTrigger>
      <MenuContent {...props} />
    </Menu>
  )
});
