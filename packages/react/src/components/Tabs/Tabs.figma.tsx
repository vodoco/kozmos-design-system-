import figma from '@figma/code-connect';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';

/**
 * Figma Code Connect: Tabs
 * @url https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD
 * 
 * TODO: Replace node-id=TBD with the exact Figma component node ID.
 */
figma.connect(TabsList, "https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD", {
    props: { children: figma.children('*') } /* Connect to TabsList */,
  example: (props) => (
    <Tabs defaultValue="1">
      <TabsList {...props}>
        <TabsTrigger value="1">Tab 1</TabsTrigger>
      </TabsList>
      <TabsContent value="1">Content</TabsContent>
    </Tabs>
  )
});
