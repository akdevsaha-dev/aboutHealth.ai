import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      address?: string;
      id: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    id?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt", // ✅ Use JWT for Credentials provider
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const user = await prisma.user.findUnique({
          where: { email },
          include: { accounts: true },
        });

        if (!user) {
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = await prisma.user.create({
            data: { email, password: hashedPassword },
          });
          return { id: newUser.id, email: newUser.email };
        }

        if (!user.password) {
          const providers = user.accounts.map((acc) => acc.provider).join(", ");
          throw new Error(
            `Account exists via ${providers}, please login via ${providers}`
          );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error("Invalid email or password");

        return { id: user.id, email: user.email }; // ✅ Only essential data
      },
    }),
    Google({ allowDangerousEmailAccountLinking: true }),
    GitHub({ allowDangerousEmailAccountLinking: true }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // ✅ On first login, add user.id to the token
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      // ✅ Expose user.id in the session
      if (token?.id) session.user.id = token.id as string;
      return session;
    },
  },
});
