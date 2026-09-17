import type { Preview } from "@storybook/react";
import "../../../packages/react/dist/style.css";
import { DesignConfigProvider, ThemeProvider } from "@kozmos/react";

const preview: Preview = {
  decorators: [
    (Story, context) => (
      <ThemeProvider defaultTheme="light">
        <DesignConfigProvider>
          <main
            style={{
              minWidth: 0,
              padding: context.parameters.layout === "fullscreen" ? 0 : "2rem",
            }}
          >
            <Story />
          </main>
        </DesignConfigProvider>
      </ThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
