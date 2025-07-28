"use client"
import { useState, useEffect } from "react"
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
import { Plus, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { useActionState } from "react"
import { addTeamMember } from "@/app/team/actions"
import { useRouter } from "next/navigation"

export function AddTeamMemberDialog() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [state, formAction] = useActionState(addTeamMember, { success: false, message: "" })

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    skills: "",
  })

  useEffect(() => {
    if (state.success) {
      toast.success(state.message)
      setFormData({ name: "", email: "", phone: "", role: "", skills: "" })
      setOpen(false)
      router.refresh() // Veriyi yeniden çekmek için
    } else if (state.message) {
      toast.error(state.message)
    }
  }, [state, router])

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Üye
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Yeni Ekip Üyesi Ekle
          </DialogTitle>
          <DialogDescription>Yeni bir ekip üyesi eklemek için bilgileri doldurun</DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          {" "}
          {/* formAction buraya eklendi */}
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Ad Soyad *</Label>
              <Input
                id="name"
                name="name" // name prop'u eklendi
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Örn: Ahmet Yılmaz"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-posta *</Label>
              <Input
                id="email"
                name="email" // name prop'u eklendi
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="ahmet@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                name="phone" // name prop'u eklendi
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+90 555 123 4567"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Rol *</Label>
              <Select value={formData.role} onValueChange={(value) => updateField("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Rol seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                  <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                  <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
                  <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                  <SelectItem value="Mobile Developer">Mobile Developer</SelectItem>
                  <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                  <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                  <SelectItem value="AI Engineer">AI Engineer</SelectItem>
                  <SelectItem value="Project Manager">Project Manager</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="role" value={formData.role} /> {/* Hidden input eklendi */}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="skills">Yetenekler</Label>
              <Input
                id="skills"
                name="skills" // name prop'u eklendi
                value={formData.skills}
                onChange={(e) => updateField("skills", e.target.value)}
                placeholder="React, TypeScript, Node.js (virgülle ayırın)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              İptal
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Ekip Üyesi Ekle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
