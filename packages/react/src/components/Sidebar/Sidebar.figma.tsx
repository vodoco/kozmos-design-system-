import figma from "@figma/code-connect";
import { Sidebar } from "./Sidebar";

const sidebarUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=752-6807";

const sidebarProps = {
  footer: figma.slot("Footer Slot"),
  header: figma.slot("Header Slot"),
  navigation: figma.slot("Navigation Slot"),
  tools: figma.slot("Tools Slot"),
};

figma.connect(Sidebar, sidebarUrl, {
  variant: { Content: "Basic" },
  props: sidebarProps,
  example: ({ footer, header, navigation }) => (
    <Sidebar footer={footer} header={header} navigation={navigation} />
  ),
});

figma.connect(Sidebar, sidebarUrl, {
  variant: { Content: "Sections" },
  props: sidebarProps,
  example: ({ footer, header, navigation }) => (
    <Sidebar footer={footer} header={header} navigation={navigation} />
  ),
});

figma.connect(Sidebar, sidebarUrl, {
  variant: { Content: "Tools" },
  props: sidebarProps,
  example: ({ footer, header, navigation, tools }) => (
    <Sidebar
      footer={footer}
      header={header}
      navigation={navigation}
      tools={tools}
    />
  ),
});

figma.connect(Sidebar, sidebarUrl, {
  variant: { Content: "Rail" },
  props: sidebarProps,
  example: ({ footer, header, navigation }) => (
    <Sidebar
      footer={footer}
      header={header}
      navigation={navigation}
      variant="rail"
    />
  ),
});
