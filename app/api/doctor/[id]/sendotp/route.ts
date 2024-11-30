import { connectToDB } from '@/utils/database';
import Doctor from '@/models/doctor';
import axios from 'axios';
// Send otp to s doctor
export const POST = async (req, {params}) => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    try {
        await connectToDB();
        const param = await params; 
        const doctor = await Doctor.findById(param.id);
        if (!doctor) {
            return new Response('Doctor not found', { status: 404 });
        }
        //await axios.post(`webHookUrl`,{
        //  phoneNumber : doctor.phoneNumber,
        //  otp : otp
        //})
        doctor.verifyOTP = otp;
        // 1 hour limit
        doctor.verifyOTPExpiry = Date.now() + 3600000; 
        await doctor.save();
        return new Response('Password updated', { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response('Internal server error', { status: 500 });
    }
}
