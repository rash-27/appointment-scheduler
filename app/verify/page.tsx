"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import OTPInput from "@/components/Otp";
import axios from "axios";

export default function Home() {
  const {data : session} = useSession();
  const router = useRouter();
  useEffect(()=>{
    if(!session)router.push('/signin');
    if(session && session?.user.role == 'DOCTOR'){
      axios.get(`/api/doctor/${session.user.id}`)
      .then((res)=>{
      if(res.status == 200){
        const user = res.data;
        if(user.isVerified && !user.isValid){
          router.push('/validate')
        }else if(user.isVerified && user.isValid){
          router.push('/')
        }
      }

      })
      .catch((err)=>console.log(err));
    }else {
      if(session && session?.user.role == 'USER'){
      axios.get(`/api/user/${session?.user.id}`)
      .then((res)=>{
        if(res.status == 200){
        console.log(res.data)
        const user = res.data;
        if(user.isVerified == true){
          router.push('/')
        }
        }
      })
      .catch((err)=>console.log(err));
    }
  }
  },[session])
  const [otp, setOtp] = useState(''); 
  return (
  
  <div>
    <div className="min-h-screen flex flex-col justify-center">
      <div className="flex justify-center">
        <div>
          <OTPInput otp={otp} setOtp={setOtp} />
        </div>
      </div>
    </div>
  </div>
 );
}
