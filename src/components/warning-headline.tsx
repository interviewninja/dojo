"use client"

import React, { useEffect, useState } from 'react';
import { Terminal, Waves } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function WarningHeadline() {
    const [displayedWords, setDisplayedWords] = useState<string[]>([])
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [blinkRectangle, setBlinkRectangle] = useState(true);
    const [hideRectangle, setHideRectangle] = useState(true);

    const textContent = "This website is still in beta. Reach out to me directly at admin@codesamur.ai if you encounter any bugs, or have any feedback.";
    const words = textContent.split(' ');

    useEffect(() => {
        const typingInterval = setInterval(() => {
            if (currentWordIndex < words.length) {
                setDisplayedWords(prevWords => [...prevWords, words[currentWordIndex]]);
                setCurrentWordIndex(prevIndex => prevIndex + 1);
            } else {
                clearInterval(typingInterval);
                setTimeout(() => {
                    setHideRectangle(false); 
                }, 2000); 
            }
        }, 200);

        return () => {
            clearInterval(typingInterval);
        };
    }, [currentWordIndex]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setBlinkRectangle(prevBlinkRectangle => !prevBlinkRectangle);
        }, 500); // Change the interval duration as needed (in milliseconds)
    
        return () => {
          clearInterval(intervalId); // Clean up the interval on component unmount
        };
      }, []);

    return (
        <div className="w-fit mb-5">
            <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <div className='flex space-x-2 items-center'>
                <AlertDescription>
                    <div className="flex items-center flex-wrap">
                        {displayedWords.map((word, index) => (
                            <React.Fragment key={index}>
                                {index > 0 && <span className="whitespace-pre">&nbsp;</span>} {/* Add space between words */}
                                {word === "admin@codesamur.ai" ? (
                                    <b className="text-[#23F979]">{word}</b>
                                ) : (
                                    <span className="relative">{word}</span>
                                )}
                            </React.Fragment>
                        ))}
                        {hideRectangle && (
                            <div className="w-[3.5px] h-fit ml-2">
                                {blinkRectangle && (
                                    <div className="w-[3.5px] h-[12px] bg-primary animate-blinking"></div>
                                )}
                            </div>
                        )}
                    </div>
                </AlertDescription>
                </div>
            </Alert>
        </div>
    );
}
