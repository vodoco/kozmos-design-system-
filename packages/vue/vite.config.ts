import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
    plugins: [
        vue(),
        // dts({ insertTypesEntry: true }) // Temporarily disabled due to Node 24 v8 segfault during compilation
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'KozmosVue',
            fileName: (format) => `kozmos-vue.${format}.js`,
        },
        rollupOptions: {
            external: ['vue', 'react', 'react-dom', 'react-dom/client', '@kozmos/react'],
            output: {
                globals: {
                    vue: 'Vue',
                    react: 'React',
                    'react-dom': 'ReactDOM'
                }
            }
        }
    }
});
