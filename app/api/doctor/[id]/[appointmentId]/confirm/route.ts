import { connectToDB } from '@/utils/database';
import Doctor from '@/models/doctor';
import Appointment from '@/models/appointment';
// Verify an appointment
export const POST = async (req, {params}) => {

    try {
        await connectToDB();
        const param = await params; 
        const doctor = await Doctor.findById(param.id);
        const appointment = await Appointment.findById(params.appointmentId);
        if (!doctor || !appointment || appointment.doctorId != param.id) {
            return new Response('Appointment cant be confirmed', { status: 404 });
        }
        appointment.isConfirmed = true;
        await appointment.save();
        return new Response('Appointment confirmed', { status: 200 });
        // Send a notification to the user about the appointment confirmation
      // HARD -> send notification to user 30 min prior 
    } catch (error) {
        console.log(error);
        return new Response('Internal server error', { status: 500 });
    }
}
