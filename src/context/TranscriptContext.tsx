"use client"

import React, { createContext, useState, Dispatch, SetStateAction } from "react"

type TranscriptContextInterface = {
    transcript: any[];
    setTranscript: Dispatch<SetStateAction<any[]>>;
    isTalking: boolean;
    setIsTalking:  Dispatch<SetStateAction<boolean>>;
    isAnimated: boolean;
    setIsAnimated: Dispatch<SetStateAction<boolean>>;
};
  
export const TranscriptContext = createContext<TranscriptContextInterface>({
  transcript: [],
  setTranscript: () => {}, 
  isTalking: false,
  setIsTalking: () => {},
  isAnimated: false,
  setIsAnimated: () => {},
})

type TranscriptContextProviderProps = {
    children: React.ReactNode
}

export const TranscriptContextProvider = ({ children }: TranscriptContextProviderProps) => {
    const [transcript, setTranscript] = useState<any[]>([])
    const [isTalking, setIsTalking] = useState<boolean>(true)
    const [isAnimated, setIsAnimated] = useState<boolean>(false)
  
    return (
      <TranscriptContext.Provider value={{ transcript, setTranscript, isTalking, setIsTalking, isAnimated, setIsAnimated }}>
        {children}
      </TranscriptContext.Provider>
    );
  };