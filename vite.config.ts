import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
// import process from 'process';

// const isDev = process.env.NODE_ENV !== 'production';

// https://vitejs.dev/config/
export default defineConfig({
    // base: isDev ? "/" : '/react-music/',
    server: {
        port: 4000
    },
    plugins: [react()],
    resolve: {
        alias: {
            Components: path.join(__dirname, './src/components'),
            Apis: path.join(__dirname, './src/apis'),
            AppContainer: path.join(__dirname, './src/containers'),
            Utils: path.join(__dirname, './src/utils')
        }
    }
})

