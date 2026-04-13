import { fetchCategories } from '../api-client';

describe('fetchCategories', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns parsed category array when response is OK', async () => {
    const mockCategories = [
      { id: 'cat-1', name: 'Salas', slug: 'salas' },
      { id: 'cat-2', name: 'Comedores', slug: 'comedores' },
    ];
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockCategories,
    } as Response);

    const result = await fetchCategories();

    expect(result).toEqual(mockCategories);
    expect(result).toHaveLength(2);
    expect((result as typeof mockCategories)[0].name).toBe('Salas');
  });

  it('throws a descriptive error when response is not OK', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
    } as Response);

    await expect(fetchCategories()).rejects.toThrow('Error fetching categories: Not Found');
  });
});
