import Appointment from "@/models/appointment";
import { connectToDB } from "@/utils/database";

export const GET = async (req, {params}) => {
    try {
        await connectToDB();
        const param = await params;
        const appointments = await Appointment.find({doctorId : param.doctorId});
        return new Response(JSON.stringify({appointments: appointments}), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("Internal server error", { status: 500 });
    }
}
