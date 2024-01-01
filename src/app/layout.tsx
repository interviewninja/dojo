import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { GlobalContextProvider } from "../contexts/global"

const inter = Inter({ subsets: ['latin'] })

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <GlobalContextProvider>
              {children}
            </GlobalContextProvider>
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </>
  )
}
