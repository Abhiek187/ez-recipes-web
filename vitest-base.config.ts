// Learn more about Vitest configuration options at https://vitest.dev/config/

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    isolate: true,
    setupFiles: './src/test.ts',
    fakeTimers: {
      now: new Date(),
    },
  },
});
