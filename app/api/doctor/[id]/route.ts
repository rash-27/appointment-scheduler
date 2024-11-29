import bcrypt from 'bcryptjs';
import { connectToDB } from '@/utils/database';
import Doctor from '@/models/doctor';
// Update password of doctor
export const PUT = async (req, {params}) => {
    const { oldPassword, newPassword } = await req.json();
    
    try {
        await connectToDB();
    
        const doctor = await Doctor.findById(params.id);
        if (!doctor) {
            return new Response('Doctor not found', { status: 404 });
        }
        const isPasswordValid = await bcrypt.compare(oldPassword, doctor.password);
        if (!isPasswordValid) {
            return new Response('Invalid password', { status: 401 });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        doctor.password = hashedPassword;
        await doctor.save();
        return new Response('Password updated', { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response('Internal server error', { status: 500 });
    }
}
