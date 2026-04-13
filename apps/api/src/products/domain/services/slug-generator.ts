import { Injectable } from '@nestjs/common';
import slugify from 'slugify';

@Injectable()
export class SlugGenerator {
  generate(input: string): string {
    const normalized = input.replace(/&/g, ' ');
    return slugify(normalized, {
      lower: true,
      strict: true,
      trim: true,
    });
  }
}
