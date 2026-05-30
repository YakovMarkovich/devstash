import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"

export default {
  pages: {
    signIn: '/sign-in',
  },
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      // Real validation is in auth.ts (needs bcrypt, can't run on edge)
      authorize: () => null,
    }),
  ],
} satisfies NextAuthConfig
