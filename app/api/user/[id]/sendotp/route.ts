import { connectToDB } from '@/utils/database';
import User from '@/models/user';
import axios from 'axios';
// Send OTP to a doctor
export const POST = async (req, {params}) => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    try {
        await connectToDB();
    
        const user = await User.findById(params.id);
        if (!user) {
            return new Response('User not found', { status: 404 });
        }
        await axios.post(`webHookUrl`,{
          phoneNumber : user.phoneNumber,
          otp : otp
        })
        user.verifyOTP = otp;
        // 1 hour limit
        user.verifyOTPExpiry = Date.now() + 3600000; 
        await user.save();
        return new Response('Password updated', { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response('Internal server error', { status: 500 });
    }
}
