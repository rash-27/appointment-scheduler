"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import DoctorsList from "./DoctorsList";
import AppointmentList from "./AppointmentList";

export default function User() {
  const {data : session}= useSession();
  const router = useRouter();

  return ( 
  <div className="grid grid-cols-2 gap-6 mt-6">
      <div>
        <DoctorsList />
      </div>
      <div>
        <AppointmentList />
      </div>
  </div>
 );
}
