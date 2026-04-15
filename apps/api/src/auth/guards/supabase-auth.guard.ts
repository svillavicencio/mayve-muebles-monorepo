import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { SupabaseService } from '../../common/supabase/supabase.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException('Missing access token');

    const { data, error } = await this.supabase.client.auth.getUser(token);
    if (error || !data?.user) throw new UnauthorizedException('Invalid or expired token');

    (request as any).user = { userId: data.user.id, email: data.user.email ?? '' };
    return true;
  }

  private extractToken(request: Request): string | null {
    const fromCookie = (request as any).cookies?.access_token;
    if (fromCookie) return fromCookie;
    const auth = request.headers.authorization;
    if (auth?.startsWith('Bearer ')) return auth.slice(7);
    return null;
  }
}
