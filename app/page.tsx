"use client"
import "./globals.css"
import { useState } from "react";
import Image from "next/image";
import AppBar from "./components/Appbar";

export default function Home() {
  const [theme, setTheme] = useState('light');
  return (
  
  <div className={` ${(theme=='dark') ? 'bg-background text-white ' : ' '} `}>
  <AppBar theme={theme} setTheme={setTheme}/>
  Home page
  </div>
 );
}
