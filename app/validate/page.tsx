"use client"
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home() {
  const {data : session} = useSession();
  const router = useRouter();
  useEffect(()=>{
    if(session && session?.user.role == 'DOCTOR'){
      axios.get(`/api/doctor/${session.user.id}`)
      .then((res)=>{
      if(res.status == 200){
        const user = res.data;
        if(user.isValid){
          router.push('/')
        }
      }
      })
      .catch((err)=>console.log(err));
    }else {
      if(session && session?.user.role == 'USER'){
        router.push('/')
    }
  }
  },[session])
  return (
  
  <div>
    <div className="min-h-screen flex flex-col justify-center">
      <div className="flex justify-center">
        <div>
          <div className="text-2xl mb-3 font-bold">Your Account is still under verification of our team!!</div>
          <div className="font-bold">Steps for verification</div>
          <div>1. Join our Slack community</div>
          <div>2. Post your proof of education in the #verify channel</div>
          <div>3. Our team will reach you back once your details are verified</div>
        </div>
      </div>
    </div>
  </div>
 );
}
