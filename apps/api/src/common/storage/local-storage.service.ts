import { Injectable, Optional, Inject } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { IStorageService } from './storage.service';

export const UPLOAD_DIR = 'UPLOAD_DIR';

@Injectable()
export class LocalStorageService implements IStorageService {
  private readonly uploadDir: string;

  constructor(@Optional() @Inject(UPLOAD_DIR) uploadDir?: string) {
    this.uploadDir =
      uploadDir ?? '/home/flow/dev/personal-projects/mayve-muebles/apps/api/public/uploads';
    this.ensureDirectoryExists();
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const ext = path.extname(file.originalname);
    const fileName = `${crypto.randomUUID()}${ext}`;
    const filePath = path.join(this.uploadDir, fileName);

    await fs.promises.writeFile(filePath, file.buffer);

    return `/uploads/${fileName}`;
  }

  async deleteFile(url: string): Promise<void> {
    const fileName = path.basename(url);
    const filePath = path.join(this.uploadDir, fileName);

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }

  private ensureDirectoryExists(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }
}
