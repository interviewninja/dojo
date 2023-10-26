"use client"

import { useToast } from "@/components/ui/use-toast";

export function AlertMessage() {
  const { toast } = useToast();
  toast({
    title: "GA Action",
    description: "We appreciate your interest, this feature will be available soon!",
  });
}