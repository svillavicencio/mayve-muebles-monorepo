import { Module } from '@nestjs/common';
import { STORAGE_SERVICE } from './storage.service';
import { LocalStorageService } from './local-storage.service';
import { SupabaseStorageService } from './supabase-storage.service';
import { SupabaseModule } from '../supabase/supabase.module';

const isSupabase = process.env.STORAGE_TYPE === 'supabase';

@Module({
  imports: isSupabase ? [SupabaseModule] : [],
  providers: [
    {
      provide: STORAGE_SERVICE,
      useClass: isSupabase ? SupabaseStorageService : LocalStorageService,
    },
  ],
  exports: [STORAGE_SERVICE],
})
export class StorageModule {}
