import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"
import { UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        // Test users for development
        const testUsers = {
          "carowner@test.com": {
            id: "car-owner-1",
            email: "carowner@test.com",
            name: "John Doe",
            role: "CAR_OWNER" as UserRole,
            password: "password123"
          },
          "shopowner@test.com": {
            id: "shop-owner-1", 
            email: "shopowner@test.com",
            name: "Sarah Wilson",
            role: "SHOP_OWNER" as UserRole,
            password: "password123"
          }
        }

        const testUser = testUsers[credentials.email as keyof typeof testUsers]
        
        if (!testUser || testUser.password !== credentials.password) {
          throw new Error("Invalid credentials")
        }

        return {
          id: testUser.id,
          email: testUser.email,
          name: testUser.name,
          role: testUser.role,
          image: null,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as UserRole
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // All sign-ins go through credentials provider
      return true
    }
  }
}