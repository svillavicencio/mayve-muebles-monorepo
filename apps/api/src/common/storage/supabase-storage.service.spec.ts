import { SupabaseStorageService } from './supabase-storage.service';
import { SupabaseService } from '../supabase/supabase.service';

const mockUpload = jest.fn();
const mockGetPublicUrl = jest.fn();
const mockRemove = jest.fn();
const mockFrom = jest.fn(() => ({
  upload: mockUpload,
  getPublicUrl: mockGetPublicUrl,
  remove: mockRemove,
}));

const mockSupabaseService = {
  adminClient: {
    storage: {
      from: mockFrom,
    },
  },
} as unknown as SupabaseService;

describe('SupabaseStorageService', () => {
  let service: SupabaseStorageService;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SUPABASE_STORAGE_BUCKET = 'product-images';
    service = new SupabaseStorageService(mockSupabaseService);
  });

  describe('saveFile', () => {
    it('should upload file to Supabase and return public URL', async () => {
      const mockFile = {
        originalname: 'photo.png',
        buffer: Buffer.from('img-data'),
        mimetype: 'image/png',
      } as Express.Multer.File;

      mockUpload.mockResolvedValueOnce({ data: { path: 'abc-uuid.png' }, error: null });
      mockGetPublicUrl.mockReturnValueOnce({
        data: { publicUrl: 'https://project.supabase.co/storage/v1/object/public/product-images/products/abc-uuid.png' },
      });

      const url = await service.saveFile(mockFile);

      expect(mockFrom).toHaveBeenCalledWith('product-images');
      expect(mockUpload).toHaveBeenCalledWith(
        expect.stringMatching(/^products\/.+\.png$/),
        mockFile.buffer,
        { contentType: 'image/png', upsert: false },
      );
      expect(url).toBe('https://project.supabase.co/storage/v1/object/public/product-images/products/abc-uuid.png');
    });

    it('should generate a unique path for each file', async () => {
      const mockFile = {
        originalname: 'image.jpg',
        buffer: Buffer.from('img'),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      mockUpload.mockResolvedValue({ data: { path: 'some-path.jpg' }, error: null });
      mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://example.com/img.jpg' } });

      await service.saveFile(mockFile);
      await service.saveFile(mockFile);

      const firstCall = mockUpload.mock.calls[0][0] as string;
      const secondCall = mockUpload.mock.calls[1][0] as string;
      expect(firstCall).not.toBe(secondCall);
    });

    it('should throw an error when Supabase upload fails', async () => {
      const mockFile = {
        originalname: 'photo.png',
        buffer: Buffer.from('img-data'),
        mimetype: 'image/png',
      } as Express.Multer.File;

      mockUpload.mockResolvedValueOnce({ data: null, error: { message: 'Upload failed' } });

      await expect(service.saveFile(mockFile)).rejects.toThrow('Upload failed');
    });
  });

  describe('deleteFile', () => {
    it('should delete file from Supabase using the URL path', async () => {
      const publicUrl =
        'https://project.supabase.co/storage/v1/object/public/product-images/products/abc-uuid.png';

      mockRemove.mockResolvedValueOnce({ data: {}, error: null });

      await service.deleteFile(publicUrl);

      expect(mockFrom).toHaveBeenCalledWith('product-images');
      expect(mockRemove).toHaveBeenCalledWith(['products/abc-uuid.png']);
    });

    it('should throw an error when Supabase delete fails', async () => {
      mockRemove.mockResolvedValueOnce({ data: null, error: { message: 'Delete failed' } });

      await expect(
        service.deleteFile('https://project.supabase.co/storage/v1/object/public/product-images/products/x.png'),
      ).rejects.toThrow('Delete failed');
    });
  });
});
