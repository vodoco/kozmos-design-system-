import type { Preview } from "@storybook/vue3";
import '../../../packages/react/dist/style.css'; // Inheriting universal styles statically

const preview: Preview = {
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
