import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as crypto from 'crypto';
import { SupabaseService } from '../supabase/supabase.service';
import { IStorageService } from './storage.service';

@Injectable()
export class SupabaseStorageService implements IStorageService {
  private readonly bucket: string;

  constructor(private readonly supabase: SupabaseService) {
    this.bucket = process.env.SUPABASE_STORAGE_BUCKET ?? 'product-images';
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const ext = path.extname(file.originalname);
    const fileName = `${crypto.randomUUID()}${ext}`;
    const filePath = `products/${fileName}`;

    const { error } = await this.supabase.adminClient.storage
      .from(this.bucket)
      .upload(filePath, file.buffer, { contentType: file.mimetype, upsert: false });

    if (error) {
      throw new Error(error.message);
    }

    const { data } = this.supabase.adminClient.storage
      .from(this.bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async deleteFile(url: string): Promise<void> {
    const bucketPrefix = `/object/public/${this.bucket}/`;
    const idx = url.indexOf(bucketPrefix);
    const filePath = idx !== -1 ? url.slice(idx + bucketPrefix.length) : url;

    const { error } = await this.supabase.adminClient.storage
      .from(this.bucket)
      .remove([filePath]);

    if (error) {
      throw new Error(error.message);
    }
  }
}
