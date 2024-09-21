"use client"

import { useState, useRef, useEffect } from "react"
import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useGlobalContext } from "@/contexts/global"
import { signIn } from "next-auth/react"

export function UserAuth() {
  const { openAuth, setOpenAuth } = useGlobalContext()
  const divRef = useRef<HTMLDivElement>(null)

  return (
      <div style={{display: openAuth ? "flex" : "none"}} className="w-[100vw] {openAuth ? flex : hidden} h-[100vh] absolute z-50 bg-black/[.8] items-center justify-center">
        <div className="w-[70%] max-w-md">
          <Card className="bg-background">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">User Authentication</CardTitle>
              <CardDescription>
                Click below to login or create your account
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 w-[100%]" ref={divRef}>
                <Button variant="theme" onClick={() =>  signIn("google")}>
                  <Icons.google className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div> 
  )
}
