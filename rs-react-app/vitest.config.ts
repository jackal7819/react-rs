import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      include: [
        'src/api/**',
        'src/components/**',
        'src/features/**',
        'src/routes/**',
        'src/utils/**',
      ],
      exclude: [
        '**/*.d.ts',
        'src/types/**',
        'src/routeTree.gen.ts',
        'src/reportWebVitals.ts',
        'src/main.tsx',
        '**/node_modules/**',
        '**/dist/**',
        '**/*.config.{ts,js}',
      ],
    },
  },
});
