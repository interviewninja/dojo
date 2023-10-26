"use client"
 
import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
 
export function PricingToast() {
  const { toast } = useToast()
 
  return (
    <>
      <a
        className='inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:hover:bg-background dark:hover:text-accent-foreground disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800 bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-background dark:hover:text-accent-foreground data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent rounded-md text-slate-700 dark:text-slate-200 hover:bg-ring hover:text-accent-foreground cursor-pointer h-10 px-3'
        onClick={() => {
          toast({
            title: "GA Action!",
            description: "We appreciate your interest, this feature will be available soon.",
          });
        }}
      >
        Pricing
      </a> 
    </>
  )
}