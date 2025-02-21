"use client"

import { useStoreModal } from "@/hooks/use-store-modal";

import { useEffect } from "react";

const SetupPage = ()=>{
  const onOpen = useStoreModal((state)=>state.onOpen)
  const isOpen = useStoreModal((state)=>state.isOpen)

  useEffect(()=>{
    if(!isOpen)
    {
      onOpen()
    }
  },[onOpen, isOpen])
  return null
}

export default SetupPage