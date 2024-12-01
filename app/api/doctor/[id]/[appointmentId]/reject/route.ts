import { connectToDB } from '@/utils/database';
import Doctor from '@/models/doctor';
import Appointment from '@/models/appointment';
import axios from 'axios';
// Reject an appointment
export const POST = async (req, {params}) => {

    try {
        await connectToDB();

        const param = await params; 
        const doctor = await Doctor.findById(param.id);
        const appointment = await Appointment.findById(param.appointmentId);
        if (!doctor || !appointment || appointment.doctorId != param.id) {
            return new Response('Appointment cant be rejected', { status: 404 });
        }
        appointment.isConfirmed = false;
        await appointment.save();
        // send a notification to user about the rejection of the appointment
        const kestradomain = process.env.KESTRA_DOMAIN;
        await axios.post(`${kestradomain}/api/v1/executions/webhook/hackfrost/notify-user/notifyuser`,{
          doctorId : doctor._id,
          appointmentId : appointment._id
        })
        return new Response('Appointment rejected', { status: 200 });
          
    } catch (error) {
        console.log(error);
        return new Response('Internal server error', { status: 500 });
    }
}
