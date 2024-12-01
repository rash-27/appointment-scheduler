import { connectToDB } from '@/utils/database';
import Doctor from '@/models/doctor';
import Appointment from '@/models/appointment';
import User from '@/models/user';
import { formatTime } from '@/utils/utils';
import { sendOtp } from '@/utils/sendotp';
// send a notification reg an appointment
export const POST = async (req, {params}) => {

    try {
        await connectToDB();
        const param = await params; 
        const doctor = await Doctor.findById(param.id);
        const appointment = await Appointment.findById(params.appointmentId);
        const user = await User.findById(appointment?.userId);
        if (!doctor || !appointment || appointment.doctorId != param.id) {
            return new Response('Appointment not valid', { status: 404 });
        }
        const phoneNum = user.phoneNumber;
        const appointmentTime = formatTime(new Date(appointment.appointmentTime)); 
        const doctorName = doctor.name;
        if(appointment.isConfirmed == true){
        const message = `Hey ${user?.phoneNumber} !! Your appointment to doctor ${doctorName} is confirmed today at ${appointmentTime}, Please be on time!`
        await sendOtp(message, phoneNum);
        }else if(appointment.isConfirmed == false){
        const message = `Hey ${user?.phoneNumber} !! Your appointment to doctor ${doctorName} is cancelled today at ${appointmentTime}, Sorry for inconvinience!`
        await sendOtp(message, phoneNum);
        }

        return new Response('Message Sent', { status: 200 });
   
    } catch (error) {
        console.log(error);
        return new Response('Internal server error', { status: 500 });
    }
}
