import { ProductSlugService } from './product-slug.service';
import { SlugGenerator } from './slug-generator';
import { ProductRepository } from '../repositories/product.repository';

describe('ProductSlugService', () => {
  let service: ProductSlugService;
  let slugGenerator: SlugGenerator;
  let repository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    slugGenerator = new SlugGenerator();
    repository = {
      isSlugAvailable: jest.fn(),
      findMaxSlugSuffix: jest.fn(),
      findProducts: jest.fn(),
      findProductBySlug: jest.fn(),
      findCategories: jest.fn(),
    } as any;
    service = new ProductSlugService(slugGenerator, repository);
  });

  it('should return base slug if it is available', async () => {
    const name = 'Mesa Comedor';
    repository.isSlugAvailable.mockResolvedValue(true);

    const slug = await service.generateUniqueSlug(name);

    expect(slug).toBe('mesa-comedor');
    expect(repository.isSlugAvailable).toHaveBeenCalledWith('mesa-comedor');
  });

  it('should append suffix -1 if base slug is not available and no other suffixes exist', async () => {
    const name = 'Mesa Comedor';
    repository.isSlugAvailable.mockResolvedValue(false);
    repository.findMaxSlugSuffix.mockResolvedValue(0); // Only base exists

    const slug = await service.generateUniqueSlug(name);

    expect(slug).toBe('mesa-comedor-1');
  });

  it('should increment suffix if multiple suffixes exist', async () => {
    const name = 'Mesa Comedor';
    repository.isSlugAvailable.mockResolvedValue(false);
    repository.findMaxSlugSuffix.mockResolvedValue(2); // mesa-comedor-2 exists

    const slug = await service.generateUniqueSlug(name);

    expect(slug).toBe('mesa-comedor-3');
  });
});
