"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function DoctorsList() {
  const {data : session}= useSession();
  const [doctorList, setDoctorList] = useState(null);
  const router = useRouter();
  useEffect(()=>{
    axios.get('/api/doctor')
    .then((res)=>{
      if(res.status == 400){
        setDoctorList([]);
      }else if(res.status == 200){
        console.log(res.data.doctors)
        setDoctorList(res.data.doctors)
      }
    }).catch((err)=>console.log(err));

  },[session]) 
  return ( 
  <div className="min-h-screen" >
    <div className="text-center text-xl font-bold mb-3">Doctor's List</div>
        {doctorList && (doctorList.length == 0) &&
      <div className="text-center font-bold mt-12"> No doctors present !!</div>  
        }  
  <div className="grid grid-cols-2 gap-4 justify-start mx-12">
      {doctorList && doctorList.map((doctor, key)=>{
        return (
          <Link href={`/doctor/${doctor._id}`} key={key} className="flex justify-between px-6 border-2 border-primary-500 rounded-lg py-4 my-4 transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary-400 hover:shadow-lg border-primary-500 cursor-pointer ">
              <div className="flex flex-col justify-center">
                  <div className="py-2 px-4 border-2 font-bold border-primary-500 rounded-full ">
                      {doctor?.name[0].toUpperCase()}
                  </div>
              </div>
              <div className="flex flex-col">
                <div className="text-xl font-bold">{doctor?.name}</div>
                <div>{doctor?.qualification}</div>
              </div>
          </Link>
          )
      })}
  </div>
  </div>

 );
}
