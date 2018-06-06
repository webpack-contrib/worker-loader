import { pitch } from '../src';

describe('Errors', () => {
  test('Loader Error', () => {
    const fn = () => pitch.call({ webpack: false, query: {} });

    expect(fn).toThrowErrorMatchingSnapshot();
  });

  test('Validation Error', () => {
    const fn = () => pitch.call({ query: { name: 1 } });

    expect(fn).toThrowErrorMatchingSnapshot();
  });
});
