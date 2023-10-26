"use client"

import * as React from "react"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { CodeEditor } from "./components/code-editor"
import { Output } from "./components/output"
import { Draggable } from "./components/draggable"
import { Button } from "../ui/button"
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
import { Bot, Zap, HelpCircle, CheckCircle2, PlayCircle } from 'lucide-react';
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
import { dev } from "@/dev"

export function DojoCompiler() {
  const { theme } = useTheme();
  const { setOpenAuth } = useGlobalContext();
  const { language, setLanguage } = useGlobalContext();
  const [code, setCode] = useState(defaults[0].code);
  const [isHovering, setIsHovering] = useState(false)
  const [hex, setHex] = useState("#FFFFFF")
  const [open, setIsOpen] = React.useState(false)
  const [outputDetails] = useState({
    status: {
      id: 0, // Set default values as needed
    },
    stdout: '',
    compile_output: '',
    stderr: '',
  });

  const onChange = (data: any) => {
    setCode(data);
  };

  useEffect(() => {
    const matchingDefault = defaults.find((item: Default) => item.language === language);
    if (matchingDefault) {
      dev.log(matchingDefault.code)
      setCode(matchingDefault.code);
    }
  }, [language])

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
      <div className="hidden h-full flex-col md:flex">
        <div id="dojo" className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16 bg-secondary-foreground brightness-5">
          <h2 className="text-lg font-semibold whitespace-nowrap">Dojo Compiler</h2>
          <div className="ml-auto flex w-full space-x-2 sm:justify-end">
            <div className="hidden space-x-2 md:flex">
              <Share />
            </div>
            <Actions />
          </div>
        </div>
        <Separator/>
        <Tabs defaultValue="complete" className="flex-1 bg-secondary-foreground">
          <div className="container h-full py-6">
          <div className="flex flex-row h-full space-x-5">
            <div className="w-[calc(100%-215px)] relative">
                <TabsContent value="complete" className="mt-0 border-0 p-0">
                  <div className="flex h-full flex-col space-y-4">
                    <FileSelector files={files} />
                    <div className="flex h-auto w-full md:h-screen relative">
                      <CodeEditor
                      code={code}
                      onChange={onChange}
                      language={language}
                      />
                      <div className="absolute h-[40vh] w-[calc(100%-14px)] bottom-0 left-0 supports-backdrop-blur:bg-background/60 bg-background/95 backdrop-blur">
                        <Separator/>
                        <Output outputDetails={outputDetails}/>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-auto mr-4">
                      <Button variant="secondary">Check My Answer
                        <CheckCircle2 className="h-5 w-5 ml-1.5"/>
                      </Button>
                      <Button>Run
                        <PlayCircle className="h-5 w-5 ml-1.5"/>
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <div className="w-20 h-20 absolute top-0 right-[50%]"> 
                <Draggable/>
                </div>
            </div>
            <div className="w-200 min-w-[200px] max-w-[200px] space-y-4">
              <div className="h-fit w-full flex flex-col space-y-2">
                <Label htmlFor="mode">Mode</Label>
                <TabsList id="mode" className="grid grid-cols-2 bg-secondary">
                  <TabsTrigger value="complete">
                    <Bot className="w-5 h-5"/>
                  </TabsTrigger>
                  <TabsTrigger 
                    onMouseEnter={() => {setIsHovering(true)}}
                    onMouseLeave={() => {setIsHovering(false)}}
                    value="insert" className="relative" onClick={() => setOpenAuth(true)}>                                     
                    {/* <Zap 
                    className="w-5 h-5"
                    // color={isHovering ? "#24FC7C" : undefined}
                    /> */}

                    {isHovering ?
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
              <LanguageSelector types={langTypes} languages={languages} />
              <ViewSelector types={viewTypes} views={views} />
              <DifficultySlider defaultValue={[0.05]} />
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
          </div>
          </div>
        </Tabs>
      </div>
    </>
  )
}
