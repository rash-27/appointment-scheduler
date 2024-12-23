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
      async authorize(credentials : any) {
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
          return { phoneNumber: user.phoneNumber, isVerified : user.isVerified, role : "USER", isValid : true, name : user.name, id : user._id.toString()};
        }else if(credentials?.role == 'DOCTOR'){
           const doctor = await Doctor.findOne({ phoneNumber : credentials?.phoneNumber });
          if (!doctor) {
            throw new Error('Invalid phoneNumber or password');
          }
          const isValid = await bcrypt.compare(credentials?.password, doctor.password);
          if (!isValid) {
            throw new Error('Invalid phoneNumber or password');
          }
          return { phoneNumber: doctor.phoneNumber, isVerified : doctor.isVerified, role : "DOCTOR", isValid : doctor.isValid, name : doctor.name, id : doctor._id.toString()};
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
    async jwt({token, user}){
      if(user){
        token.role = user.role;
        token.phoneNumber = user.phoneNumber;
        token.isValid = user.isValid;
        token.isVerified = user.isVerified;
        token.id = user.id.toString();
      }
      return token;
    },
    async session({session, token}) {

        if (token && session.user) {
          session.user.role = token.role;
          session.user.phoneNumber = token.phoneNumber;
          session.user.isValid = token.isValid;
          session.user.isVerified = token.isVerified;
          session.user.id = token.id;
        }

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
