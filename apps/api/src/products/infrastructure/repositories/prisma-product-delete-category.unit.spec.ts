import { Prisma } from '@mayve/database';
import { PrismaProductRepository } from './prisma-product.repository';
import { CategoryNotEmptyException } from '../../domain/exceptions/category-not-empty.exception';

function makeRepository(categoryDelete: jest.Mock): PrismaProductRepository {
  const mockPrismaService = { category: { delete: categoryDelete } } as any;
  return new PrismaProductRepository(mockPrismaService);
}

describe('PrismaProductRepository - deleteCategory', () => {
  it('resolves to true when deletion succeeds', async () => {
    const mockDelete = jest.fn().mockResolvedValue({});
    const repository = makeRepository(mockDelete);

    const result = await repository.deleteCategory('cat-1');

    expect(result).toBe(true);
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: 'cat-1' } });
  });

  it('throws CategoryNotEmptyException when Prisma reports P2003 foreign key violation', async () => {
    const p2003 = new Prisma.PrismaClientKnownRequestError(
      'Foreign key constraint failed on the field: `Product_categoryId_fkey`',
      { code: 'P2003', clientVersion: '5.0.0' },
    );
    const mockDelete = jest.fn().mockRejectedValue(p2003);
    const repository = makeRepository(mockDelete);

    await expect(repository.deleteCategory('cat-has-products')).rejects.toThrow(
      CategoryNotEmptyException,
    );
  });

  it('re-throws unrelated Prisma errors without wrapping in CategoryNotEmptyException', async () => {
    const p2025 = new Prisma.PrismaClientKnownRequestError(
      'Record to delete does not exist.',
      { code: 'P2025', clientVersion: '5.0.0' },
    );
    const mockDelete = jest.fn().mockRejectedValue(p2025);
    const repository = makeRepository(mockDelete);

    await expect(repository.deleteCategory('nonexistent-id')).rejects.not.toThrow(
      CategoryNotEmptyException,
    );
    await expect(repository.deleteCategory('nonexistent-id')).rejects.toBeInstanceOf(
      Prisma.PrismaClientKnownRequestError,
    );
  });
});
