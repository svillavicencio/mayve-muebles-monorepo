import * as fs from 'fs';
import * as path from 'path';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  const testUploadDir = path.join(__dirname, '../../../../public/test-uploads');

  beforeEach(() => {
    service = new LocalStorageService(testUploadDir);
  });

  afterAll(() => {
    if (fs.existsSync(testUploadDir)) {
      fs.rmSync(testUploadDir, { recursive: true, force: true });
    }
  });

  it('should save a file and return its URL', async () => {
    const fileName = 'test.txt';
    const content = Buffer.from('hello world');
    const mockFile = {
      originalname: fileName,
      buffer: content,
      mimetype: 'text/plain',
    } as Express.Multer.File;

    const url = await service.saveFile(mockFile);

    expect(url).toContain('/uploads/');
    const savedFilePath = path.join(testUploadDir, path.basename(url));
    expect(fs.existsSync(savedFilePath)).toBe(true);
    expect(fs.readFileSync(savedFilePath).toString()).toBe('hello world');
  });

  it('should generate a unique name for each file', async () => {
    const mockFile = {
      originalname: 'test.jpg',
      buffer: Buffer.from('img'),
      mimetype: 'image/jpeg',
    } as Express.Multer.File;

    const url1 = await service.saveFile(mockFile);
    const url2 = await service.saveFile(mockFile);

    expect(url1).not.toBe(url2);
  });
});
