
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import path from 'path'

export default defineConfig(async () => {
    let visualizerPlugin = null;
    if (process.env.ANALYZE) {
        const { visualizer } = await import('rollup-plugin-visualizer');
        visualizerPlugin = visualizer({ filename: 'dist/stats.html', open: false });
    }

    return {
        plugins: [
            react(),
            dts({
                insertTypesEntry: true,
            }),
            visualizerPlugin,
        ].filter(Boolean),
    css: {
        postcss: {
            plugins: [
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                require('tailwindcss'),
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                require('autoprefixer'),
            ],
        },
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'KozmosReact',
            fileName: (format: string) => `kozmos-react.${format}.js`,
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime', 'tailwindcss'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    tailwindcss: 'tailwindcss',
                },
            },
        },
        },
    };
});
