"use client"

import { Copy } from 'lucide-react';

import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../ui/popover"

export function Share() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Share</Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[520px]">
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-semibold">Share the link</h3>
          <p className="text-sm text-muted-foreground">
            Impress a friend, developer, or hiring manager with this new tech.
          </p>
        </div>
        <div className="flex items-center space-x-2 pt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue="https://interviewninja.dev"
              readOnly
              className="h-9 bg-primary-foreground"
            />
          </div>
          <Button onClick={() => ({})} type="submit" size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
