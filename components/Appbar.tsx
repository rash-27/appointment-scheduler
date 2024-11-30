"use client"
import { Modal } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {  useEffect, useState } from "react";
import { createContext } from "react";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import { useRouter } from "next/navigation";

export const ThemeContext = createContext('light');


export default function AppBar({children}) {
  const [theme, setTheme] = useState('light');
  const {data : session} = useSession();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter()
  useEffect(()=>{
      if(session && session.user.role == 'DOCTOR'){
        axios.get(`/api/doctor/${session.user.id}`)
        .then((res)=>{
          if(res.status == 200)setUser(res.data);
        })
      }else if(session && session.user.role == 'USER'){
        axios.get(`/api/user/${session.user.id}`)
        .then((res)=>{
          if(res.status == 200)setUser(res.data);
        })
      }
  },[session])

  function handleTheme(){
    if(theme == 'light'){
      setTheme('dark');
    }else {
      setTheme('light');
    }
  }
  async function handleLogout(){
    setOpen(false);
    await signOut({redirect: false});
    router.push('/signin');
  }
  function handleOnClose(){
    setOpen(false);
  }

  return (
  <div className={`${(theme == 'light')? ' ' : 'text-white bg-background '}`}>
  <div className={"flex justify-between px-4 py-2 border-b shadow-md" + `${(theme=='light') ? ' border-primary-500 shadow-primary-200' : ' border-secondary-500 bg-background text-white'}`}>
    <div className="flex flex-col justify-center">Appointment Scheduler</div>
    <div className='flex flex-col justify-center'>
    <div className="flex justify-center">
      <div onClick={handleTheme} className={`px-1.5 cursor-pointer flex flex-col justify-center rounded-full ${(theme=='light') ? ' hover:bg-secondary-200 ': ' hover:bg-primary-300 '}`}>
        {(theme=='light') ? 
        <svg viewBox="0 0 24 24" width="24" height="24" className="lightToggleIcon_pyhR"><path fill="currentColor" d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5 S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1 s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95 c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41 L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41 s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06 c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z"></path></svg>
        :
        <svg viewBox="0 0 24 24" width="24" height="24" className="darkToggleIcon_wfgR"><path fill="currentColor" d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"></path></svg> 
        }
      </div>
      <div className="flex flex-col justify-center">
        {
          session ? 
          <div 
          onClick={()=>setOpen(true)}
          className="px-1.5 flex ml-2 flex-col justify-center rounded-full border-2 transition-all duration-300 ease-in-out hover:scale-110 hover:border-primary-400 hover:shadow-lg border-primary-500 cursor-pointer text-xl font-bold ">
            {session?.user?.name && session?.user.name[0].toUpperCase() || "U"}
          </div>
          :
          <Link href={'/signin'} className="px-2 py-1 ml-2 text-sm border-2 transition-all duration-300 ease-in-out hover:scale-110 hover:border-primary-400 hover:shadow-lg border-primary-500 cursor-pointer font-normal rounded-md">Login</Link>
        }
      </div>
    </div>
  </div>
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
                    {user && <div>
                        <div className="flex justify-center">
                         <div className="text-center text-black text-3xl px-6 py-3 my-8 rounded-full border-2 border-primary-500 font-heading">{session?.user.name[0].toUpperCase()}</div>
                        </div>
                        <div className="text-center font-heading font-medium text-xl text-black">{session?.user.name}</div>
                        <div className="text-center font-normal  text-gray-500">{session?.user?.phone_number}</div>

                        { (session?.user.role == "DOCTOR") &&
                          <div>
                            <div className="text-center font-normal">(DOCTOR)</div>
                            <div className="text-center font-normal text-gray-500">{user?.qualification}</div>
                            {
                              (user?.isValid==false) ? <div className="text-center font-normal text-gray-500">Waiting for validation</div>
                              : <div className="text-center font-normal text-gray-500">Validated</div>

                            }
                          </div>
                        }
                          { user?.isVerified ? 
                        <div className="text-center font-normal text-gray-500">Verified</div>
                          :
                        <div className="text-center font-normal text-gray-500">Waiting for verification</div>
                          }
                        <div className="flex justify-center text-red-500 font-heading">
                          <div className="border-2 border-red-500 rounded-lg px-3 py-2 my-4  transition-all duration-300 ease-in-out hover:scale-110 hover:border-red-400 hover:shadow-lg cursor-pointer " onClick={handleLogout}>Log Out</div>
                        </div>
                    </div>}
                </div>
            </div>
            </div>
      </Modal>
  <ThemeContext.Provider value={theme} >
  <div>
    {children}
  </div>
  </ThemeContext.Provider>
  </div>
 );
}
