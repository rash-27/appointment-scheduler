"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { formatDate, formatTime, isDatesEqual } from "@/utils/utils";
import WarningIcon from '@mui/icons-material/Warning';
import { Modal, TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

export default function BookAppointment() {
  const searchParams = useParams();
  const {data : session}= useSession();
  const router = useRouter();
  const [doctorInfo, setDoctorInfo] = useState(null)
  const date = new Date(); 
  const slots = [9, 10, 11, 13, 14, 15, 16, 17];
  const tempSlots = slots.map((slot)=>{return {app : date.setHours(slot,0,0,0), status : false}})
  const [finalSlots, setFinalSlots] = useState(tempSlots);

  const [open, setOpen]= useState(false);
  const [appointment, setAppointment] = useState(null);
  const [description, setDescription] = useState('');
  useEffect(()=>{
    if(searchParams?.doctorId){
      const docId = searchParams?.doctorId;
      axios.get( `/api/doctor/${docId}`)
      .then((res)=>{
        if(res.status == 200){
          setDoctorInfo(res.data);
        
      axios.get(`/api/appointment/doctor/${docId}`)
      .then((res)=>{
          if(res.status == 200){
            const filledSlots = res.data.appointments || [];
            setFinalSlots(finalSlots.map((slot)=>{
              let res = filledSlots.filter((fillSlot)=>{
                  return isDatesEqual(new Date(fillSlot?.appointmentTime), new Date(slot.app));
              })
              if(res.length == 0){
                return {
                  app:slot.app,
                  status : false
                }
              }else{
                return {
                app : slot.app,
                status : true
              }
              }
            }))
          }
        })
        .catch((err)=>console.log(err));
        }
      })
      .catch((err)=>console.log(err));
    }
  },[session])

  function handleOnClose(){
    setOpen(false);
    setDescription('');
    setAppointment(null);
  }

  function bookAppointment(){
      axios.post('/api/appointment',{
        userId : session?.user.id,
        doctorId : doctorInfo?._id,
        appointmentTime : new Date(appointment),
        description : description
      }).then((res)=>{
        if(res.status == 200){
          setOpen(false);
          alert('Your appointment is noted we will update you with further information !!');
        }
      }).catch((err)=>{
        setOpen(false);
        alert('Something went wrong! Try again later');
      })
  }
  
  function chooseAppointment(slot){
    if(slot.status){
      return;
    }else {
      setAppointment(slot.app);
      setOpen(true);
    }
  }

  return ( 
  <div className="min-h-screen">
  {
    doctorInfo && 
    <div className="flex justify-center">
           <div className="flex justify-between px-6 border-2 w-64 border-primary-500 rounded-lg py-4 my-4 transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary-400 hover:shadow-lg border-primary-500 cursor-pointer ">
              <div className="flex flex-col justify-center">
                  <div className="py-2 px-4 border-2 font-bold border-primary-500 rounded-full ">
                      {doctorInfo?.name[0].toUpperCase()}
                  </div>
              </div>
              <div className="flex flex-col">
                <div className="text-xl font-bold">{doctorInfo?.name}</div>
                <div>{doctorInfo?.qualification}</div>
              </div>
          </div>
    </div>
  }
  <div className="text-xl mt-6 text-center">Book your Appointment for today ( <span className="font-bold"> {formatDate(date)} </span> ) !</div>
  <div className="text-center flex justify-center">
  <div className="flex mt-4"><WarningIcon color="warning"/>
  <div className="flex flex-col justify-center px-3">All the times are is 24 hr clock!
  </div>
</div>
  </div>

  <div className="grid grid-cols-4 mt-12 mx-10 gap-6">
     {
      finalSlots.map((slot, id)=>{
       return (<div onClick={()=>chooseAppointment(slot)} key={id} className={`${(slot.status == false) ? ' bg-green-200 ' : ' bg-red-200 '}`+' text-black cursor-pointer h-32 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary-400 hover:shadow-lg '}>
           <div className="flex justify-center h-full">
              <div className="flex flex-col justify-center">
                <div>
                  {formatTime(new Date(slot.app))}
                </div>
              </div>
          </div>
        </div>)
      })
    } 
  </div>
      <Modal open={open} onClose={handleOnClose}>
            <div className="flex justify-center">
            <div className="flex flex-col justify-center h-screen">
                <div className="bg-secondary-300 rounded-lg text-background border-2 pt-6 pb-6 w-96">
                    <div className="flex justify-end cursor-pointer px-2">
                        <CloseIcon
                        sx={{ color: 'red', cursor: 'pointer', fontSize: 30 }}
                        color="font-bold text-xl mt-2"
                        onClick={handleOnClose} />
                    </div> 
                    <div className="text-center text-xl">
                        Are you sure to book your appointment at <span className="font-bold">{formatTime(new Date(appointment))}</span> ?
                    </div>
           <div className="mt-6 mb-4 flex justify-center">
            <TextField size="small" id="outlined-basic" label="Description" value={description} onChange={(e)=>setDescription(e.target.value)}
            type="text" variant="outlined" 
            sx={{
              "& .MuiOutlinedInput-root": {
              color: "#000",
              fontFamily: "Arial",

              "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#000",
              borderWidth: "1px",
              borderRadius : "4px"
              },
            },
              "& .MuiInputLabel-outlined": {
              color: "#000", 
              borderRadius : "4px"
            },
           }}  
          className="border border-primary-500 rounded-lg" />
          </div>
                        <div className="flex justify-center text-black font-heading">
                          <div className="border-2 border-primary-500 rounded-lg px-3 py-2 my-4  transition-all duration-300 ease-in-out hover:scale-110 hover:border-primary-400 hover:shadow-lg cursor-pointer" onClick={bookAppointment}>Book Appointment</div>
                        </div>
                </div>
            </div>
            </div>
      </Modal>
  </div>
 );
}
