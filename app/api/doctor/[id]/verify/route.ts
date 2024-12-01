import { connectToDB } from '@/utils/database';
import Doctor from '@/models/doctor';
import axios from 'axios';
// Verify a doctor
export const POST = async (req, {params}) => {
    const { verifyOTP } = await req.json();

    try {
        await connectToDB();
        const param = await params; 
        const doctor = await Doctor.findById(param.id);
        if (!doctor) {
            return new Response('Doctor not found', { status: 404 });
        }
        if(doctor.verifyOTP != verifyOTP || doctor.verifyOTPExpiry < Date.now()){
            return new Response('Unauthorised Request', { status: 403 });
        }
        doctor.isVerified = true;
        doctor.verifyOTP = null;
        doctor.verifyOTPExpiry = null;
        await doctor.save();
        const kestradomain = process.env.KESTRA_DOMAIN;
        const message = `Doctor ${doctor.name} with phone number ${doctor.phoneNumber} Registered`;
        await axios.post(`${kestradomain}/api/v1/executions/webhook/hackfrost/register-slack-message/usermessage`,{
          message : message
        })
        return new Response('Doctor verified', { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response('Internal server error', { status: 500 });
    }
}
