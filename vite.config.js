import { defineConfig } from 'vite';
import posthtml from '@vituum/vite-plugin-posthtml';

export default defineConfig({
  base: './', // Базовый путь для обработки маршрутов
  define: {
    global:'window',
  },
  plugins: [
    posthtml()
  ]
});
