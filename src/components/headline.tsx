"use client"

import React, { useEffect, useState } from 'react';
import { Button } from "./ui/button"
import { Bot, Zap, HelpCircle, BookMarked, CalendarClock, MoveUpRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function Headline() {
    const [displayedWords, setDisplayedWords] = useState<string[]>([])
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [blinkRectangle, setBlinkRectangle] = useState(true);
    const [hideRectangle, setHideRectangle] = useState(true);
    const [titles, setTitles] = useState<string[]>(["Technical", "Behavioral", "Job"]);

    const textContent = "Human-like ML-powered coding interviews";
    const words = textContent.split(' ');

    function scrollToElement() {
        const element = document.getElementById("playground");
      
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 75,
            behavior: "smooth",
          });
        }
     }

    useEffect(() => {
        const typingInterval = setInterval(() => {
            if (currentWordIndex < words.length) {
                setDisplayedWords(prevWords => [...prevWords, words[currentWordIndex]]);
                setCurrentWordIndex(prevIndex => prevIndex + 1);
            } else {
                clearInterval(typingInterval)
                setTimeout(() => {
                    setHideRectangle(false)
                }, 2000)
            }
        }, 200);

        return () => {
            clearInterval(typingInterval);
        };
    }, [currentWordIndex]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setBlinkRectangle(prevBlinkRectangle => !prevBlinkRectangle);
        }, 500);
    
        return () => {
          clearInterval(intervalId); 
        };
      }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if(titles.length === 1) return setTitles(["Technical", "Behavioral", "Job"])

            const remainingTitles = titles.slice(1)
            setTitles(remainingTitles)
        }, 3000)

        return () => clearTimeout(timeout)
    }, [titles])

    return (
        <div className='flex justify-center mt-4 mb-10'>
            <div className="w-[400px] flex flex-col gap-4">
                <div className="flex items-center flex-wrap justify-center">
                    {displayedWords.map((word, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && <span className="whitespace-pre text-5xl">&nbsp;</span>} 
                            {word === "ML-powered" ? (
                                <b className="text-[#23F979] text-5xl">{word}</b>
                            ) : (
                                <span className="relative text-5xl">{word}</span>
                            )}
                        </React.Fragment>
                    ))}
                    {hideRectangle && (
                        <div className="w-[8px] h-fit ml-2 mt-2">
                            {blinkRectangle && (
                                <div className="w-[8px] h-[32px] bg-primary animate-blinking"></div>
                            )}
                        </div>
                    )}
                </div>
                <div className="text-border dark:text-[#1B392E] text-2xl text-center text-medium">{titles[0]} Interviews at Scale</div>
                <div className='flex gap-3 justify-center'>
                      <Button variant="secondary">Schedule a demo
                        {/* <BookMarked className="h-5 w-5 ml-1.5"/> */}
                        <CalendarClock className="h-5 w-5 ml-1.5"/>
                      </Button>
                      <Button onClick={scrollToElement} variant="theme">Try it out
                        <MoveUpRight className="h-5 w-5 ml-1.5"/>
                      </Button>
                </div>
            </div>
        </div>
    );
}
