"use client"

import * as React from "react"
import { SliderProps } from "@radix-ui/react-slider"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../ui/hover-card"
import { Label } from "../../ui/label"
import { Slider } from "../../ui/slider"
import { Lock } from 'lucide-react';
import { useGlobalContext } from "@/contexts/global"

interface DifficultyProps {
  defaultValue: SliderProps['defaultValue'];
}

export function DifficultySlider({
  defaultValue,
}: DifficultyProps) {
  const { setOpenAuth } = useGlobalContext();
  const [value, setValue] = React.useState<SliderProps['defaultValue']>(defaultValue);

  const valueChanged = (newValue: SliderProps['defaultValue']) => {
    setValue(newValue);
    setOpenAuth(true);
  }
  return (
    <div className="grid gap-2 pt-2">
      {/* <HoverCard openDelay={200}> */}
        {/* <HoverCardTrigger asChild> */}
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Lock className="w-3.5 h-3.5"/>
              {/* <svg width="13" height="13" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 4.63601C5 3.76031 5.24219 3.1054 5.64323 2.67357C6.03934 2.24705 6.64582 1.9783 7.5014 1.9783C8.35745 1.9783 8.96306 2.24652 9.35823 2.67208C9.75838 3.10299 10 3.75708 10 4.63325V5.99999H5V4.63601ZM4 5.99999V4.63601C4 3.58148 4.29339 2.65754 4.91049 1.99307C5.53252 1.32329 6.42675 0.978302 7.5014 0.978302C8.57583 0.978302 9.46952 1.32233 10.091 1.99162C10.7076 2.65557 11 3.57896 11 4.63325V5.99999H12C12.5523 5.99999 13 6.44771 13 6.99999V13C13 13.5523 12.5523 14 12 14H3C2.44772 14 2 13.5523 2 13V6.99999C2 6.44771 2.44772 5.99999 3 5.99999H4ZM3 6.99999H12V13H3V6.99999Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg> */}
            </div>
            <Slider
              id="difficulty"
              max={1}
              defaultValue={value}
              step={.1}
              onValueChange={valueChanged}
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              aria-label="Difficulty"
            />
          </div>
        {/* </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="left"
        >
          Controls randomness: lowering results in less random completions. As
          the temperature approaches zero, the model will become deterministic
          and repetitive.
        </HoverCardContent>
      </HoverCard> */}
    </div>
  )
}
