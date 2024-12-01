"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { formatDate, formatTime, isDatesEqual } from "@/utils/utils";
import { Modal } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

export default function SlotList() {
  const {data : session}= useSession();
  const date = new Date(); 
  const slots = [9, 10, 11, 13, 14, 15, 16, 17];
  const tempSlots = slots.map((slot)=>{return {app : date.setHours(slot,0,0,0), status : false, userId : '', description : ''}})
  const [finalSlots, setFinalSlots] = useState(tempSlots);

  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [description, setDescription] = useState('')

  useEffect(()=>{
    axios.get(`/api/appointment/doctor/${session?.user.id}`)
    .then((res)=>{
      if(res.status == 200){
        const filledSlots = res.data.appointments || [];
          setFinalSlots(finalSlots.map((slot)=>{
            const res = filledSlots.filter((fillSlot)=>{
                  return isDatesEqual(new Date(fillSlot?.appointmentTime), new Date(slot.app));
            })
            if(res.length != 0){
              return {
                ...slot,
                'status' : true,
                'userId' : res[0].userId,
                'description' : res[0].description
              }
            }else return slot
          })) 
      }
    }).catch((err)=>console.log(err));

  },[session])

  function viewAppointment(slot){
    if(!slot.status)return;
    setDescription(slot.description);
    setOpen(true);
    axios.get(`/api/user/${slot.userId}`)
    .then((res)=>{
      if(res.status == 200)setUserData(res.data);
    }).catch((err)=>console.log(err));
  }

  function handleOnClose(){
      setOpen(false);
      setUserData(null);
      setDescription('');
  }
  return ( 
  <div className="min-h-screen" >
    <div className="text-center text-xl font-bold mb-3">Today's Appointments ( {formatDate(date)} )</div>
   <div className="grid grid-cols-2 mt-12 mx-10 gap-6">
     {
      finalSlots && 
      finalSlots.map((slot, id)=>{
       return (<div onClick={()=>viewAppointment(slot)} key={id} className={`${(slot.status == false) ? ' bg-green-200 ' : ' bg-red-200 '}`+' text-black cursor-pointer h-32 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary-400 hover:shadow-lg '}>
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
                    {userData && <div>
                        <div className="flex justify-center">
                         <div className="text-center text-black text-3xl px-6 py-3 my-8 rounded-full border-2 border-primary-500 font-heading">{userData?.name[0].toUpperCase()}</div>
                        </div>
                        <div className="text-center font-heading font-medium text-xl text-black">{userData?.name}</div>
                        <div className="text-center font-normal  text-gray-500">{userData?.phoneNumber}</div>
                         <div className="text-center font-normal ">{description}</div> 
                      </div>
                  }
                </div>
            </div>
            </div>
      </Modal>
  </div>

 );
}
