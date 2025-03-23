import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/utils/index.ts'),
      name: 'KwayTeowUtils',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        preserveModules: true,
        preserveModulesRoot: 'src/utils',
        entryFileNames: '[name].js',
      },
    },
  },
  plugins: [dts({
    exclude: ['**/*.test.ts', '**/*.spec.ts', '**/test/**'],
  })],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'istanbul', // or 'v8'
      include: ['src/utils/**/*.ts'],
      exclude: ['src/utils/**/*.test.ts', 'src/utils/**/*.spec.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
})
