import figma from "@figma/code-connect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";

const tabsUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=90-3387";

figma.connect(Tabs, tabsUrl, {
  props: {
    defaultValue: figma.enum("Active", {
      One: "one",
      Two: "two",
      Three: "three",
      Four: "four",
    }),
    disabled: figma.enum("State", {
      Default: false,
      Focus: false,
      Disabled: true,
    }),
    autoFocus: figma.enum("State", {
      Default: false,
      Focus: true,
      Disabled: false,
    }),
    tab1Text: figma.string("Tab 1 Text"),
    tab2Text: figma.string("Tab 2 Text"),
    tab3Text: figma.string("Tab 3 Text"),
    tab4Text: figma.string("Tab 4 Text"),
  },
  example: ({
    autoFocus,
    defaultValue,
    disabled,
    tab1Text,
    tab2Text,
    tab3Text,
    tab4Text,
  }) => (
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        <TabsTrigger autoFocus={autoFocus} disabled={disabled} value="one">
          {tab1Text}
        </TabsTrigger>
        <TabsTrigger disabled={disabled} value="two">
          {tab2Text}
        </TabsTrigger>
        <TabsTrigger disabled={disabled} value="three">
          {tab3Text}
        </TabsTrigger>
        <TabsTrigger disabled={disabled} value="four">
          {tab4Text}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="one">{tab1Text} content</TabsContent>
      <TabsContent value="two">{tab2Text} content</TabsContent>
      <TabsContent value="three">{tab3Text} content</TabsContent>
      <TabsContent value="four">{tab4Text} content</TabsContent>
    </Tabs>
  ),
});
