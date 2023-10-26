"use client"

import * as React from "react"
import { useEffect } from "react"
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
import { View, ViewType } from "../data/views"

interface ViewSelectorProps extends PopoverProps {
  types: readonly ViewType[]
  views: View[]
}

export function ViewSelector({ views, types, ...props }: ViewSelectorProps) {
  const { viewType, setViewType } = useGlobalContext()
  const [open, setOpen] = React.useState(false)
  const [selectedView, setSelectedView] = React.useState<View>(views[0])
  const [peekedView, setPeekedView] = React.useState<View>(views[0])

  useEffect(() => {
    setSelectedView(views.find(view => view.name.toLowerCase() === viewType) || views[0])
  }, [viewType])

  return (
    <div className="grid gap-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <Label htmlFor="view">View Type</Label>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="left"
        >
          Switch between tutorial and coding interview mode.
        </HoverCardContent>
      </HoverCard>
      <Popover open={open} onOpenChange={setOpen} {...props}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a view type"
            className="w-full justify-between"
          >
            {selectedView ? selectedView.name : "Select a view type..."}
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
                <h4 className="font-medium leading-none">{peekedView.name}</h4>
                <div className="text-sm text-muted-foreground">
                  {peekedView.description}
                </div>
                {peekedView.strengths ? (
                  <div className="mt-4 grid gap-2">
                    <h5 className="text-sm font-medium leading-none">
                      Strengths
                    </h5>
                    <ul className="text-sm text-muted-foreground">
                      {peekedView.strengths}
                    </ul>
                  </div>
                ) : null}
              </div>
            </HoverCardContent>
            <Command loop>
              <CommandList className="h-[var(--cmdk-list-height)] max-h-[400px]">
                <CommandInput placeholder="Search View Types..." />
                <CommandEmpty>No View Types found.</CommandEmpty>
                <HoverCardTrigger />
                {types.map((type) => (
                  <CommandGroup key={type} heading={type}>
                    {views
                      .filter((view) => view.type === type)
                      .map((view) => (
                        <ViewItem
                          key={view.id}
                          view={view}
                          isSelected={selectedView?.id === view.id}
                          onPeek={(view) => setPeekedView(view)}
                          onSelect={() => {
                            setSelectedView(view)
                            setViewType(view.name.toLowerCase())
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

interface ViewItemProps {
  view: View
  isSelected: boolean
  onSelect: () => void
  onPeek: (view: View) => void
}

function ViewItem({ view, isSelected, onSelect, onPeek }: ViewItemProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  useMutationObserver(ref, (mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes") {
        if (mutation.attributeName === "aria-selected") {
          onPeek(view)
        }
      }
    }
  })

  return (
    <CommandItem
      key={view.id}
      onSelect={onSelect}
      ref={ref}
      className="aria-selected:bg-primary aria-selected:text-primary-foreground"
    >
      {view.name}
      <CheckIcon
        className={cn(
          "ml-auto h-4 w-4",
          isSelected ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  )
}
