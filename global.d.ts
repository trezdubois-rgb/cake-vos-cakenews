import type { JestAxeMatchers } from 'jest-axe';
declare global {
  namespace jest {
    interface Matchers<R> extends JestAxeMatchers<R> {}
  }
}
