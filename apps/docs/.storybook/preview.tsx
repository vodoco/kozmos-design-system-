
import type { Preview } from "@storybook/react";
import '../../../packages/react/dist/style.css';
import { DesignConfigProvider } from '@kozmos/react';

const preview: Preview = {
    decorators: [
        (Story) => (
            <DesignConfigProvider>
                <main style={{ padding: '2rem' }}>
                    <Story />
                </main>
            </DesignConfigProvider>
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
