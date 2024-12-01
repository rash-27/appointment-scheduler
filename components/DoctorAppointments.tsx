"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloseIcon from '@mui/icons-material/Close';

import { formatDate, formatTime } from "@/utils/utils";
import { Modal } from "@mui/material";
export default function AppointmentList() {
  const {data : session}= useSession();
  const [appointmentList, setAppointmentList] = useState(null);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [description, setDescription]= useState('');
  const [appointmentId, setAppointmentId] = useState('');
  const router = useRouter();
  const date = new Date();
  useEffect(()=>{
    if(session?.user){
    axios.get(`/api/appointment/doctor/${session?.user?.id}/all`)
    .then((res)=>{
      if(res.status == 200){
        const allAppointments = res.data.appointments;
        const todaysAppointments = allAppointments.filter((appointment)=>{
          return ((formatDate(new Date(appointment?.appointmentTime)) == formatDate(date)) && appointment?.isConfirmed == null);
        });
        
        setAppointmentList(todaysAppointments);
      }
    }).catch((err)=>console.log(err));
    }
  },[session]) 

  function handleOnClose(){
    setOpen(false);
    setUserId(null);
    setDescription('');
    setAppointmentId('');
  }
  
  function showUser(userId, description, appId){
    setOpen(true);
    setUserId(userId.toString());
    setAppointmentId(appId.toString());
    setDescription(description);
     axios.get(`/api/user/${userId}`)
      .then((res)=>{
        if(res.status == 200){
          setUserData(res.data)
        }
      })
      .catch((err)=>console.log(err));
  }

  function handleCancel(){
    axios.post(`/api/doctor/${session?.user.id}/${appointmentId}/reject`)
    .then((res)=>{
      if(res.status == 200){
      alert("The appointment is rejected successfully !")
        handleOnClose();
      }
    }).catch(()=>{
      alert('Something went wrong try again later!!')
      handleOnClose();
    });
  }

  function handleConfirm(){
    axios.post(`/api/doctor/${session?.user.id}/${appointmentId}/confirm`)
    .then((res)=>{
      if(res.status == 200){
      alert("The appointment is accepted successfully !")
        handleOnClose();
      }
    }).catch(()=>{
      alert('Something went wrong try again later!!')
      handleOnClose();
    });
  
  }

  return ( 
  <div className="min-h-screen" >
 
    <div className="text-center text-xl font-bold mb-5">Appointment's List</div>
       {appointmentList && (appointmentList.length == 0) &&
      <div className="text-center font-bold mt-12"> No appointment requests pending!!</div>  
        }   
  <div className="grid grid-cols-2 gap-4 justify-start mx-12">

      {appointmentList && appointmentList.map((appointment, key)=>{
        return (
          <div key={key} onClick={()=>showUser(appointment?.userId, appointment?.description, appointment?._id)} className="flex justify-between px-6 border-2 border-primary-500 rounded-lg py-4 my-4 transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary-400 hover:shadow-lg border-primary-500 cursor-pointer ">
              <div className="flex flex-col justify-center">
                  <div className="py-2 text-3xl font-bold rounded-full ">
                    { 
                      (appointment?.isConfirmed == null) && <ErrorOutlineIcon fontSize="large" color="warning" />
                    }
                  </div>
              </div>
              <div className="flex flex-col">
                <div className="font-semibold">{`${formatDate(new Date(appointment?.appointmentTime))}  ${formatTime(new Date(appointment?.appointmentTime))}`}</div>
                <div>{appointment?.description}</div>
              </div>
          </div>
          )
      })}
  </div>
      <Modal open={open} onClose={handleOnClose}>
            <div className="flex justify-center">
            <div className="flex flex-col justify-center h-screen">
                <div className="bg-secondary-300 rounded-lg text-background border-2 pt-4 pb-6 w-96">
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
                        <div className="text-center font-normal  ">{description}</div>
                        <div className="flex justify-around">
                        <div className="flex justify-center text-green-700 font-heading">
                          <div className="border-2 border-green-700 rounded-lg px-3 py-2 my-4  transition-all duration-300 ease-in-out hover:scale-110 hover:border-green-500 hover:shadow-lg cursor-pointer " onClick={handleConfirm}>Confirm</div>
                        </div>
                        <div className="flex justify-center text-red-500 font-heading">
                          <div className="border-2 border-red-500 rounded-lg px-3 py-2 my-4  transition-all duration-300 ease-in-out hover:scale-110 hover:border-red-400 hover:shadow-lg cursor-pointer " onClick={handleCancel}>Reject</div>
                        </div>
                        </div>
                    </div>
                  }
                </div>
            </div>
            </div>
      </Modal>
  </div>

 );
}
