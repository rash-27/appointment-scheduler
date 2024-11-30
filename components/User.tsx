"use client"
import DoctorsList from "./DoctorsList";
import AppointmentList from "./AppointmentList";

export default function User() {


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
