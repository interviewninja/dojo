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
import { useGoogleLogin, GoogleLogin } from '@react-oauth/google'
import { GoogleOAuthProvider } from '@react-oauth/google';

export function UserAuth() {
  const { openAuth, setOpenAuth } = useGlobalContext()
  const divRef = useRef<HTMLDivElement>(null)
  const [currentWidth, setCurrentWidth] = useState<number | null>(null)
  
  const clientId = "695127041980-kojpm5fiu2h1l57u32hitnko17btplg7.apps.googleusercontent.com"

  const googleLogin = {}
  
  // useGoogleLogin({
  //   onSuccess: tokenResponse => console.log(tokenResponse),
  // })

  useEffect(() => {
    const handleResize = () => {
      if (divRef.current) {
        const width: number = divRef.current.offsetWidth
        setCurrentWidth(width)
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    //
  })

  return (
    <GoogleOAuthProvider clientId={clientId}>
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
              {/* <div className="grid grid-cols-2 gap-2"> */}
              <div className="grid grid-cols-1 w-[100%]" ref={divRef}>
                {/* <Button variant="outline">
                  <Icons.gitHub className="mr-2 h-4 w-4" />
                  Github
                </Button> */}
                <Button variant="theme"  onClick={() => ({})}>
                  <Icons.google className="mr-2 h-4 w-4" />
                  Google
                </Button>
                {/* <GoogleLogin
                  width={`${currentWidth}px`}
                  // shape={"rectangular"}
                  theme={"filled_black"}
                  onSuccess={credentialResponse => {
                    console.log(credentialResponse);
                  }}
                  onError={() => {
                    console.log('Login Failed');
                  }}
                /> */}
              </div>
              {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div> */}
            </CardContent>
            {/* <CardFooter>
              <Button className="w-full">Create account</Button>
            </CardFooter> */}
          </Card>
        </div>
      </div>
      </GoogleOAuthProvider>
  )
}
