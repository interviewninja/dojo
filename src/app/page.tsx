import React, { useEffect, useState } from 'react';
import { Metadata } from "next"
import ReactGA from 'react-ga4';
import Script from 'next/script'
import { ComboBox } from "../components/combo-box"
import { Header } from "../components/header"
import { Footer } from "../components/footer"
import { AlertMessage } from "../components/alert-messages"
import { UserAuth } from "../components/user-auth"
import { DojoCompiler } from "../components/dojo/dojo-compiler"
import { Headline } from "@/components/headline"
import { BentoBox } from '@/components/bentobox';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Terminal, Waves } from "lucide-react"

export const metadata: Metadata = {
  title: "Interview Ninja", 
  description: "Human-like ML-powered coding interviews.",
}

export default function Interface() {
  return (
    <>
      <Script
        strategy="afterInteractive"
        id="gtag-script"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_CODE}`}
      />
      <Script
        strategy="afterInteractive"
        id="gtag-script"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.GOOGLE_ANALYTICS_CODE}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <header className='supports-backdrop-blur:bg-background/10 sticky top-0 z-50 w-full border-b backdrop-blur-sm bg-primary-foreground/95 relative'>
        <UserAuth/>
        <Header/>
        <div className='flex h-14 w-full bg-primary-opacity absolute top-0 left-0 z-[-1]'></div>
      </header>
      <div>
        <div className='flex justify-center w-screen my-10'>
          {/* max-w-screen-xl */}
          <div className="w-5/6 ">
            <Headline/>
            <BentoBox/>
            <DojoCompiler/>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  )
}
