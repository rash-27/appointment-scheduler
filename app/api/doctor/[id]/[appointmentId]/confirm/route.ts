import { connectToDB } from '@/utils/database';
import Doctor from '@/models/doctor';
import Appointment from '@/models/appointment';
import axios from 'axios';
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
        // call the kestra webhook
        const kestradomain = process.env.KESTRA_DOMAIN;
         await axios.post(`${kestradomain}/api/v1/executions/webhook/hackfrost/notify-user/notifyuser`,{
          doctorId : doctor._id,
          appointmentId : appointment._id
        })    
        return new Response('Appointment confirmed', { status: 200 });
        // Send a notification to the user about the appointment confirmation
      // HARD -> send notification to user 30 min prior 
    } catch (error) {
        console.log(error);
        return new Response('Internal server error', { status: 500 });
    }
}
