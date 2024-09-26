// app/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import authOptions from '@/lib/auth/authOptions'; // Import your configured authOptions

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
