"use client"

import { createContext, useContext, Dispatch, SetStateAction, useState, useEffect, ReactNode } from "react"

interface ContextProps {
    language: string,
    setLanguage: Dispatch<SetStateAction<string>>,
    viewType: string,
    setViewType: Dispatch<SetStateAction<string>>, 
    openAuth: boolean,
    setOpenAuth: Dispatch<SetStateAction<boolean>>,
    isRLHFEnabled: boolean,
    setIsRLHFEnabled: Dispatch<SetStateAction<boolean>>,
}

const GlobalContext = createContext<ContextProps>({
    language: '',
    setLanguage: (): string => '',
    viewType: '',
    setViewType: (): string => '',
    openAuth: false,
    setOpenAuth: (): boolean => false,
    isRLHFEnabled: true,
    setIsRLHFEnabled: (): boolean => false,
})

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState('')
    const [viewType, setViewType] = useState('tutorial')
    const [openAuth, setOpenAuth] = useState(false)
    const [isRLHFEnabled, setIsRLHFEnabled] = useState(true)

    return(
        <GlobalContext.Provider value={{ language, setLanguage, viewType, setViewType, openAuth, setOpenAuth, isRLHFEnabled, setIsRLHFEnabled }}>
        {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext)