import { connectToDB } from '@/utils/database';
import User from '@/models/user';
import axios from 'axios';
// Update password of user
export const POST = async (req, {params}) => {
    const { verifyOTP } = await req.json();

    try {
        await connectToDB();
        const param = await params; 
        const user = await User.findById(param.id);
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
        const kestradomain = process.env.KESTRA_DOMAIN;
        const message = `user ${user.name} with phone number ${user.phoneNumber} Registered`;
        await axios.post(`${kestradomain}/api/v1/executions/webhook/hackfrost/register-slack-message/usermessage`,{
          message : message
        })
        return new Response('User verified', { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response('Internal server error', { status: 500 });
    }
}
