// lib/auth/authOptions.ts

import { AuthOptions } from 'next-auth';
import { providers } from './providers';
import { callbacks } from './callbacks';
import { session } from './session';

export const authOptions: AuthOptions = {
  providers,
  callbacks,
  session,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login', // Redirect to your custom login page
  },
};

export default authOptions;
