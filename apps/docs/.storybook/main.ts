
import type { StorybookConfig } from "@storybook/react-vite";
import { dirname, join } from "path";

function getAbsolutePath(value: string): any {
    return dirname(require.resolve(join(value, "package.json")));
}

const config: StorybookConfig = {
    stories: [
        '../src/**/*.mdx',
        '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
        "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
        "../../../packages/react/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
        "../../../packages/react/src/**/*.mdx"
    ],
    addons: [
        getAbsolutePath("@storybook/addon-links"),
        getAbsolutePath("@storybook/addon-essentials"),
        getAbsolutePath("@storybook/addon-interactions"),
        getAbsolutePath("@storybook/addon-a11y"),
        getAbsolutePath("storybook-addon-performance"),
    ],
    framework: {
        name: getAbsolutePath("@storybook/react-vite"),
        options: {},
    },
    docs: {
        autodocs: "tag",
    },
    typescript: {
        reactDocgen: 'react-docgen-typescript',
        reactDocgenTypescriptOptions: {
            compilerOptions: {
                allowSyntheticDefaultImports: true,
                esModuleInterop: true,
            },
            propFilter: () => true,
        },
    },
    refs: {
        vue: {
            title: "Kozmos Vue Components",
            url: process.env.NODE_ENV === 'production' ? "/vue/" : "http://localhost:6007",
        },
    },
    async viteFinal(config) {
        config.server = config.server || {};
        config.server.fs = config.server.fs || {};
        // Allow serving files from one level up to the project root
        // apps/docs -> apps -> root
        config.server.fs.allow = ['../..'];

        // Physically force Vite to pre-compile the entire dependency graph instantly
        // bypassing the 2-minute 5-10x esbuild cache thrashing sequence natively.
        config.optimizeDeps = config.optimizeDeps || {};
        config.optimizeDeps.include = [
            ...(config.optimizeDeps.include || []),
            '@mdx-js/react',
            '@storybook/blocks',
            '@storybook/react',
            '@storybook/test',
            '@storybook/components',
            '@storybook/theming',
            '@storybook/manager-api',
            'react',
            'react-dom'
        ];

        return config;
    },
};
export default config;
