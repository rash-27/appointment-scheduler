"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Doctor() {
  const {data : session}= useSession();
  const router = useRouter();


  return ( 
  <div>
    Doctor
  </div>
 );
}
