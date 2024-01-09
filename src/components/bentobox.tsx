"use client"

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes'
import { Button } from "./ui/button"
import { Bot, Zap, HelpCircle, BookMarked, CalendarClock, MoveUpRight, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert" 

export function BentoBox() {
    const { theme, setTheme } = useTheme()
    const [dojo, setDojo] = useState<string>()
    const [cloud, setCloud] = useState<string>()
    const [schedule, setSchedule] = useState<string>()
    const [shadow, setShadow] = useState<string>()

    useEffect(() => {
        if(theme == "dark"){
            setDojo("https://i.ibb.co/KrBW0yQ/Mask-group.png") 
            setCloud("https://i.ibb.co/HpjsCcW/Mask-group-1.png")
            setSchedule("https://i.ibb.co/tX2G1Pz/Group-8845-1.png")
            return
        }
        setDojo("https://i.ibb.co/GkbdttT/Mask-group-1.png")
        setCloud("https://i.ibb.co/qRSSNLk/Mask-group.png")
        setSchedule("https://i.ibb.co/TwQzqjC/Group-8843.png")
    }, [theme])

    return(
        <div className='flex justify-center my-[60px]'>
            <div className='w-[80%] h-fit flex flex-col gap-y-4'>
                <div className='flex flex-col overflow-hidden rounded-[0.5rem] border bg-background shadow md:flex-row'>
                    <div className='w-[100%] p-8 gap-y-3 flex flex-col'>
                        <div className='text-2xl text-primary'>Simulate an interactive coding interview environment</div>
                                <div className='text-lg text-border dark:text-[#1B392E]'>Get personalized feedback, identify your weaknesses, and ace your next interview.</div>
                        <div className='flex flex-col gap-y-1'>
                            <div className='flex gap-x-4 items-center'>
                                <div className='flex items-center justify-center rounded-full p-[2px] bg-border dark:bg-[#1B392E]'>
                                    <ArrowRight className='h-4 w-4 text-background'/>
                                </div>
                                <div className='text-lg text-border dark:text-[#1B392E]'>Built-in Browser REPL</div>
                            </div>
                            <div className='flex gap-x-4 items-center'>
                                <div className='flex items-center justify-center rounded-full p-[2px] bg-border dark:bg-[#1B392E]'>
                                    <ArrowRight className='h-4 w-4 text-background'/>
                                </div>
                                <div className='text-lg text-border dark:text-[#1B392E]'>AI Coding Assistant powered by LLaMa-2</div>
                            </div>
                            <div className='flex gap-x-4 items-center'>
                                <div className='flex items-center justify-center rounded-full p-[2px] bg-border dark:bg-[#1B392E]'>
                                    <ArrowRight className='h-4 w-4 text-background'/>
                                </div>
                                <div className='text-lg text-border dark:text-[#1B392E]'>24/7 Assistance</div>
                            </div>
                        </div>
                    </div>
                    <div className='flex items-end'>
                        {/* <img className='' src={theme == "dark" || theme == undefined ? "https://i.ibb.co/xhsWDGM/Mask-group.png" : "https://i.ibb.co/RPCKFHD/Mask-group-1.png"} alt="Dojo Compiler"/> */}
                        <img className='' src={dojo} />
                    </div>
                </div>
                <div className='flex flex-col md:flex-row gap-4'>
                    <div className='flex flex-col overflow-hidden rounded-[0.5rem] border bg-background shadow p-8 pb-0 w-[100%]'>
                        <div className='text-2xl text-primary mb-3'>Fine-tuned using interview transcripts</div>
                        <div className='text-lg text-border dark:text-[#1B392E]'>Trained on technical interviews, and aligned to help you succeed. Your personal AI interview coach in the cloud.</div>
                        <div className='mt-auto self-center'>
                            <img className='w-[300px] h-auto' src={cloud}/>
                        </div>
                    </div>
                    <div className='flex flex-col gap-y-3 overflow-hidden rounded-[0.5rem] border bg-background shadow p-8 pb-5 w-[100%]'>
                        <div className='text-2xl text-primary'>Automate and Scale your hiring process</div>
                        <div className='text-lg text-border dark:text-[#1B392E]'>Ditch scheduling struggles and timezone barriers. Automate your hiring process and scale effortlessly. Hire like a giant, pay like a startup.</div>
                        <div className='relative self-center'>
                            <img className='w-[200px] h-auto z-1 cursor-pointer' src={schedule}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}