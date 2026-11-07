import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      'placeholder',
  );

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    const isProduction =
      process.env.NODE_ENV === 'production' ||
      process.env.ENFORCE_API_AUTH === 'true';

    if (!authHeader) {
      if (isProduction) {
        throw new UnauthorizedException('Authorization Bearer token required');
      }
      // Safe fallback user for local development / E2E test suites
      request.user = {
        id: 'local-studio-user',
        email: 'studio@nexora.local',
        isLocalDev: true,
      };
      return true;
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    try {
      const {
        data: { user },
        error,
      } = await this.supabase.auth.getUser(token);

      if (error || !user) {
        throw new UnauthorizedException('Invalid or expired Supabase JWT token');
      }

      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Failed to authenticate Supabase token');
    }
  }
}
