"use client"

import { Toast, ToastContainer } from "./toast"
import { useToast } from "@/hooks/use-toast"

export function ToastContainerComponent() {
  const { toasts, dismiss } = useToast()

  return (
    <ToastContainer>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={dismiss} />
      ))}
    </ToastContainer>
  )
}
