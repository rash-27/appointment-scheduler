"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloseIcon from '@mui/icons-material/Close';

import { formatDate, formatTime } from "@/utils/utils";
import { Modal } from "@mui/material";
export default function AppointmentList() {
  const {data : session}= useSession();
  const [appointmentList, setAppointmentList] = useState(null);
  const [open, setOpen] = useState(false);
  const [doctorId, setDoctorId] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const router = useRouter();
  useEffect(()=>{
    if(session?.user){
    axios.get(`/api/appointment/user/${session?.user?.id}`)
    .then((res)=>{
      if(res.status == 200){
        console.log(res.data.appointments);
        setAppointmentList(res.data.appointments);
      }
    }).catch((err)=>console.log(err));
    }
  },[session]) 

  function handleOnClose(){
    setOpen(false);
    setDoctorId(null);
  }
  
  useEffect(()=>{
  if(doctorId){
     axios.get(`/api/doctor/${doctorId}`)
      .then((res)=>{
        if(res.status == 200){
          setDoctorData(res.data)
        }
      })
      .catch((err)=>console.log(err));
  }
  },[doctorId])

  function showDoctor(doctorId){
    setOpen(true);
    setDoctorId(doctorId.toString());
  }

  return ( 
  <div className="min-h-screen" >
 
    <div className="text-center text-xl font-bold mb-3">Appointment's List</div>
       {appointmentList && (appointmentList.length == 0) &&
      <div className="text-center font-bold mt-12"> You don't have any appointments yet !!</div>  
        }   
  <div className="grid grid-cols-2 gap-4 justify-start mx-12">

      {appointmentList && appointmentList.map((appointment, key)=>{
        return (
          <div key={key} onClick={()=>showDoctor(appointment?.doctorId)} className="flex justify-between px-6 border-2 border-primary-500 rounded-lg py-4 my-4 transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary-400 hover:shadow-lg border-primary-500 cursor-pointer ">
              <div className="flex flex-col justify-center">
                  <div className="py-2 text-3xl font-bold rounded-full ">
                    { 
                      (appointment?.isConfirmed == null) && <ErrorOutlineIcon fontSize="large" color="warning" />
                    }
                    { 
                      (appointment?.isConfirmed == true) && <CheckIcon fontSize="large" color="success" />
                    }
                    { 
                      (appointment?.isConfirmed == false) && <ClearIcon fontSize="large" color="error" />
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
                    {doctorData && <div>
                        <div className="flex justify-center">
                         <div className="text-center text-black text-3xl px-6 py-3 my-8 rounded-full border-2 border-primary-500 font-heading">{doctorData?.name[0].toUpperCase()}</div>
                        </div>
                        <div className="text-center font-heading font-medium text-xl text-black">{doctorData?.name}</div>
                        <div className="text-center font-normal  text-gray-500">{doctorData?.phoneNumber}</div>
                        <div className="text-center font-normal text-gray-500">{doctorData?.qualification}</div>
                    </div>
                  }
                </div>
            </div>
            </div>
      </Modal>
  </div>

 );
}
