"use client"

import 'regenerator-runtime/runtime';
import * as React from "react"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { CodeEditor } from "./components/code-editor"
import { Transcript } from "./components/transcript"
import { Draggable } from "./components/draggable"
import { Button } from "../ui/button"
import { Windmill, Spinner } from "react-activity";
import "react-activity/dist/library.css";
import { Dialog } from "@radix-ui/react-dialog"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card"
import { useTheme } from "next-themes";
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Bot, Zap, HelpCircle, CheckCircle2, PlayCircle, Mic, MicOff, VideoOff, Play, Pause  } from 'lucide-react';
import { motion } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Wheel, Colorful } from '@uiw/react-color';
import { useGlobalContext } from "@/contexts/global"
import { Textarea } from "../ui/textarea"
import { CodeViewer } from "./components/code-viewer"
import { MaxLengthSelector } from "./components/maxlength-selector"
import { ModelSelector } from "./components/model-selector"
import { LanguageSelector } from "./components/language-selector"
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { ViewSelector } from "./components/view-selector"
import { Task } from "./components/task"
import { Actions } from "./components/actions"
import { Share } from "./components/share"
import { PresetSave } from "./components/preset-save"
import { FileSelector } from "./components/file-selector"
import { DifficultySlider } from "./components/difficulty-slider"
import { TopPSelector } from "./components/top-p-selector"
import { models, modTypes } from "./data/models"
import { langTypes, languages } from "./data/languages"
import { defaults, Default } from "./data/defaults"
import { viewTypes, views } from "./data/views"
import { files } from "./data/files"
import { useContext } from "react";
import { TranscriptContext } from "@/context/TranscriptContext";
import axios from 'axios'
import { dev } from "@/dev"
// import Replicate from "replicate"
import { fizzBuzzTestFn } from "@/testing/FizzBuzz"

