import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../common/supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(private readonly supabase: SupabaseService) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<{ user: any; access_token: string } | null> {
    const { data, error } = await this.supabase.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return null;
    }

    return {
      user: data.user,
      access_token: data.session.access_token,
    };
  }

  async login(sessionData: { access_token: string }) {
    return { access_token: sessionData.access_token };
  }
}
