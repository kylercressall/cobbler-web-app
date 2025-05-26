// this is defining the routes for authentication
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { fetchUserFromDB } from "@/apps/frontend/lib/auth/fetchUserFromDB";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await fetchUserFromDB(
          credentials.email,
          credentials.password
        );
        if (user) return user;
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});

// with the session we can now use this to access it
// const { data: session } = useSession();
// const userId = session?.user?.id;
