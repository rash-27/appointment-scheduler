import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import User from '@/models/user';
import { connectToDB } from '@/utils/database';
import Doctor from '@/models/doctor';

const handler = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        phoneNumber: { label: "Phone Number", type: "text" },
        password: {  label: "Password", type: "password" },
        role : { label : "Role", type : "text"}
      },
      // Need to hash the password and validation is done here
      async authorize(credentials) {
        console.log("Authorizing credentials: ", credentials);
        try {
          await connectToDB();
        if(credentials?.role == 'USER'){
          const user = await User.findOne({ phoneNumber : credentials?.phoneNumber });
          if (!user) {
            throw new Error('Invalid phoneNumber or password');
          }
          const isValid = await bcrypt.compare(credentials?.password, user.password);
          if (!isValid) {
            throw new Error('Invalid phoneNumber or password');
          }
          return { phoneNumber: user.phoneNumber, isVerified : user.isVerified, role : "USER"};
        }else if(credentials?.role == 'DOCTOR'){
           const doctor = await Doctor.findOne({ phoneNumber : credentials?.phoneNumber });
          if (!doctor) {
            throw new Error('Invalid phoneNumber or password');
          }
          const isValid = await bcrypt.compare(credentials?.password, doctor.password);
          if (!isValid) {
            throw new Error('Invalid phoneNumber or password');
          }
          return { phoneNumber: doctor.phoneNumber, isVerified : doctor.isVerified, role : "DOCTOR", isValid : doctor.isValid};
        }else {
          throw new Error('Invalid phoneNumber or password');

        }
        }
        catch (error : any) {
          console.log("Error authorizing credentials: ", error.message);
          throw new Error('Invalid phoneNumber or password');
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  url: process.env.NEXTAUTH_URL,
  callbacks: {
    async session({ session }) {
      // store the user id from MongoDB to session
      const sessionUser = await User.findOne({ phoneNumber: session.user.phoneNumber });
      session.user.id = sessionUser._id.toString();
      session.user.isVerified = sessionUser.isVerified;
      session.user.role = sessionUser.role;
      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        await connectToDB();
        if(account?.provider === 'credentials') {
          if(!credentials) {
            return false;
          }
          // check if user exists
          const user = await User.findOne({ phoneNumber: credentials.phoneNumber });
          const doctor = await Doctor.findOne({phoneNumber : credentials.phoneNumber});
          if(!user && !doctor) {
            return false;
          }
          return true;
        }else return false;
      } catch (error : any) {
        console.log("Error checking if user exists: ", error.message);
        return false
      }
    },
  }
})

export { handler as GET, handler as POST }
