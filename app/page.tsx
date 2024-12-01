"use client"
import "./globals.css"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Doctor from "@/components/Doctor";
import User from "@/components/User";

export default function Home() {
  const [user, setUser]= useState(null);
  const {data : session}= useSession();
  const router = useRouter();

  useEffect(()=>{
    if(!session)router.push('/signin')
    if(session?.user.role == 'DOCTOR'){
      axios.get(`/api/doctor/${session.user.id}`)
      .then((res)=>{
        if(res.status == 200){
          const user = res.data;
          if(!user.isVerified)router.push('/verify')
          else if(!user.isValid) router.push('/validate');
        } 
      })
      .catch((err)=>console.log(err));
    }else {
      if(session?.user.role == 'USER'){
      axios.get(`/api/user/${session?.user.id}`)
      .then((res)=>{
       if(res.status == 200){
           const user = res.data;
          if(!user.isVerified)router.push('/verify') 
      }
      })
      .catch((err)=>console.log(err));  
      }
  }
},[session])

  return ( 
  <div>
    {(session?.user.role == 'DOCTOR')?
      <Doctor />
    : 
      <User />
    }
  </div>
 );
}
