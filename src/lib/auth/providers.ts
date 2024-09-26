// lib/auth/providers.ts

import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';
import { User } from '@/lib/models/models'; // Adjust the path
import { dbConnect } from '@/lib/db/db'; // Adjust the path

export const providers = [
  // Credentials Provider
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'text', placeholder: 'email@example.com' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials.password) {
        throw new Error('Email and password must be provided');
      }

      const { email, password } = credentials;

      try {
        await dbConnect();
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error('User not found');
        }

        const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordsMatch) {
          throw new Error('Incorrect password');
        }

        // Return user object to be saved in JWT
        return {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          attemptsAllowed: user.attemptsAllowed,
          createdAt: user.createdAt,
        };
      } catch (error) {
        console.error('Authentication error:', error);
        throw new Error('Invalid email or password');
      }
    },
  }),

  // GitHub Provider
  GitHubProvider({
    clientId: process.env.GITHUB_ID!,
    clientSecret: process.env.GITHUB_SECRET!,
  }),
];
