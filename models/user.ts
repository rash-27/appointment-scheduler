import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  phoneNumber: {
    type: String,
    unique: [true, 'Phone Number already exists!'],
    required: [true, 'Phone Number is required!'],
  },
  password : {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyOTP: {
    type: String,
    default: null,
  },
  verifyOTPExpiry : {
    type : Date,
    default : null,
  }
});

const User = models.User || model("User", UserSchema);

export default User;
