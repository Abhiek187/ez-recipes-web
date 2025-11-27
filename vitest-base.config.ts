// Learn more about Vitest configuration options at https://vitest.dev/config/

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    fakeTimers: {
      now: new Date(),
    },
    globals: true,
    isolate: true,
    setupFiles: './src/test.ts',
  },
});
