import { pitch } from '../src';

describe('Errors', () => {
  test('Loader Error', () => {
    const error = () => pitch.call({ webpack: false, query: {} });

    expect(error).toThrow();
    expect(error).toThrowErrorMatchingSnapshot();
  });

  test('Validation Error', () => {
    const error = () => pitch.call({ query: { name: 1 } });

    expect(error).toThrow();
    expect(error).toThrowErrorMatchingSnapshot();
  });
});
