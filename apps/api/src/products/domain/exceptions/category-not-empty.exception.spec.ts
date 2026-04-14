import { CategoryNotEmptyException } from './category-not-empty.exception';

describe('CategoryNotEmptyException', () => {
  it('is an instance of Error', () => {
    const error = new CategoryNotEmptyException();
    expect(error).toBeInstanceOf(Error);
  });

  it('has the expected default message', () => {
    const error = new CategoryNotEmptyException();
    expect(error.message).toBe(
      'La categoría no puede eliminarse porque contiene productos',
    );
  });

  it('has the name CategoryNotEmptyException', () => {
    const error = new CategoryNotEmptyException();
    expect(error.name).toBe('CategoryNotEmptyException');
  });
});
