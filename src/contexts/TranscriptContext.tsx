"use client"

import React, { createContext, useState, Dispatch, SetStateAction } from "react"

type TranscriptContextInterface = {
    transcript: any[];
    setTranscript: Dispatch<SetStateAction<any[]>>;
    isAudioPlaying: boolean;
    setisAudioPlaying:  Dispatch<SetStateAction<boolean>>;
    isAnimated: boolean;
    setIsAnimated: Dispatch<SetStateAction<boolean>>;
};
  
export const TranscriptContext = createContext<TranscriptContextInterface>({
  transcript: [],
  setTranscript: () => {}, 
  isAudioPlaying: false,
  setisAudioPlaying: () => {},
  isAnimated: false,
  setIsAnimated: () => {},
})

type TranscriptContextProviderProps = {
    children: React.ReactNode
}

export const TranscriptContextProvider = ({ children }: TranscriptContextProviderProps) => {
    const [transcript, setTranscript] = useState<any[]>([])
    const [isAudioPlaying, setisAudioPlaying] = useState<boolean>(true)
    const [isAnimated, setIsAnimated] = useState<boolean>(false)
  
    return (
      <TranscriptContext.Provider value={{ transcript, setTranscript, isAudioPlaying, setisAudioPlaying, isAnimated, setIsAnimated }}>
        {children}
      </TranscriptContext.Provider>
    );
  };