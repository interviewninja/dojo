"use client"

import React from 'react';
import { Separator } from "../../ui/separator"
import { Label } from "../../ui/label"
import { HelpCircle } from 'lucide-react';

export const Task = () => {
  const result = [];
  return (
    <div className="relative w-full rounded-lg border [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground">
      <div className="flex p-3 flex-row items-center space-x-1.5">
        <HelpCircle className="w-4 h-4"/>
        {/* <div>Task</div> */}
        <Label htmlFor="task">Task</Label>
      </div>
      <Separator/>
      <div id="task" className="text-xs m-4">
        {/* <p> */}
          Write a program that iterates over the range of numbers from 1 to 16 and appends each number to an array. However, the program must handle the following special cases:
          <ul className="list-disc pl-6">
            <li>For multiples of 3, the program should return &quot;Fizz&quot; instead of the number.</li>
            <li>For multiples of 5, the program should return &quot;Buzz&quot; instead of the number.</li>
            <li>For multiples of both 3 and 5, the program should return &quot;FizzBuzz&quot; instead of the number.</li>
          </ul>
        {/* </p> */}
      </div>
    </div>
  );
};