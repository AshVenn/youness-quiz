// lib/auth/session.ts
import { SessionOptions } from 'next-auth';

export const session: Partial<SessionOptions> = {
  strategy: 'jwt' as const, // `as const` is important to ensure TypeScript infers the correct value
  maxAge: 2 * 24 * 60 * 60, // 2 days
};
