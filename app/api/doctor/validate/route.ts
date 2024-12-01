import { connectToDB } from '@/utils/database';
import Doctor from '@/models/doctor';
// Validate a doctor
export const POST = async (req) => {
    const { secretToken, phoneNumber } = await req.json();

    try {
        await connectToDB();
    
        const doctor = await Doctor.findOne({phoneNumber : phoneNumber});
        if (!doctor) {
            return new Response('Doctor not found', { status: 404 });
        }
        if(secretToken != process.env.NEXTAUTH_DOCTOR_SECRET){
           return new Response('unAuthenticated request', { status: 403 });
        }
        doctor.isValid = true;
        await doctor.save();
        return new Response('Doctor validated', { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response('Internal server error', { status: 500 });
    }
}
