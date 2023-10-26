"use client"

import { Button } from "@/components/ui/button"
import ReactGA from 'react-ga4';
import { PricingToast } from "../components/pricing-toast"
import { ModeToggle } from "../components/mode-toggle"
import Image from 'next/image'
import logo from "../images/logo.png"
import { useGlobalContext } from "@/contexts/global"
import { useEffect } from "react";

export function Header() {
    const { setOpenAuth } = useGlobalContext()

    return(
    <div className='container flex h-14 items-center space-x-4 sm:justify-between sm:space-x-0'>
        <div className="flex items-center">
        <div className="h-full w-auto p-0">
            <Image 
            src={logo} 
            height={32} 
            width={32} 
            alt="logo"
            />
        </div>
        <div className="flex items-center space-x-4"> 
            <Button size="icon" className="h-10 px-4 w-fit bg-background text-border border-border ml-[40px] relative hidden sm:flex space-x-2" variant="documentation">
            <span>Search Documentation...</span>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs text-border">⌥</span>
                <span className="text-xs text-border">D</span>
            </kbd> 
            </Button>
            <PricingToast/>
        </div>
        </div>
        <div className="flex-grow"></div>
        <div className="flex items-center space-x-3">
        <Button onClick={() => {setOpenAuth(true)}} variant="header" size="icon" className="h-10 px-8 py-2">
          <span>Login</span>
        </Button>
        <ModeToggle/>
        </div>
    </div>
    )
}
