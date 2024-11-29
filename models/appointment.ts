import { Schema, model, models} from 'mongoose';
import mongoose from 'mongoose'

const AppointmentSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,   

        ref: 'User',
        required: [true, 'User Id is required!'],
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor', 
        required:[true, 'Doctor Id is required!'],    
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
    },
    appointmentTime : {
      type : Date,
      required : [true, 'Appointment time is required!'],
    },
    isConfirmed : {
      type : Boolean,
      default : null,
    }
});

const Appointment = models.Appointment || model("Appointment", AppointmentSchema);

export default Appointment;
