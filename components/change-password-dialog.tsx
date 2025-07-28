"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ChangePasswordDialog() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast({
        title: "Eksik bilgi",
        description: "Lütfen tüm alanları doldurun",
        type: "error",
      })
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Şifreler eşleşmiyor",
        description: "Yeni şifre ve onay şifresi aynı olmalıdır",
        type: "error",
      })
      return
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Şifre çok kısa",
        description: "Şifre en az 6 karakter olmalıdır",
        type: "error",
      })
      return
    }

    setTimeout(() => {
      toast({
        title: "Şifre değiştirildi",
        description: "Şifreniz başarıyla güncellendi",
        type: "success",
      })

      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setOpen(false)
    }, 1000)
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent">
          Şifre Değiştir
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Şifre Değiştir
          </DialogTitle>
          <DialogDescription>Güvenliğiniz için güçlü bir şifre seçin</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Mevcut Şifre</Label>
              <Input
                id="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={(e) => updateField("currentPassword", e.target.value)}
                placeholder="Mevcut şifrenizi girin"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">Yeni Şifre</Label>
              <Input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) => updateField("newPassword", e.target.value)}
                placeholder="Yeni şifrenizi girin"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                placeholder="Yeni şifrenizi tekrar girin"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              İptal
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              Şifre Değiştir
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
