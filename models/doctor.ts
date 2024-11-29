import { Schema, model, models } from 'mongoose';

const DoctorSchema = new Schema({
  phoneNumber: {
    type: String,
    unique: [true, 'Phone Number already exists!'],
    required: [true, 'Phone Number is required!'],
  },
  password : {
    type: String,
  },
  qualification : {
    type : String,
    required : [true, 'Qualification is required!'],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isValid : {
    type: Boolean,
    default : false,
  },
  verifyOTP: {
    type: String,
    default: null,
  },
  verifyOTPExpire : {
    type : Date,
    default : null,
  }
});

const Doctor = models.Doctor || model("Doctor", DoctorSchema);

export default Doctor;
