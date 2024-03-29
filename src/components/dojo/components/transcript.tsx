"use client"

import React, { useEffect, useState, useRef } from "react";
import ReactDOMServer from 'react-dom/server';
import $ from 'jquery';
import { defaults, Default } from "../data/defaults";
import { ascii }  from "../data/ascii";
import { Bounce } from "react-activity";
import "react-activity/dist/library.css";
import { useContext } from "react";
import { TranscriptContext } from "@/context/TranscriptContext";
import { useGlobalContext } from "@/contexts/global"
import { dev } from "@/dev"

// interface OutputProps {
//   outputDetails: {
//     status: {
//       id: number;
//     };
//     stdout: string;
//     compile_output: string;
//     stderr: string;
//   }
// }

export const Transcript = () => {
  const { transcript, setTranscript, isAnimated, isTalking, setIsTalking } = useContext(TranscriptContext)
  const [utterance, setUtterance] = useState<any>(null)
  // const { language, setLanguage } = useGlobalContext()
  // const [ defaultPath ] = useState(defaults[0].path)
  // const [outputHistory, setOutputHistory] = useState<(JSX.Element | null)[]>([]);
  // const [selectedPath, setSelectedPath] = useState("")
  const outputRef =  useRef<HTMLDivElement | null>(null);

  // const getOutput = (): JSX.Element | null => {
  //   const statusId = outputDetails?.status?.id;
  //   const standardOutput = outputDetails?.stdout;

  //   // dev.log("standard output:", atob(standardOutput));

  //   if (statusId === 6) {
  //     // compilation error
  //     return (
  //       <pre className="py-1 px-2 mx-1 text-sm font-normal text-red-600">
  //         {atob(outputDetails?.compile_output)}
  //       </pre>
  //     );
  //   } else if (statusId === 3) {
  //     return (
  //       <pre className="py-1 px-2 mx-1 text-sm font-normal text-green-600">
  //         {atob(standardOutput) !== null
  //           ? `${atob(standardOutput)}`
  //           : null}
  //       </pre>
  //     );
  //   } else if (statusId === 5) {
  //     return (
  //       <pre className="py-1 px-2 mx-1 text-sm font-normal text-red-600">
  //         Time Limit Exceeded
  //       </pre>
  //     );
  //   } else {
  //     return (
  //       <>
  //         <br></br>
  //         <pre className="py-1 px-2 mx-1 text-sm font-normal text-red-600">
  //           {atob(outputDetails?.stderr)}
  //         </pre>
  //         <br></br>
  //       </>
  //     );
  //   }
  // };

  // useEffect(() => {
  //   if (outputDetails ) {
  //     setOutputHistory((prevOutputHistory) => [
  //       ...prevOutputHistory,
  //       getOutput(),
  //     ]);
  //   }
  // }, [outputDetails]);

  // useEffect(() => {
  //   const matchingDefault = defaults.find((item: Default) => item.language === language);
  //   if (matchingDefault) {
  //       setSelectedPath(matchingDefault.path);
  //   }
  // }, [language])
 
  // useEffect(() => {
  //   $('#output').animate({ scrollTop: $('#output').prop('scrollHeight') }, 1000);
  // }, [outputDetails])

  function capitalizeSentences(text:string) {
    return text.replace(/(^|\.\s+|\!\s+|\?\s+)([a-z])/g, (match) => match.toUpperCase());
  }

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [outputRef])

  useEffect(() => {
    const mostRecent = transcript[transcript.length - 1]
    if(mostRecent?.interviewer){
      setIsTalking(true)

      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(mostRecent?.payload);
      speechSynthesis.speak(utterance)

      utterance.onend = () => {
        setIsTalking(false)
      }

      return () => {
        synth.cancel();
      };
    }
  }, [transcript]);

  return (
    <div id="output" className="h-full w-full flex gap-[10px] flex-col relative overflow-scroll max-h-[950px]" ref={outputRef}>
      {/* <div className="p-4">
        <p className="text-xs font-mono whitespace-pre">
          {ascii}
        </p>
      </div> */}
      
      {/* <span>
      <div className="mb-4 text-sm">Interview Ninja Dojo Compiler v0.1.0-beta, Last connected... <div dangerouslySetInnerHTML={{ __html: new Date().toLocaleString() }}/></div>
      </span> */}
      {/* {outputHistory.map((output, index) => (
        <div key={index} className="mb-2 text-sm">{output}</div>
      ))} */}
      {/* <div className="flex items-center text-sm">
        <b>
        <span className="text-[#24FC7C] flex-shrink-0 whitespace-nowrap"><span className="text-[#4CE087] flex-shrink-0 whitespace-nowrap">guest</span>@csDojo:</span>
        </b>
        <span className="mx-1 text-[#24a5fc]">$</span>
        <input className="flex border-none py-1 bg-transparent w-full focus:outline-none" value={""} onChange={(e) => {e}} />
      </div> */}

      <div className="flex gap-2">
        <div className="min-h-[35px] min-w-[35px] w-[35px] h-[35px] rounded-full overflow-hidden">
          <img src={"/profile.png"}/>
        </div>  
        <div className="bg-background rounded-tr-md rounded-br-md rounded-bl-md p-2 pl-4 border-[.5px] border-border max-w-[350px]">
          <div className="text-primary">Hi, Welcome to Interview Ninja! Let&apos;s begin your coding interview. Press the play icon to start.</div>
        </div>
      </div>  

      {transcript?.map((message) => (
         message.interviewer ?
         <div key={message.id} className="flex gap-2">
            <div className="min-h-[35px] min-w-[35px] w-[35px] h-[35px] rounded-full overflow-hidden">
              <img src={"/profile.png"}/>
            </div>  
            <div className="bg-background rounded-tr-md rounded-br-md rounded-bl-md p-2 pl-4 border-[.5px] border-border max-w-[350px]">
              <div className="text-primary">{capitalizeSentences(message.payload)}</div>
            </div>
          </div>  
         :
         <div key={message.id} className="flex gap-2">
            <div className="min-h-[35px] min-w-[35px] w-[35px] h-[35px] rounded-full overflow-hidden flex items-center justify-center bg-border">
              <div className="text-background font-bold">Y</div>
            </div>  
            <div className="bg-secondary rounded-tr-md rounded-br-md rounded-bl-md p-2 pl-4 border-[.5px] border-border max-w-[350px]">
              <div className="text-primary">{capitalizeSentences(message.payload)}</div>
            </div>
          </div>  
      ))}
      {/* <Bounce animating={isAnimated} color={'primary'} size={8} className='fixed bottom-[0px] left-[20px] z-2' /> */}

    </div>
  );
};
