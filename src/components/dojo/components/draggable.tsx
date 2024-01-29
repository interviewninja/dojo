"use client"

import 'regenerator-runtime/runtime';
import React, { useState, useEffect, useRef } from 'react';
import Webcam from "react-webcam";
import { Mic, VideoOff, Play, Pause } from 'lucide-react';
import { Windmill } from "react-activity";
import "react-activity/dist/library.css"; import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useGlobalContext } from '@/contexts/global';
import { isMobile } from 'react-device-detect';
import { Rnd } from 'react-rnd'
import Image from 'next/image'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { useToast } from "@/components/ui/use-toast"
import { useContext } from "react";
import { TranscriptContext } from "@/context/TranscriptContext";
import { dev } from '@/dev';

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 4,
  maxWidth: "200px",
  maxHeight: "200px",
};

export const Draggable = () => {
  const { setTranscript, isAnimated, setIsAnimated } = useContext(TranscriptContext)
  const { toast } = useToast();
  const { viewType, setViewType } = useGlobalContext();
  const [isHolding, setIsHolding] = useState(false);
  const [hasPressed, setHasPressed] = useState(false);
  
  const { transcript, browserSupportsSpeechRecognition, resetTranscript, listening } = useSpeechRecognition()

  const handleRecording = () => {
    if(hasPressed){ 
      SpeechRecognition.stopListening()
      setHasPressed(false)
      return 
    }
    resetTranscript()
    SpeechRecognition.startListening({ continuous: true }) 
    setHasPressed(true)
  }

  useEffect(() => {
    if(transcript && !isAnimated){
      const timeoutId = setTimeout(() => {
        const newMessage = { interviewer: false, payload: `${transcript}.`, id: Math.floor(Math.random() * 1_000_000_000) + 1 }
        setTranscript(prevTranscript => [...prevTranscript, newMessage])
        resetTranscript()
        setIsAnimated(true)
        dev.log("the user has paused")
      }, 2000)

      return () => clearTimeout(timeoutId)
    }
  }, [transcript])

  return (
    <div>
      <Rnd
        enableResizing={false}
        style={style}
        default={{
          x: 0,
          y: 0,
          width: "365px",
          height: "182.5px"
        }}
      >
        {/* {viewType === "tutorial" ?
          <div className='w-[50%] h-full p-1 relative'>
            <div className='flex w-full h-full relative rounded-lg border overflow-hidden'>
              <video className='w-auto h-full object-cover' autoPlay muted loop>
                <source src="/base.mp4" type="video/mp4" />
              </video>
            </div>
            <Windmill animating={isAnimated} color={'background'} size={16} className='absolute bottom-[30px] left-[10px] z-2' />
            <div
              onClick={handleRecording}
              className='absolute bottom-[10px] right-[10px] z-10 cursor-pointer'>
              { !hasPressed && <Play color={'background'}/> }
              { hasPressed && <Pause color={'background'}/> }
              <HoverCard openDelay={200}>
                <HoverCardTrigger asChild>
                  <div className="h-full w-full absolute bottom-0 left-0"></div>
                </HoverCardTrigger>
                <HoverCardContent className="w-fit text-left text-xs" side="left">
                  { !hasPressed ?
                  <>
                    <b>Press to start interview</b>
                    <br></br>
                    <div  className="max-w-[300px] text-wrap">Once you start all audio will be recorded. Treat this like an interview environment.</div>
                  </>
                  :
                  <>
                    <b>Press to pause interview</b>
                    <br></br>
                    <div  className="max-w-[300px] text-wrap">Once you pause, audio will no longer be recorded.</div>
                  </>
                  }
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
          :
          <div className='w-full h-full p-1'>
            <div className='grid grid-cols-2 h-full w-full'>
              <div className='w-full h-full p-1 relative'>
                <div className='flex w-full h-full relative rounded-lg border overflow-hidden'>
                  <video className='w-auto h-full object-cover' autoPlay muted loop>
                    <source src="/base.mp4" type="video/mp4" />
                  </video>
                </div>
                <Windmill animating={isAnimated} color={'background'} size={16} className='absolute bottom-[30px] left-[10px] z-2' />
                <div
                  onClick={handleRecording}
                  className='absolute bottom-[10px] right-[10px] z-10 cursor-pointer'>
                  { !hasPressed && <Play color={'background'}/> }
                  { hasPressed && <Pause color={'background'}/> }
                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      <div className="h-full w-full absolute bottom-0 left-0"></div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-fit text-left text-xs" side="left">
                      { !hasPressed ?
                      <>
                        <b>Press to start interview</b>
                        <br></br>
                        <div  className="max-w-[300px] text-wrap">Once you start all audio will be recorded. Treat this like an interview environment.</div>
                      </>
                      :
                      <>
                        <b>Press to pause interview</b>
                        <br></br>
                        <div  className="max-w-[300px] text-wrap">Once you pause audio will no longer be recorded.</div>
                      </>
                      }
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>
              <div className='w-full h-full p-1 relative'>
                <div className='w-full h-full relative rounded-lg border [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground overflow-hidden bg-secondary'>
                  <Webcam
                    mirrored={true}
                    audio={false}
                    style={{ height: "100%", width: "100%", position: "absolute", zIndex: 1 }}
                    className='flex object-cover'
                    onUserMediaError={() => {
                      toast({
                        title: "Media not found!",
                        description: isMobile ? "Refresh page and allow camera access!" : "Allow camera access, then refresh the page!",
                      }), setViewType("tutorial")
                    }}
                  ></Webcam>
                </div>
                <VideoOff color="#09090B" className='w-[2.25vw] h-auto absolute top-3 left-3 z-0' />
              </div>
            </div>
          </div>} */}
          <div className='w-[50%] h-full p-1 relative'>
            <div className='flex w-full h-full relative rounded-lg border overflow-hidden'>
              <video className='w-auto h-full object-cover' autoPlay muted loop>
                <source src="/base.mp4" type="video/mp4" />
              </video>
            </div>
            {/* <Windmill animating={isAnimated} color={'background'} size={16} className='absolute bottom-[30px] left-[10px] z-2' /> */}
            <div
              onClick={handleRecording}
              className='absolute bottom-[10px] right-[10px] z-10 cursor-pointer'>
              { !hasPressed && <Play color={'background'}/> }
              { hasPressed && <Pause color={'background'}/> }
              <HoverCard openDelay={200}>
                <HoverCardTrigger asChild>
                  <div className="h-full w-full absolute bottom-0 left-0"></div>
                </HoverCardTrigger>
                <HoverCardContent className="w-fit text-left text-xs" side="left">
                  { !hasPressed ?
                  <>
                    <b>Press to start interview</b>
                    <br></br>
                    <div  className="max-w-[300px] text-wrap">Once you start all audio will be recorded. Treat this like an interview environment.</div>
                  </>
                  :
                  <>
                    <b>Press to pause interview</b>
                    <br></br>
                    <div  className="max-w-[300px] text-wrap">Once you pause, audio will no longer be recorded.</div>
                  </>
                  }
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
      </Rnd>
    </div>
  )
};
