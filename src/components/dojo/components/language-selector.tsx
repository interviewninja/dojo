"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { PopoverProps } from "@radix-ui/react-popover"
import { useGlobalContext } from "@/contexts/global"

import { cn } from "@/lib/utils"
import { useMutationObserver } from "../../hooks/use-mutation-observer"
import { Button } from "../../ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../ui/command"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../ui/hover-card"
import { Label } from "../../ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../ui/popover"

import { Language, LanguageType } from "../data/languages"

interface LanguageSelectorProps extends PopoverProps {
  types: readonly LanguageType[]
  languages: Language[]
}

export function LanguageSelector({ languages, types, ...props }: LanguageSelectorProps) {
  const { language, setLanguage } = useGlobalContext()
  const [open, setOpen] = React.useState(false)
  const [selectedLanguage, setSelectedLanguage] = React.useState<Language>(languages[0])
  const [peekedLanguage, setPeekedLanguage] = React.useState<Language>(languages[0])

  return (
    <div className="grid gap-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <Label htmlFor="language">Language</Label>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="left"
        >
        Choose the language you want to compile.
        </HoverCardContent>
      </HoverCard>
      <Popover open={open} onOpenChange={setOpen} {...props}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a language"
            className="w-full justify-between"
          >
            {selectedLanguage ? selectedLanguage.name : "Select a language..."}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[250px] p-0">
          <HoverCard>
            <HoverCardContent
              side="left"
              align="start"
              forceMount
              className="min-h-[280px]"
            >
              <div className="grid gap-2">
                <h4 className="font-medium leading-none">{peekedLanguage.name}</h4>
                <div className="text-sm text-muted-foreground">
                  {peekedLanguage.description}
                </div>
                {/* {peekedLanguage.strengths ? (
                  <div className="mt-4 grid gap-2">
                    <h5 className="text-sm font-medium leading-none">
                      Strengths
                    </h5>
                    <ul className="text-sm text-muted-foreground">
                      {peekedLanguage.strengths}
                    </ul>
                  </div>
                ) : null} */}
              </div>
            </HoverCardContent>
            <Command loop>
              <CommandList className="h-[var(--cmdk-list-height)] max-h-[400px]">
                <CommandInput placeholder="Search Languages..." />
                <CommandEmpty>No Languages found.</CommandEmpty>
                <HoverCardTrigger />
                {types.map((type) => (
                  <CommandGroup key={type} heading={type}>
                    {languages
                      .filter((language) => language.type === type)
                      .map((language) => (
                        <LanguageItem
                          key={language.id}
                          language={language}
                          isSelected={selectedLanguage?.id === language.id}
                          onPeek={(language) => setPeekedLanguage(language)}
                          onSelect={() => {
                            setSelectedLanguage(language)
                            setLanguage(language.name.toLowerCase())
                            setOpen(false)
                          }}
                        />
                      ))}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </HoverCard>
        </PopoverContent>
      </Popover>
    </div>
  )
}

interface LanguageItemProps {
  language: Language
  isSelected: boolean
  onSelect: () => void
  onPeek: (language: Language) => void
}

function LanguageItem({ language, isSelected, onSelect, onPeek }: LanguageItemProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  useMutationObserver(ref, (mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes") {
        if (mutation.attributeName === "aria-selected") {
          onPeek(language)
        }
      }
    }
  })

  return (
    <CommandItem
      key={language.id}
      onSelect={onSelect}
      ref={ref}
      className="aria-selected:bg-primary aria-selected:text-primary-foreground"
    >
      {language.name}
      <CheckIcon
        className={cn(
          "ml-auto h-4 w-4",
          isSelected ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  )
}
