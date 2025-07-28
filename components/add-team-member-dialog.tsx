"use client"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Save } from "lucide-react"
import { useActionState } from "react"
import { addTeamMember } from "@/app/team/actions" // Server Action import edildi
import { toast } from "sonner" // sonner'dan toast import edildi

export function AddTeamMemberDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction] = useActionState(addTeamMember, null)

  // Form gönderildikten sonra toast göstermek ve dialogu kapatmak için
  useState(() => {
    if (state?.success) {
      toast.success(state.message)
      setIsOpen(false) // Dialogu kapat
    } else if (state?.success === false) {
      toast.error(state.message)
    }
  }, [state])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Ekip Üyesi Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Ekip Üyesi Ekle</DialogTitle>
          <DialogDescription>Ekibinize yeni bir üye eklemek için bilgileri doldurun.</DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Ad Soyad
              </Label>
              <Input id="name" name="name" placeholder="John Doe" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                E-posta
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Telefon
              </Label>
              <Input id="phone" name="phone" placeholder="+90 5xx xxx xx xx" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Rol
              </Label>
              <Select name="role" required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Rol seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Proje Yöneticisi">Proje Yöneticisi</SelectItem>
                  <SelectItem value="Full-stack Geliştirici">Full-stack Geliştirici</SelectItem>
                  <SelectItem value="Front-end Geliştirici">Front-end Geliştirici</SelectItem>
                  <SelectItem value="Back-end Geliştirici">Back-end Geliştirici</SelectItem>
                  <SelectItem value="UI/UX Tasarımcı">UI/UX Tasarımcı</SelectItem>
                  <SelectItem value="Veri Bilimci">Veri Bilimci</SelectItem>
                  <SelectItem value="Siber Güvenlik Uzmanı">Siber Güvenlik Uzmanı</SelectItem>
                  <SelectItem value="DevOps Mühendisi">DevOps Mühendisi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skills" className="text-right">
                Yetenekler
              </Label>
              <Input
                id="skills"
                name="skills"
                placeholder="React, Node.js, Figma (virgülle ayırın)"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Kaydet
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
