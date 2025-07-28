"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function KeyboardShortcuts() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + K için arama
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault()
        router.push("/search")
        toast({
          title: "Arama sayfasına yönlendirildi",
          description: "Ctrl+K ile hızlı arama",
          type: "success",
        })
      }

      // Ctrl/Cmd + N için yeni proje
      if ((event.ctrlKey || event.metaKey) && event.key === "n") {
        event.preventDefault()
        router.push("/projects/new")
        toast({
          title: "Yeni proje sayfasına yönlendirildi",
          description: "Ctrl+N ile hızlı proje oluşturma",
          type: "success",
        })
      }

      // Ctrl/Cmd + D için dashboard
      if ((event.ctrlKey || event.metaKey) && event.key === "d") {
        event.preventDefault()
        router.push("/")
        toast({
          title: "Dashboard'a yönlendirildi",
          description: "Ctrl+D ile hızlı erişim",
          type: "success",
        })
      }

      // Ctrl/Cmd + P için projeler
      if ((event.ctrlKey || event.metaKey) && event.key === "p") {
        event.preventDefault()
        router.push("/projects")
        toast({
          title: "Projeler sayfasına yönlendirildi",
          description: "Ctrl+P ile hızlı erişim",
          type: "success",
        })
      }

      // Ctrl/Cmd + T için ekip
      if ((event.ctrlKey || event.metaKey) && event.key === "t") {
        event.preventDefault()
        router.push("/team")
        toast({
          title: "Ekip sayfasına yönlendirildi",
          description: "Ctrl+T ile hızlı erişim",
          type: "success",
        })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router, toast])

  return null
}
