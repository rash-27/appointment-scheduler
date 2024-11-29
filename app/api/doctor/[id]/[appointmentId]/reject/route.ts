import { connectToDB } from '@/utils/database';
import Doctor from '@/models/doctor';
import Appointment from '@/models/appointment';
// Reject an appointment
export const POST = async (req, {params}) => {

    try {
        await connectToDB();
    
        const doctor = await Doctor.findById(params.id);
        const appointment = await Appointment.findById(params.appointmentId);
        if (!doctor || !appointment || appointment.doctorId != params.id) {
            return new Response('Appointment cant be rejected', { status: 404 });
        }
        appointment.isConfirmed = false;
        await appointment.save();
        // send a notification to user about the rejection of the appointment 
        return new Response('Appointment rejected', { status: 200 });
          
    } catch (error) {
        console.log(error);
        return new Response('Internal server error', { status: 500 });
    }
}
