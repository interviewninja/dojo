"use client"

import { createContext, useContext, Dispatch, SetStateAction, useState, useEffect, ReactNode } from "react"

interface ContextProps {
    language: string,
    setLanguage: Dispatch<SetStateAction<string>>,
    viewType: string,
    setViewType: Dispatch<SetStateAction<string>>, 
    openAuth: boolean,
    setOpenAuth: Dispatch<SetStateAction<boolean>>,
}

const GlobalContext = createContext<ContextProps>({
    language: '',
    setLanguage: (): string => '',
    viewType: '',
    setViewType: (): string => '',
    openAuth: false,
    setOpenAuth: (): boolean => false,
})

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState('')
    const [viewType, setViewType] = useState('tutorial')
    const [openAuth, setOpenAuth] = useState(false)

    return(
        <GlobalContext.Provider value={{ language, setLanguage, viewType, setViewType, openAuth, setOpenAuth }}>
        {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext)