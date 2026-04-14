export class CategoryNotEmptyException extends Error {
  constructor() {
    super('La categoría no puede eliminarse porque contiene productos');
    this.name = 'CategoryNotEmptyException';
  }
}
