import figma from "@figma/code-connect";
import { Navbar } from "./Navbar";

const navbarUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=752-6765";

const navbarProps = {
  actions: figma.slot("Actions Slot"),
  account: figma.slot("Account Slot"),
  context: figma.slot("Context Slot"),
  logo: figma.slot("Logo Slot"),
  navigation: figma.slot("Navigation Slot"),
  primaryAction: figma.slot("Primary Action Slot"),
  utilities: figma.slot("Utility Slot"),
};

figma.connect(Navbar, navbarUrl, {
  variant: { Content: "Basic" },
  props: navbarProps,
  example: ({ logo, navigation }) => (
    <Navbar logo={logo} navigation={navigation} />
  ),
});

figma.connect(Navbar, navbarUrl, {
  variant: { Content: "Actions" },
  props: navbarProps,
  example: ({ actions, logo, navigation }) => (
    <Navbar actions={actions} logo={logo} navigation={navigation} />
  ),
});

figma.connect(Navbar, navbarUrl, {
  variant: { Content: "Contextual" },
  props: navbarProps,
  example: ({
    account,
    context,
    logo,
    navigation,
    primaryAction,
    utilities,
  }) => (
    <Navbar
      account={account}
      context={context}
      logo={logo}
      navigation={navigation}
      primaryAction={primaryAction}
      utilities={utilities}
    />
  ),
});
