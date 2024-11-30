"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import axios from "axios";
import SlotList from "./SlotList";
import DoctorAppointments from './DoctorAppointments'

export default function Doctor() {
  const {data : session}= useSession();
  const router = useRouter();

  return ( 
  <div className="grid grid-cols-2 gap-6 mt-6">
      <div>
        <SlotList />
      </div>
      <div>
        <DoctorAppointments />
      </div>
  </div>
 );
}
