import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login-check/${credentials.email}`);
          const user = await res.json();
          if (user && user.password === credentials.password) return user;
          return null;
        } catch (error) {
          return null;
        }
      }
    })
  ],
  callbacks: {
    

    
    async jwt({ token, user }) {
      if (user) {
       


        token.role = user.role;
        token.status = user.status;
      } else {
        

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login-check/${token.email}`);
          const dbUser = await res.json();
          token.role = dbUser?.role || "User";
          token.status = dbUser?.status || "Free";
        } catch (error) {
          console.error("NextAuth JWT Callback Error:", error);
        }
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.status = token.status;
      }
      return session;
    }
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };