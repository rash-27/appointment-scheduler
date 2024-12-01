"use client"
import { useContext, useEffect, useState } from "react";
import { FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { ThemeContext } from "@/components/Appbar";

export default function Signin() {

  const [phoneNum, setPhoneNum]= useState('');
  const [password, setPassword]=useState('');
  const [role, setRole] = useState('USER');
  const {data : session}= useSession();
  const theme = useContext(ThemeContext);
  console.log(session)
  useEffect(()=>{
    if(session){
      router.push('/')
    }
  },[session])
  const router = useRouter();
  async function handleOnClick(){
      console.log(phoneNum, password)
      await signIn('credentials',{phoneNumber : phoneNum, password: password, role : role});
      router.push('/')
  }
  return (
  
  <div className={`${(theme=='dark') ? 'bg-background text-white ' : ' '} `}>
      <div className="flex flex-col justify-center min-h-screen">
        <div className="flex justify-center">
          <div className="text-center flex flex-col bg-secondary-200 text-black border border-primary-500 rounded-xl px-20 py-12">
            <div className="font-heading font-bold text-xl pb-8">Register</div>
            <div className="pb-6">
            <TextField size="small" id="outlined-basic" label="Phone Number" value={phoneNum} onChange={(e)=>setPhoneNum(e.target.value)}
            type="text" variant="outlined" 
            sx={{
              "& .MuiOutlinedInput-root": {
              color: "#000",
              fontFamily: "Arial",
              fontWeight: "bold",

              "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#000",
              borderWidth: "1px",
              borderRadius : "4px"
              },
            },
              "& .MuiInputLabel-outlined": {
              color: "#000", 
              borderRadius : "4px"
            },
           }}  
          className="border border-primary-500 rounded-lg" />
          </div>
          <div className="pb-6">
          <TextField size="small" id="outlined-adornment-password" label="Password" 
            type="password" variant="outlined"
            value={password} onChange={(e)=>setPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
              color: "#000",
              fontFamily: "Arial",
              fontWeight: "bold",

              "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#000",
              borderWidth: "1px",
              borderRadius : "4px"
              },
            },
              "& .MuiInputLabel-outlined": {
              color: "#000",
              borderRadius : "4px"
            },
           }}  
          className="border rounded-lg" />
          </div>

    <div className="pl-1 pb-6">
      <div className="flex justify-start">Role</div>
      <RadioGroup
        onChange={(e)=>setRole(e.target.value)}
        value={role}
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value="USER" control={<Radio />} label="User" />
        <FormControlLabel value="DOCTOR" control={<Radio />} label="Doctor" />
      </RadioGroup>
    </div>

          <div className={` flex justify-center text-white`}>
          <div className="font-normal bg-primary-500 text-white px-3 py-1.5 rounded-md  transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary-400 hover:shadow-lg cursor-pointer "
            onClick={handleOnClick}>Signin</div>
          </div>
          <div className="mt-3">
          Don't have an account? <Link href={'/signup'} className="text-blue-500">Register</Link>
          </div>
          </div>
        </div>
      </div>
  </div>
 );
}
