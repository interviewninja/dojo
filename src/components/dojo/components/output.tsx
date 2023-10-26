"use client"

import React, { useEffect, useState, useRef } from "react";
import ReactDOMServer from 'react-dom/server';
import $ from 'jquery';
import { defaults, Default } from "../data/defaults";
import { ascii }  from "../data/ascii";
import { useGlobalContext } from "@/contexts/global"
import { dev } from "@/dev"

interface OutputProps {
  outputDetails: {
    status: {
      id: number;
    };
    stdout: string;
    compile_output: string;
    stderr: string;
  }
}

export const Output: React.FC<OutputProps> = ({ outputDetails }) => {
  const { language, setLanguage } = useGlobalContext()
  const [ defaultPath ] = useState(defaults[0].path)
  const [outputHistory, setOutputHistory] = useState<(JSX.Element | null)[]>([]);
  const [selectedPath, setSelectedPath] = useState("")
  const outputRef =  useRef<HTMLDivElement | null>(null);

  const getOutput = (): JSX.Element | null => {
    const statusId = outputDetails?.status?.id;
    const standardOutput = outputDetails?.stdout;

    // dev.log("standard output:", atob(standardOutput));

    if (statusId === 6) {
      // compilation error
      return (
        <pre className="py-1 px-2 mx-1 text-sm font-normal text-red-600">
          {atob(outputDetails?.compile_output)}
        </pre>
      );
    } else if (statusId === 3) {
      return (
        <pre className="py-1 px-2 mx-1 text-sm font-normal text-green-600">
          {atob(standardOutput) !== null
            ? `${atob(standardOutput)}`
            : null}
        </pre>
      );
    } else if (statusId === 5) {
      return (
        <pre className="py-1 px-2 mx-1 text-sm font-normal text-red-600">
          Time Limit Exceeded
        </pre>
      );
    } else {
      return (
        <>
          <br></br>
          <pre className="py-1 px-2 mx-1 text-sm font-normal text-red-600">
            {atob(outputDetails?.stderr)}
          </pre>
          <br></br>
        </>
      );
    }
  };

  useEffect(() => {
    if (outputDetails ) {
      setOutputHistory((prevOutputHistory) => [
        ...prevOutputHistory,
        getOutput(),
      ]);
    }
  }, [outputDetails]);

  useEffect(() => {
    const matchingDefault = defaults.find((item: Default) => item.language === language);
    if (matchingDefault) {
        setSelectedPath(matchingDefault.path);
    }
  }, [language])

  useEffect(() => {
    $('#output').animate({ scrollTop: $('#output').prop('scrollHeight') }, 1000);
  }, [outputDetails])

  return (
    <div id="output" className="h-full w-full overflow-auto bg-secondary-foreground" ref={outputRef}>
      <div className="p-4">
        <p className="text-xs font-mono whitespace-pre">
          {ascii}
        </p>
      </div>
      <br/>
      
      <span>
      <div className="mb-4 text-sm">Code Samurai Dojo Compiler v0.1.0-beta, Last connected... <div dangerouslySetInnerHTML={{ __html: new Date().toLocaleString() }}/></div>
      </span>
      {outputHistory.map((output, index) => (
        <div key={index} className="mb-2 text-sm">{output}</div>
      ))}
      {/* <div className="flex items-center text-sm">
        <b>
        <span className="text-[#24FC7C] flex-shrink-0 whitespace-nowrap"><span className="text-[#4CE087] flex-shrink-0 whitespace-nowrap">guest</span>@csDojo:</span>
        </b>
        <span className="mx-1 text-[#24a5fc]">$</span>
        <input className="flex border-none py-1 bg-transparent w-full focus:outline-none" value={""} onChange={(e) => {e}} />
      </div> */}
    </div>
  );
};
