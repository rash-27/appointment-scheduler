import { connectToDB } from '@/utils/database';
import Appointment from '@/models/appointment';
import User from '@/models/user';
import Doctor from '@/models/doctor';

// Create an appointment
export const POST = async (request : any) => {
    const { userId, doctorId, description, appointmentTime } = await request.json();
    try {
        await connectToDB();
        const user = await User.findById(userId);
        const doctor = await Doctor.findById(doctorId);
        if (!user || !doctor) {
            return new Response("Invalid appointment", { status: 400 });
        }
        const newAppointment = new Appointment({ userId : userId, doctorId: doctorId, description : description, appointmentTime : appointmentTime});
        await newAppointment.save();
        return new Response("Appointment Created", { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("Internal server error", { status: 500 });
    }
}


