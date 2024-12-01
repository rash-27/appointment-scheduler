import { connectToDB } from '@/utils/database';
import User from '@/models/user';
import { formatDate, formatTime } from '@/utils/utils';
import { sendOtp } from '@/utils/sendotp';
// Send OTP to a doctor
export const POST = async (req, {params}) => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    try {
        await connectToDB();
        const param = await params; 
        const user = await User.findById(param.id);
        if (!user) {
            return new Response('User not found', { status: 404 });
        }
        const validity = `${formatDate(new Date(Date.now() + 3600000))} - ${formatTime(new Date(Date.now() + 3600000))} IST`
        const message = `Hello ${user.name} the otp to verify your account is ${otp} valid till ${validity}`
        await sendOtp(message, user.phoneNumber);
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
