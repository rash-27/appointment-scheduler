import { connectToDB } from '@/utils/database';
import Doctor from '@/models/doctor';
// Verify a doctor
export const POST = async (req, {params}) => {
    const { verifyOTP } = await req.json();

    try {
        await connectToDB();
    
        const doctor = await Doctor.findById(params.id);
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
        return new Response('Doctor verified', { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response('Internal server error', { status: 500 });
    }
}
