export interface IStorageService {
  saveFile(file: Express.Multer.File): Promise<string>;
  deleteFile(url: string): Promise<void>;
}

export const STORAGE_SERVICE = 'STORAGE_SERVICE';
