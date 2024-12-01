import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  phoneNumber: {
    type: String,
    unique: [true, 'Phone Number already exists!'],
    required: [true, 'Phone Number is required!'],
  },
  name: {
    type: String,
    required: [true, 'Name is required!'],
  },
  password : {
    type: String,
    required: [true, 'Password is required!'],
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