export function DojoCompiler() {
  const { setTranscript, isAnimated, setIsAnimated, isTalking } = useContext(TranscriptContext)
  const { theme } = useTheme();
  const { setOpenAuth } = useGlobalContext();
  const { language, setLanguage } = useGlobalContext();
  const [code, setCode] = useState(defaults[0].code);
  const [isHovering, setIsHovering] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [result, setResult] = useState("")
  const [testSpecs, setTestSpecs] = useState<boolean[]>(Array(3).fill(false))
  const [hex, setHex] = useState("#FFFFFF")
  const [open, setIsOpen] = React.useState(false)
  const [hasPressed, setHasPressed] = useState(false)
  const [requestingLanguage, setRequestingLanguage] = useState(false)
  const [isTuringMode, setIsTuringMode] = useState(false)
  const runOnce = useRef<boolean>(false)
  const initialRender = useRef<boolean>(true)
  const runTimes = useRef<number>(0)

  // const [outputDetails] = useState({
  //   status: {
  //     id: 0, // Set default values as needed
  //   },
  //   stdout: '',
  //   compile_output: '',
  //   stderr: '',
  // });
  
  const { transcript, browserSupportsSpeechRecognition, resetTranscript, listening } = useSpeechRecognition()

  const genPrompt = () => {
  // return `
  //   [INST]
  //   <<SYS>>
  //   As a technical lead at a software company conducting a technical interview, your role is to guide, assess, and provide valuable insights to the interviewee. Maintain a professional and constructive tone throughout the interaction. Your feedback should be constructive, focusing on improvement rather than criticism. Encourage the interviewee to think critically and solve problems effectively. Emphasize the importance of clean and efficient code, as well as logical problem-solving skills. If a candidate's response is incorrect or unclear, provide guidance on how to approach the problem or where they may have deviated. Avoid any discriminatory or inappropriate remarks, ensuring a fair and unbiased evaluation. If a question is unclear or seems factually incoherent, seek clarification and guide the interviewee towards a meaningful response. If you're unsure about a specific technical detail, admit it rather than providing false information. Your goal is to create a positive and conducive environment for the interviewee to showcase their technical abilities.
  //   <</SYS>>
  //   Write a program that iterates over the range of numbers from 1 to 16 and appends each number to an array. However, the program must handle the following special cases:
  //       \n For multiples of 3, the program should return Fizz instead of the number.
  //       \n For multiples of 5, the program should return Buzz instead of the number.
  //       \n For multiples of both 3 and 5, the program should return FizzBuzz instead of the number. \n
  //       \n Provide a short response explaining how the code below can be corrected: \n \n ${`${code}`}
  //   [/INST]
  // `
  return `
    ${transcript}. Provide one sentence that aligns with the task requirements and current code, without revealing the solution:

    **Task:** Write a program that iterates over the range of numbers from 1 to 16 and appends each number or string representation of conditions (e.g., Fizz, Buzz, FizzBuzz) to an array. However, the program must handle the following special cases:
        For multiples of 3, append "Fizz" to the array instead of the number.
        For multiples of 5, append "Buzz" to the array instead of the number.
        For multiples of both 3 and 5, append "FizzBuzz" to the array instead of the number.
    
    <|code|> ${code} <|/code|>
  `
  }

  const getLLMResponse = async () => {
    console.log("Button clicked")
    if(!language) return
    // const headers = {
    //   "Authorization": `Bearer ${process.env.RUNPOD_API_KEY}`,
    //   "Content-Type": "application/json",
    // }
    // axios.post(`https://api.runpod.ai/v2/${process.env.RUNPOD_API_ID}/runsync`, {
    //   "input": {
    //     "prompt": genPrompt(),
    //     "max_new_tokens": 500,
    //     "temperature": 0.9,
    //     "top_k": 50,
    //     "top_p": 0.7,
    //     "repetition_penalty": 1.2,
    //     "batch_size": 8,
    //     "stop": ["</s>"]
    //   }
    // },{ headers })
    // .then((res) => {
    //   setTimeout(() => {
    //     axios.get(`https://api.runpod.ai/v2/${process.env.RUNPOD_API_ID}/status/${res.data.id}`,{ headers })
    //     .then((res) => {
    //       console.log("Model output: ", res.data.output)
    //     })
    //   }, 2500)
    // })
    
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.RUNPOD_API_KEY}`,
      'Content-Type': 'application/json'
    };

    const requestData = {
      input: {
        prompt: genPrompt(),
        sampling_params: {
          max_tokens: 250,
          n: 1,
          presence_penalty: 0.3, //0.2
          frequency_penalty: 0.7,
          temperature: .58 //0.3
        }
      }
    };
    
    axios.post('https://api.runpod.ai/v2/llama2-13b-chat/runsync', requestData, { headers })
    .then(response => {
      const res = response.data.output.text[0]
      const newMessage = { interviewer: true, payload: res, id: Math.floor(Math.random() * 1_000_000_000) + 1 }
      setTranscript(prevTranscript => [...prevTranscript, newMessage])
      setIsAnimated(false)
    })
    .catch(error => {
      console.error('Error:', error)
    })

  }

  const handleRecording = () => {
    if(hasPressed){ 
      SpeechRecognition.stopListening()
      setHasPressed(false)
      return 
    }
    setHasPressed(true)
    if(initialRender.current){
      initialRender.current = false
      const message = "Great, you're ready to start! Just tell me, do you prefer JavaScript or Python for our interview?"
      const newMessage = { interviewer: true, payload: message, id: Math.floor(Math.random() * 1_000_000_000) + 1 }
      setTranscript(prevTranscript => [...prevTranscript, newMessage])
      setRequestingLanguage(true)
      return
    }
    resetTranscript()
    SpeechRecognition.startListening({ continuous: true }) 
  }

  useEffect(() => {
    if(isTalking){
      SpeechRecognition.stopListening()
      resetTranscript()
      return
    }
    resetTranscript()
    SpeechRecognition.startListening({ continuous: true }) 
  }, [isTalking])

  useEffect(() => {
    if(transcript && !isAnimated && !isTuringMode){
      const timeoutId = setTimeout(() => {
        const newMessage = { interviewer: false, payload: `${transcript}.`, id: Math.floor(Math.random() * 1_000_000_000) + 1 }
        setTranscript(prevTranscript => [...prevTranscript, newMessage])
        getLLMResponse()
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
        }
        dev.log("the user has paused")
      }, 2000)

      return () => clearTimeout(timeoutId)
    }
  }, [transcript, isTalking])

  const onChange = (data: any) => {
    setCode(data);
  };

  function waitFn(){
    return new Promise( resolve =>
      setTimeout(() => resolve("result"), 3000)
    )
  } 

  const runCode = async () => {
    if(!language) return
    setIsAnimating(true)
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    }
    const baseUrl = process.env.JUDGE0_API_URL
    axios.post(`${baseUrl}/submissions`, {
      "source_code": code,
      "language_id": defaults.find((item: Default) => item.language === language)?.id
    },{ headers })
    .then((res) => {
      const token = res.data.token
      waitFn()
      .then(() => { 
       const rerunCode = () => {
        axios.get(`${baseUrl}/submissions/${token}`,{ headers })
        .then((res) => {

          if(res.data.status.id < 3){
            return waitFn().then(rerunCode)
          }
          runTimes.current += 1

          const output = res.data.stdout
          if(!output){
            if(runTimes.current > 1){
              setIsAnimating(false) 
              return 
            }
              runCode()
              return
          }
          const sanitizedOutput = output.replace(/\s+/g, ' ')
          setResult(sanitizedOutput)

          setTestSpecs(fizzBuzzTestFn(eval(sanitizedOutput)))
          // dev.log(eval(sanitizedOutput), fizzBuzzTestFn(eval(sanitizedOutput)))
          setIsAnimating(false)
        })
        .catch((err) => {
          setIsAnimating(false)
          dev.log("Error", err)
        })
       }
       rerunCode()
      })
    })
    .catch((err) => {
      setIsAnimating(false)
      dev.log("Error", err)
    })

  }

  useEffect(() => {
    const matchingDefault = defaults.find((item: Default) => item.language === language);
    if (matchingDefault) {
      // dev.log(matchingDefault.code)
      setCode(matchingDefault.code);
    }
  }, [language])

  // const changeTheme = () => {
  //   const element = document.getElementById("playground");

  //   if(element && window.scrollY >= element.offsetTop - 75 && !runOnce.current){
  //     runOnce.current = true 
  //     const message = "Hi, Welcome to Interview Ninja! Let's begin your coding interview. Press the play icon to start"
  //     const newMessage = { interviewer: true, payload: `${message}.`, id: Math.floor(Math.random() * 1_000_000_000) + 1 }
  //     setTranscript(prevTranscript => [...prevTranscript, newMessage])
  //     //
  //   }
  // }

  // useEffect(() => {
  //   window.addEventListener('scroll', changeTheme)
  // }, [])

  // function ColorPicker ({color}) {
  //   return(
  //     <HoverCard openDelay={200}>
  //       <HoverCardTrigger asChild>
  //       <div className="h-full w-full absolute bottom-0 left-0"></div>
  //       </HoverCardTrigger>
  //       <HoverCardContent className="w-fit text-left text-sm" side="left">
  //       <Colorful
  //           color={color}
  //           onChange={(color) => {
  //             setHex(color.hex);
  //           }}
  //         />
  //       </HoverCardContent>
  //     </HoverCard>
  //   )
  // }

  return (
    <>
      <div id="playground">
        <div className="hidden h-fit flex-col md:flex overflow-hidden rounded-[0.5rem] border bg-background shadow">
          <div id="dojo" className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16 bg-secondary-foreground brightness-5">
            <div className="flex gap-3 items-center">
              <h2 className="text-lg font-semibold whitespace-nowrap">Dojo Compiler</h2>
              {!isTuringMode && 
              <div
                onClick={handleRecording}
                className={"relative cursor-pointer"}>
                { !hasPressed && initialRender.current && <Play className="h-5 w-5"/> }
                { hasPressed && listening && <MicOff className="h-5 w-5"/> }
                { !hasPressed && !listening && !initialRender.current && <Mic className="h-5 w-5"/> }
                <HoverCard openDelay={200}>
                  <HoverCardTrigger asChild>
                  <div className="h-full w-full absolute bottom-0 left-0"></div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-fit text-left text-xs" side="right">
                    { !hasPressed && initialRender.current ?
                    <>
                      <b>Press to start interview</b>
                      <br></br>
                      <div  className="max-w-[300px] text-wrap">Once you start all audio will be recorded. Treat this like an interview environment.</div>
                    </>
                    :
                    <>
                      <b>Toggle mic during interview</b>
                      <br></br>
                      <div  className="max-w-[300px] text-wrap">When the mic is on, your audio will be sent to the LLM, toggle accordingly.</div>
                    </>
                    }
                  </HoverCardContent>
                </HoverCard>
              </div>
              }
              <Windmill animating={isAnimated} size={12} />
            </div>
            <div className="ml-auto flex w-full space-x-2 sm:justify-end">
              <div className="hidden space-x-2 md:flex">
                <Share />
              </div>
              <Actions />
            </div>
          </div>
          <Separator/>
          <Tabs defaultValue="bot" className="flex-1 bg-secondary-foreground">
            <div className="container h-full py-6">
            <div className="flex flex-row h-full gap-x-[15px]">

              <div className="w-225 min-w-[225px] max-w-[225px] space-y-4">
                <div className="h-fit w-full flex flex-col space-y-2">
                  <Label htmlFor="mode">Mode</Label>
                  <TabsList id="mode" className="grid grid-cols-2 bg-secondary">
                    <TabsTrigger value="bot"
                      onClick={() => (setIsTuringMode(false))}
                    >
                      <Bot className="w-5 h-5"/>
                    </TabsTrigger>
                    <TabsTrigger 
                      onMouseEnter={() => {setIsHovering(true)}}
                      onMouseLeave={() => {setIsHovering(false)}}
                      value="turing" className="relative" 
                      onClick={() => (setIsTuringMode(true))}
                      // onClick={() => setOpenAuth(true)}
                      >    
                      {isHovering || isTuringMode ?
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="url(#gradient)" strokeWidth="2" fill="none" />
                        <defs>
                          <radialGradient id="gradient" cx="50%" cy="50%" r="75%" fx="50%" fy="50%">
                            <animate attributeName="cx" values="50%; 0%; 50%" dur="5s" repeatCount="indefinite" />
                            <animate attributeName="cy" values="50%; 100%; 50%" dur="5s" repeatCount="indefinite" />
                            <stop offset="0%" stopColor="#fffe00" />
                            <stop offset="50%" stopColor="#61ff49" />
                            <stop offset="100%" stopColor="#b3ff00" />
                          </radialGradient>
                        </defs>
                      </svg>
                      :
                      <Zap 
                      className="w-5 h-5"
                      /> 
                      }
                      <HoverCard openDelay={200}>
                        <HoverCardTrigger asChild>
                        <div className="h-full w-full absolute bottom-0 left-0"></div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-fit text-left text-sm" side="left">
                          <b><u>
                            Turing Mode (Boosted)
                            </u>
                          </b>
                          <br></br>
                          Looks and feels like you&apos;re talking to a real person.
                        </HoverCardContent>
                      </HoverCard>
                    </TabsTrigger>
                  </TabsList>
                </div>
                <Task/>
                {/* <LanguageSelector types={langTypes} languages={languages} /> */}
                {/* <ViewSelector types={viewTypes} views={views} /> */}
                {/* <DifficultySlider defaultValue={[0.25]} /> */}
                {/* <Separator/>
                <div className="grid gap-2">
                  <Label htmlFor="mode">Color Theme</Label>
                  <div className="flex relative">
                    <div className="w-[28px] h-[28px] rounded-full bg-black border border-border mr-2 relative" style={{backgroundColor: "#5b864a"}}>
                      <ColorPicker color="#5b864a"/>
                    </div>
                    <div className="w-[28px] h-[28px] bg-black rounded-full border border-border mr-2 relative" style={{backgroundColor: "#579bd6"}}>
                      <ColorPicker color="#579bd6"/>
                    </div>
                    <div className="w-[28px] h-[28px] bg-black rounded-full border border-border mr-2 relative" style={{backgroundColor: "#cb9076"}}>
                      <ColorPicker color="#cb9076"/>
                    </div>
                    <div className="w-[28px] h-[28px] bg-black rounded-full border border-border mr-2 relative" style={{backgroundColor: "#b1caa4"}}>
                      <ColorPicker color="#b1caa4"/>
                    </div>
                    <div className="w-[28px] h-[28px] bg-black rounded-full border border-border mr-2 relative" style={{backgroundColor: "#d0d0d0"}}>
                      <ColorPicker color="#d0d0d0"/>
                    </div>
                    <div className="w-[28px] h-[28px] bg-secondary-foreground rounded-full border border-border"></div>
                  </div>
                </div> */}
              </div>

              <div className="w-[calc(100%-215px)] min-w-[100px] relative">
                  <TabsContent value="bot" className="mt-0 border-0 p-0">
                    <div className="flex h-full flex-col space-y-4">
                      {/* <FileSelector files={files} /> */}
                      <div className="flex h-auto w-full md:h-screen relative">
                        <CodeEditor
                        code={language ? code : ""}
                        onChange={onChange}
                        language={language}
                        />
                      </div>
                      <div className="flex items-center justify-between w-[calc(100%-13px)]">
                        <div className="flex gap-[3px]">
                          <HoverCard openDelay={200}>
                            <HoverCardTrigger asChild>
                              <div className="width-[20px] flex gap-[6px] white-space-nowrap bg-background border-border border-[1px] items-center rounded-sm text-primary h-10 px-4 py-2 cursor-default">
                                {isAnimating && <Spinner animating={isAnimating} color={'primary'} size={8} />}
                                {!isAnimating && <div className={`h-[4px] w-[4px] min-h-[4px] min-w-[4px] ${testSpecs[0] ?  "bg-green-400" : "bg-red-500"} rounded-full`}></div>}
                                {/* Case 1 */}
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-fit text-left text-xs" side="top">
                              <b>Case 1:</b>
                              <br></br>
                              <div className="max-w-[200px] text-wrap">
                              Must return an array with at least 16 elements
                              <br></br>
                              <br></br>
                              Results: <span className={`${testSpecs[0] ?  "text-green-400" : "text-red-500"} text-wrap`}>{result}</span>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                          <HoverCard openDelay={200}>
                            <HoverCardTrigger asChild>
                              <div className="width-[20px] flex gap-[6px] white-space-nowrap overflow-x-hidden bg-background border-border border-[1px] items-center rounded-sm text-primary h-10 px-4 py-2 cursor-default">
                                {isAnimating && <Spinner animating={isAnimating} color={'primary'} size={8} />}
                                {!isAnimating && <div className={`h-[4px] w-[4px] min-h-[4px] min-w-[4px]  ${testSpecs[1] ?  "bg-green-400" : "bg-red-500"} rounded-full`}></div>}
                                {/* Case 2 */}
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-fit text-left text-xs" side="top">
                              <b>Case 2:</b>
                              <br></br>
                              <div className="max-w-[200px] text-wrap">
                              Must return &quot;Fizz&quot; for multiples of 3 and &quot;Buzz&quot; for multiples of 5
                              <br></br>
                              <br></br>
                              Results: <span className={`${testSpecs[1] ?  "text-green-400" : "text-red-500"} text-wrap`}>{result}</span>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                          <HoverCard openDelay={200}>
                            <HoverCardTrigger asChild>
                              <div className="width-[20px] flex gap-[6px] white-space-nowrap bg-background border-border border-[1px] items-center rounded-sm text-primary h-10 px-4 py-2 cursor-default">
                                {isAnimating && <Spinner animating={isAnimating} color={'primary'} size={8} />}
                                {!isAnimating && <div className={`h-[4px] w-[4px] min-h-[4px] min-w-[4px]  ${testSpecs[2] ?  "bg-green-400" : "bg-red-500"} rounded-full`}></div>}
                                {/* Case 3 */}
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-fit text-left text-xs" side="top">
                              <b>Case 3:</b>
                              <br></br>
                              <div className="max-w-[200px] text-wrap">
                              Must return &quot;FizzBuzz&quot; for multiples of both 3 and 5
                              <br></br>
                              <br></br>
                              Results: <span className={`${testSpecs[2] ?  "text-green-400" : "text-red-500"} text-wrap`}>{result}</span>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                        <div className="flex gap-[3px]">
                          <Button className="flex gap-[3px]" disabled={isAnimating} onClick={runCode} >
                            Run
                            <PlayCircle className="h-5 w-5"/>
                          </Button>
                          <Button className="flex gap-[3px]" variant="secondary" onClick={getLLMResponse}>
                            Submit
                            <CheckCircle2 className="h-5 w-5"/>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="turing" className="mt-0 border-0 p-0">
                  <div className="flex h-full flex-col space-y-4">
                      {/* <FileSelector files={files} /> */}
                      <div className="flex h-auto w-full md:h-screen relative">
                        <CodeEditor
                        code={language ? code : ""}
                        onChange={onChange}
                        language={language}
                        />
                      </div>
                      <div className="flex items-center justify-between w-[calc(100%-13px)]">
                        <div className="flex gap-[3px]">
                          <HoverCard openDelay={200}>
                            <HoverCardTrigger asChild>
                              <div className="width-[20px] flex gap-[6px] white-space-nowrap bg-background border-border border-[1px] items-center rounded-sm text-primary h-10 px-4 py-2 cursor-default">
                                {isAnimating && <Spinner animating={isAnimating} color={'primary'} size={8} />}
                                {!isAnimating && <div className={`h-[4px] w-[4px] min-h-[4px] min-w-[4px] ${testSpecs[0] ?  "bg-green-400" : "bg-red-500"} rounded-full`}></div>}
                                Case 1
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-fit text-left text-xs" side="top">
                              <b>Case 1:</b>
                              <br></br>
                              <div className="max-w-[200px] text-wrap">
                              Must return an array with at least 16 elements
                              <br></br>
                              <br></br>
                              Results: <span className={`${testSpecs[0] ?  "text-green-400" : "text-red-500"} text-wrap`}>{result}</span>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                          <HoverCard openDelay={200}>
                            <HoverCardTrigger asChild>
                              <div className="width-[20px] flex gap-[6px] white-space-nowrap overflow-x-hidden bg-background border-border border-[1px] items-center rounded-sm text-primary h-10 px-4 py-2 cursor-default">
                                {isAnimating && <Spinner animating={isAnimating} color={'primary'} size={8} />}
                                {!isAnimating && <div className={`h-[4px] w-[4px] min-h-[4px] min-w-[4px]  ${testSpecs[1] ?  "bg-green-400" : "bg-red-500"} rounded-full`}></div>}
                                Case 2
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-fit text-left text-xs" side="top">
                              <b>Case 2:</b>
                              <br></br>
                              <div className="max-w-[200px] text-wrap">
                              Must return &quot;Fizz&quot; for multiples of 3 and &quot;Buzz&quot; for multiples of 5
                              <br></br>
                              <br></br>
                              Results: <span className={`${testSpecs[1] ?  "text-green-400" : "text-red-500"} text-wrap`}>{result}</span>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                          <HoverCard openDelay={200}>
                            <HoverCardTrigger asChild>
                              <div className="width-[20px] flex gap-[6px] white-space-nowrap bg-background border-border border-[1px] items-center rounded-sm text-primary h-10 px-4 py-2 cursor-default">
                                {isAnimating && <Spinner animating={isAnimating} color={'primary'} size={8} />}
                                {!isAnimating && <div className={`h-[4px] w-[4px] min-h-[4px] min-w-[4px]  ${testSpecs[2] ?  "bg-green-400" : "bg-red-500"} rounded-full`}></div>}
                                Case 3
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-fit text-left text-xs" side="top">
                              <b>Case 3:</b>
                              <br></br>
                              <div className="max-w-[200px] text-wrap">
                              Must return &quot;FizzBuzz&quot; for multiples of both 3 and 5
                              <br></br>
                              <br></br>
                              Results: <span className={`${testSpecs[2] ?  "text-green-400" : "text-red-500"} text-wrap`}>{result}</span>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                        <div className="flex gap-[3px] bg-red-500">
                          <Button disabled={isAnimating} onClick={runCode} >Run
                            <PlayCircle className="h-5 w-5 ml-1.5"/>
                          </Button>
                          <Button variant="secondary">Submit
                            <CheckCircle2 className="h-5 w-5 ml-1.5"/>
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="w-20 h-20 absolute top-0 right-[50%]"> 
                      <Draggable/>
                    </div>
                  </TabsContent>
              </div>

              <div className='hidden h-auto min-w-[300px] w-[350px] lg:flex'>
              <Transcript/>
              </div>

              
            </div>
            </div>
          </Tabs>
        </div>
      </div>
    </>
  )
}
