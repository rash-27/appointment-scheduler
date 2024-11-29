import { connectToDB } from '@/utils/database';
import User from '@/models/user';
// Update password of user
export const PUT = async (req, {params}) => {
    const { verifyOTP } = await req.json();

    try {
        await connectToDB();
    
        const user = await User.findById(params.id);
        if (!user) {
            return new Response('User not found', { status: 404 });
        }
        if(user.verifyOTP != verifyOTP || user.verifyOTPExpiry < Date.now()){
            return new Response('Unauthorised Request', { status: 403 });
        }
        user.isVerified = true;
        user.verifyOTP = null;
        user.verifyOTPExpiry = null;
        await user.save();
        return new Response('User verified', { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response('Internal server error', { status: 500 });
    }
}
