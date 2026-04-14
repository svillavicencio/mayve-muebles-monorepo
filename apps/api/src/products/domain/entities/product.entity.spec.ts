import { Product } from './product.entity';

describe('Product Entity', () => {
  const validProductData = {
    id: '1',
    name: 'Table',
    slug: 'table',
    description: 'A wooden table',
    price: 100,
    categoryId: 'cat1',
    leadTime: 7,
    isCustomizable: true,
    listPrice: 120,
    cashDiscountPrice: 90,
    inStock: true,
    requiresAssembly: true,
    images: ['image1.jpg'],
  };

  it('should initialize correctly with at least one image', () => {
    const product = new Product(
      validProductData.id,
      validProductData.name,
      validProductData.slug,
      validProductData.description,
      validProductData.price,
      validProductData.categoryId,
      validProductData.leadTime,
      validProductData.isCustomizable,
      validProductData.listPrice,
      validProductData.cashDiscountPrice,
      validProductData.inStock,
      validProductData.requiresAssembly,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      validProductData.images,
    );
    expect(product.images).toHaveLength(1);
    expect(product.images[0]).toBe('image1.jpg');
  });

  it('should throw an error when initialized with zero images', () => {
    expect(() => {
      new Product(
        validProductData.id,
        validProductData.name,
        validProductData.slug,
        validProductData.description,
        validProductData.price,
        validProductData.categoryId,
        validProductData.leadTime,
        validProductData.isCustomizable,
        validProductData.listPrice,
        validProductData.cashDiscountPrice,
        validProductData.inStock,
        validProductData.requiresAssembly,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        [],
      );
    }).toThrow('El producto debe tener al menos una imagen');
  });
});
