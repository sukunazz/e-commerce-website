"use client"

import PreviewModal from "@/components/preview-modal"
import { useState, useEffect } from "react"

const ModalProvider = () => {
    const [isMounted, setIsMounded] = useState(false)
    useEffect(() => {
        setIsMounded(true)
    }, [])
    if(!isMounted) return null
  return (
    <>
        <PreviewModal />
    </>
  )
}

export default ModalProvider
