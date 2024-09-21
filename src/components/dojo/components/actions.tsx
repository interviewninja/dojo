"use client"

import * as React from "react"
import { Dialog } from "@radix-ui/react-dialog"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { useGlobalContext } from "@/contexts/global"
import { Button } from "../../ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import { Label } from "../../ui/label"
import { Switch } from "../../ui/switch"
import { toast } from "../../ui/use-toast"
import { useSession } from "next-auth/react"

export function Actions() {
  const { setOpenAuth, isRLHFEnabled, setIsRLHFEnabled } = useGlobalContext()
  const [open, setIsOpen] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)

  const { data: session } = useSession()

  const toggleRLHF = () => {
    if(!session?.user) return setOpenAuth(true) 
    setIsRLHFEnabled(!isRLHFEnabled)
    setIsOpen(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <span className="sr-only">Actions</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setIsOpen(true)}>
            Reinforcement learning opt-out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reinforcement learning opt-out</DialogTitle>
            <DialogDescription>
              We will collect the transcripts of your interactions and use it for 
              reinforcement learning with user feedback. <b>No audio or 
              video data will be collected.</b>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h4 className="text-sm text-muted-foreground">
              RLHF opt-out
            </h4>
            <div className="flex items-start justify-between space-x-4 pt-3">
              <Switch name="show" id="show" checked={isRLHFEnabled} onClick={toggleRLHF} />
              <Label className="grid gap-1 font-normal" htmlFor="show">
                <span className="font-semibold">
                  I agree to contribute my &apos;transcript-only&apos; data 
                </span>
                <span className="text-sm text-muted-foreground">
                  Physical audio or video is not classified as &apos;transcript-only&apos; data. All transcripts are generated client-side then sent to
                  our server as text if opted-in.
                </span>
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This preset will no longer be
              accessible by you or others you&apos;ve shared it with.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                setShowDeleteDialog(false)
                toast({
                  description: "This preset has been deleted.",
                })
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </>
  )
}
