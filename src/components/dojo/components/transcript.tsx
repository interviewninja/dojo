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
import { ElevenLabsClient, play } from "elevenlabs";
import { v4 as uuidv4 } from 'uuid';
import { createWriteStream } from "fs";
import { stream } from 'undici';
import { dev } from "@/dev"

export const Transcript = () => {
  const { transcript, setTranscript, isAnimated, isAudioPlaying, setisAudioPlaying } = useContext(TranscriptContext)
  const [utterance, setUtterance] = useState<any>(null)
  const [audioURL, setAudioURL] = useState<any>(null);
  const outputRef =  useRef<HTMLDivElement | null>(null);

  function capitalizeSentences(text:string) {
    return text.replace(/(^|\.\s+|\!\s+|\?\s+)([a-z])/g, (match) => match.toUpperCase());
  }

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [outputRef])

  useEffect(() => {
    if (transcript.length === 0) return;

    const mostRecent = transcript[transcript.length - 1];
    if (mostRecent?.interviewer && mostRecent?.audio) {
      setisAudioPlaying(true);

      const playAudio = async () => {
        try {
          throw new Error('Not implemented');
          const response = await fetch('/api/generateAudio', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: mostRecent.payload,
              voice: 'Jessica',
            }),
          });

          if (!response.ok) {
            throw new Error('Error generating audio');
          }

          const { filePath } = await response.json();

          const audioElement = new Audio(filePath);
          audioElement.play();

          audioElement.onended = () => {
            setisAudioPlaying(false);
          };
        } catch (error) {
          console.error('Error generating audio:', error);

          // Fallback to speech synthesis
          const synth = window.speechSynthesis;
          const utterance = new SpeechSynthesisUtterance(mostRecent.payload);
          synth.speak(utterance);

          utterance.onend = () => {
            setisAudioPlaying(false);
          };
        }
      };

      playAudio();

      return () => {
        window.speechSynthesis.cancel();
      };
    }
  }, [transcript, setisAudioPlaying]);
  return (
    <div id="output" className="h-full w-full flex gap-[10px] flex-col relative overflow-scroll max-h-[950px]" ref={outputRef}>
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
      {audioURL && (
        <audio autoPlay controls>
          <source src={audioURL} type="audio/mpeg" />
        </audio>
      )}

    </div>
  );
};
