"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { PopoverProps } from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"
import { Button } from "../../ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../../ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../ui/popover"

import { File } from "../data/files"
import { defaults, Default } from "../data/defaults"
import { useGlobalContext } from "@/contexts/global"
import { dev } from "@/dev"

interface FileSelectorProps extends PopoverProps {
  files: File[]
}

export function FileSelector({ files, ...props }: FileSelectorProps) {
  const { language, setLanguage } = useGlobalContext()
  const [open, setOpen] = React.useState(false)
  const [defaultPath, setDefaultPath] = React.useState(defaults[0].path)
  const [selectedPath, setSelectedPath] = React.useState("")
  const router = useRouter()

  useEffect(() => {
    const matchingDefault = defaults.find((item: Default) => item.language === language);
    if (matchingDefault) {
        console.log(matchingDefault.path)
        setSelectedPath(matchingDefault.path);
    }
  }, [language])

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label={defaultPath}
          aria-expanded={open}
          className="flex-1 justify-between md:max-w-[200px] lg:max-w-[300px]"
        >
          {selectedPath ? selectedPath : defaultPath}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search files..." />
          <CommandEmpty>No files found.</CommandEmpty>
          <CommandGroup heading="Files">
            {/* {files.map((file) => (
              <CommandItem
                key={file.id}
                onSelect={() => {
                  setSelectedPath(file)
                  setOpen(false)
                }}
              >
                {file.name}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedPath?.id === file.id
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </CommandItem>
            ))} */}
              <CommandItem
                onSelect={() => {
                  setSelectedPath(selectedPath)
                  setOpen(false)
                }}
              >
                {selectedPath}
              </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
