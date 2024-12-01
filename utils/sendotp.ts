import twilio from "twilio";
export const sendOtp =  async(message, phoneNumber) => {
  
 const accountSid = process.env.TWILIO_SID;
const authToken =  process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

client.messages
  .create({
    body: message,
    messagingServiceSid: process.env.MESSAGE_SID ,
    to:`+91${phoneNumber}`, 
  })
  .then(message => console.log(message.sid));
}
