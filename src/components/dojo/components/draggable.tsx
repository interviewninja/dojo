"use client"

import 'regenerator-runtime/runtime';
import React, { useState, useEffect, useRef } from 'react';
import Webcam from "react-webcam";
import { Mic, MicOff, Play, Pause } from 'lucide-react';
import { Windmill } from "react-activity";
import "react-activity/dist/library.css"; import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useGlobalContext } from '@/contexts/global';
import { Rnd } from 'react-rnd'
import Image from 'next/image'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { useToast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from 'uuid';
import { useContext } from "react";
import { TranscriptContext } from "@/contexts/TranscriptContext";
import { dev } from '@/dev';
import axios from 'axios'
import { GoogleGenerativeAI } from "@google/generative-ai"

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 4,
  maxWidth: "200px",
  maxHeight: "200px",
};

export const Draggable = ({ code }: { code: string }) => {
  const { transcript: context, setTranscript, isAnimated, setIsAnimated, isAudioPlaying } = useContext(TranscriptContext)
  const { toast } = useToast();
  const { language, setLanguage } = useGlobalContext();
  const [isHolding, setIsHolding] = useState(false);
  const [hasPressed, setHasPressed] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false)
  const [requestingLanguage, setRequestingLanguage] = useState(false)
  const [screenRecording, setScreenRecording] = useState<string>("")
  const [videoSrc, setVideoSrc] = useState<string>("/default.mp4")
  const [nextVideoSrc, setNextVideoSrc] = useState<string | null>(null)
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMicOn, setIsMicOn] = useState(false)
  const initialRender = useRef<boolean>(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const { transcript, browserSupportsSpeechRecognition, resetTranscript, listening } = useSpeechRecognition()

  const handleRecording = () => {
    if(isMicOn){ 
      SpeechRecognition.stopListening()
      setIsMicOn(false)
      return 
    }
    setIsMicOn(true)
    if(initialRender.current){
      initialRender.current = false
      const message = "Great, you're ready to start! Just tell me, do you prefer JavaScript or Python for our interview?"
      const newMessage = { id: uuidv4(), interviewer: true, payload: message, audio: false }
      setTranscript(prevTranscript => [...prevTranscript, newMessage])
      setRequestingLanguage(true)
      setNextVideoSrc("/initialize.mp4")
      return
    }
    resetTranscript()
    SpeechRecognition.startListening({ continuous: true }) 
  }

  const genPrompt = () => {
    return `
      Task: You are an experienced senior software engineer conducting a technical coding interview. Provide a concise ONE-TWO SENTENCE response that aligns the user's question, the current code, and the given challenge, while factoring the total conversation, WITHOUT directly providing the answer to the coding challenge. If the question doesn’t align feel free to clarify any confusion.

      Challenge: Write a program that iterates over the range of numbers from 1 to 16 and appends each number or string representation of conditions (e.g., Fizz, Buzz, FizzBuzz) to an array. However, the program must handle the following special cases:
              - For multiples of 3, append "Fizz" to the array instead of the number.
              - For multiples of 5, append "Buzz" to the array instead of the number.
              - For multiples of both 3 and 5, append "FizzBuzz" to the array instead of the number.

      Current Code: ${code}

      User Question: ${transcript}

      Conversational Context: ${context.pop()}
    `
  }

  const getLLMGANResponse = async () => {
    if(!language) return
    
    const getLLM = new GoogleGenerativeAI(`${process.env.GOOGLE_GEMINI_API_KEY}`)
    const model = getLLM.getGenerativeModel({model: "gemini-pro"})

    model.generateContent(genPrompt())
    .then(result => {
      const message = result.response.text()
      setIsWaiting(true)
      // 
      const headers = {
        'ngrok-skip-browser-warning': 'true'
      }
      const baseUrl = process.env.GOOGLE_COLAB_API_URL
      axios.post(`${baseUrl}/api/inference`, {
        message: message,
      }, { 
        headers,
        responseType: 'blob' 
      })
      .then((res) => {
        setIsWaiting(false)
        const videoUrl = URL.createObjectURL(res.data); 
        setNextVideoSrc(videoUrl)
        const newMessage = { id: uuidv4(), interviewer: true, payload: message, audio: false }
        setTranscript(prevTranscript => [...prevTranscript, newMessage])
        setIsAnimated(false)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      // const newMessage = { id: uuidv4(), interviewer: true, payload: message, audio: false }
      // setTranscript(prevTranscript => [...prevTranscript, newMessage])
      // setIsAnimated(false)
    })
  }

  useEffect(() => {
    if(transcript && !isAnimated){
      const timeoutId = setTimeout(() => {
        const newMessage = { id: uuidv4(), interviewer: false, payload: `${transcript}.` }
        setTranscript(prevTranscript => [...prevTranscript, newMessage])
        getLLMGANResponse()
        resetTranscript()
        setIsAnimated(true)

        if(requestingLanguage){
          setRequestingLanguage(false)
          setIsAnimated(false)

          const containsPython = transcript.toLowerCase().includes("python")
          const containsJavaScript = transcript.toLowerCase().includes("javascript")

          let selectedLanguage = "javascript"

          if(containsPython && !containsJavaScript){
            selectedLanguage = "python"
          }

          setLanguage(selectedLanguage)
          const message = "Excellent choice! Let's dive into the coding exercise."
          const newMessage = { id: uuidv4(), interviewer: true, payload: message, audio: false }
          setTranscript(prevTranscript => [...prevTranscript, newMessage])
          setNextVideoSrc("/commencement.mp4")
        }
        console.log("the user has paused")
      }, 2000)

      return () => clearTimeout(timeoutId)
    }
  }, [transcript, isAudioPlaying])

  useEffect(() => {
    if(isVideoPlaying){
      SpeechRecognition.stopListening()
      resetTranscript()
      return
    }
    resetTranscript()
    SpeechRecognition.startListening({ continuous: true }) 
  }, [isVideoPlaying])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = videoSrc;
      videoRef.current.muted = isVideoMuted;
      videoRef.current.autoplay = true;
      videoRef.current.loop = isVideoMuted;
    }
  }, [isVideoMuted, videoSrc]);

  useEffect(() => {
    if(videoRef.current && nextVideoSrc){
      setIsVideoPlaying(true)
      setIsVideoMuted(false)
      setVideoSrc(nextVideoSrc)

      videoRef.current.onended = () => {
        setIsVideoMuted(true)
        setVideoSrc('/default.mp4');
        setIsVideoPlaying(false)
      };
  
    }

    return () => {
      if (videoRef.current) videoRef.current.onended = null;
    };
  }, [nextVideoSrc])

  useEffect(() => {
    if(!isWaiting) return
    
    const timeoutId = setTimeout(() => {
      setNextVideoSrc("/interjection.mp4")
      const newMessage = { id: uuidv4(), interviewer: true, payload: "Hmm, thats a great question. Let me take a look.", audio: false }
      setTranscript(prevTranscript => [...prevTranscript, newMessage])
      setIsWaiting(false)
    }, 3000)

    return () => clearTimeout(timeoutId)
  }, [isWaiting])
  
  return (
    <div>
      <Rnd
        enableResizing={false}
        style={style}
        default={{
          x: 0,
          y: 0,
          width: "182.5px", //"365px",
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
                <Windmill animating={isAnimated} color={'background'} size={16} className='absolute bottom-[25px] left-[10px] z-2' />
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
          <div className='w-[100%] h-full p-1 relative'>
            <div className='flex w-full h-full relative rounded-lg border overflow-hidden'>
              <video ref={videoRef} className='w-auto h-full object-cover'>
                <source src={videoSrc} type="video/mp4" />
              </video>
            </div>
            <Windmill animating={isAnimated} color={'white'} size={16} className='absolute bottom-[25px] left-[10px] z-2' />
            <div
              onClick={handleRecording}
              className='absolute bottom-[10px] right-[10px] z-10 cursor-pointer'>
              { !isMicOn && initialRender.current && <Play className="h-5 w-5 text-white"/> }
              { !isMicOn && !listening && !initialRender.current && <MicOff className="h-5 w-5 text-white"/> }
              { isMicOn && listening && !initialRender.current && <Mic className="h-5 w-5 text-white"/> }
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
