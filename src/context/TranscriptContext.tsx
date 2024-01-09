"use client"

import React, { createContext, useState, Dispatch, SetStateAction } from "react"

type TranscriptContextInterface = {
    transcript: any[];
    setTranscript: Dispatch<SetStateAction<any[]>>;
    isAnimated: boolean;
    setIsAnimated: Dispatch<SetStateAction<boolean>>;
};
  
export const TranscriptContext = createContext<Partial<TranscriptContextInterface>>({})

type TranscriptContextProviderProps = {
    children: React.ReactNode
}

export const TranscriptContextProvider = ({ children }: TranscriptContextProviderProps) => {
    const [transcript, setTranscript] = useState<any[]>([])
    const [isAnimated, setIsAnimated] = useState<boolean>(false)
  
    return (
      <TranscriptContext.Provider value={{ transcript, setTranscript, isAnimated, setIsAnimated }}>
        {children}
      </TranscriptContext.Provider>
    );
  };