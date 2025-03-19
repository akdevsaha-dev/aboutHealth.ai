import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/signin",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        let user = await prisma.user.findUnique({
          where: {
            email,
          },
          include: { accounts: true },
        });
        if (!user) {
          const hashedPassword = await bcrypt.hash(password, 10);
          user = await prisma.user.create({
            include: { accounts: true },
            data: {
              email,
              password: hashedPassword,
            },
          });
        }
        if (!user.password) {
          const providers = user.accounts.map((acc) => acc.provider).join(", ");
          throw new Error(
            `account exists via ${providers}, please login via ${providers}`
          );
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("invalid email or password");
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
});
