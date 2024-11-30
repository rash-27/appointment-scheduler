declare module "next-auth" {
  interface User {
    role?: string;
    phoneNumber?: string;
    id?: string;
    isVerified?: boolean;
    isValid?: boolean;
  }

  interface Session extends DefaultSession {
    user?: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    phoneNumber?: string;
    id?: string;
    isVerified?: boolean;
    isValid?: boolean;
  }
}
