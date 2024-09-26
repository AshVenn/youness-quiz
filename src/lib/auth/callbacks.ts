// lib/auth/callbacks.ts

import { CallbacksOptions } from 'next-auth';
import { dbConnect } from '@/lib/db/db';
import { User } from '@/lib/models/models';

export const callbacks: Partial<CallbacksOptions> = {
  async jwt({ token, user, account, profile }) {
    if (user) {
      // When signing in, persist the user ID and other data
      token.id = user.id;
      token.username = user.username || '';
      token.email = user.email || '';
      token.role = user.role || 'user';
      token.attemptsAllowed = user.attemptsAllowed || 2;
      token.createdAt = user.createdAt || new Date();
    }

    // If using GitHub provider
    if (account?.provider === 'github' && profile) {
      // You might want to check if the user exists in your database
      await dbConnect();
      let existingUser = await User.findOne({ email: profile.email });

      if (!existingUser) {
        // Create a new user in the database
        existingUser = new User({
          username: profile.name || profile.email,
          email: profile.email,
          passwordHash: '', // No password since it's OAuth
          role: 'user',
          attemptsAllowed: 2,
        });
        await existingUser.save();
      }

      // Update token with user data from the database
      token.id = existingUser._id.toString();
      token.username = existingUser.username;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.attemptsAllowed = existingUser.attemptsAllowed;
      token.createdAt = existingUser.createdAt;
    }

    return token;
  },

  async session({ session, token }) {
    // Attach token data to the session object
    session.user.id = token.id;
    session.user.username = token.username;
    session.user.email = token.email;
    session.user.role = token.role;
    session.user.attemptsAllowed = token.attemptsAllowed;
    session.user.createdAt = token.createdAt;

    return session;
  },
};
