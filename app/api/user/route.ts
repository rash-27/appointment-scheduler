import { connectToDB } from '@/utils/database';
import User from '@/models/user';
import bcrypt from 'bcryptjs';
// Create a user
export const POST = async (request : any) => {
    const { phoneNumber, password, name } = await request.json();
    try {
        await connectToDB();
        const user = await User.findOne({ phoneNumber : phoneNumber }); 
        if (user) {
            return new Response("User already exists", { status: 400 });
        }
        const hashed_password = await bcrypt.hash(password, 10);
        const newUser = new User({ phoneNumber : phoneNumber, password: hashed_password, name : name});
        await newUser.save();
        return new Response("User Created", { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("Internal server error", { status: 500 });
    }
}
