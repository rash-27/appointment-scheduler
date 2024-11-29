import { connectToDB } from '@/utils/database';
import Doctor from '@/models/doctor';
import bcrypt from 'bcryptjs';
// Create a doctor
export const POST = async (request : any) => {
    const { phoneNumber, password, qualification } = await request.json();
    try {
        await connectToDB();
        const doctor = await Doctor.findOne({ phoneNumber : phoneNumber }); 
        if (doctor) {
            return new Response("Doctor already exists", { status: 400 });
        }
        const hashed_password = await bcrypt.hash(password, 10);
        const newDoctor = new Doctor({ phoneNumber : phoneNumber, password: hashed_password, qualification : qualification});
        await newDoctor.save();
        return new Response("Doctor Created", { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("Internal server error", { status: 500 });
    }
}