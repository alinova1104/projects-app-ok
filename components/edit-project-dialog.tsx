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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit } from "lucide-react"
import { toast } from "sonner"
import { useActionState } from "react"
import { updateProject } from "@/app/projects/[id]/actions"
import { useRouter } from "next/navigation"

interface EditProjectDialogProps {
  project: any
}

export function EditProjectDialog({ project }: EditProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [state, formAction] = useActionState(updateProject, { success: false, message: "" })

  const [formData, setFormData] = useState({
    id: project.id, // Proje ID'si eklendi
    name: project.name,
    description: project.description,
    category: project.category,
    difficulty: project.difficulty,
    priority: project.priority,
    status: project.status,
    progress: project.progress.toString(),
    budget: project.budget.toString(),
    deadline: project.deadline,
  })

  useEffect(() => {
    if (state.success) {
      toast.success(state.message)
      setOpen(false)
      router.refresh() // Veriyi yeniden çekmek için
    } else if (state.message) {
      toast.error(state.message)
    }
  }, [state, router])

  const updateField = (field: string, value: any) => {
    // value tipi any olarak güncellendi
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
          <Edit className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Düzenle</span>
          <span className="sm:hidden">Düzenle</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Proje Düzenle
          </DialogTitle>
          <DialogDescription>Proje bilgilerini güncelleyin</DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          {" "}
          {/* formAction buraya eklendi */}
          <input type="hidden" name="id" value={formData.id} /> {/* Hidden input ile ID gönderildi */}
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Proje Adı</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Kategori</Label>
                <Select value={formData.category} onValueChange={(value) => updateField("category", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web Geliştirme">Web Geliştirme</SelectItem>
                    <SelectItem value="Mobil Uygulama">Mobil Uygulama</SelectItem>
                    <SelectItem value="Yapay Zeka">Yapay Zeka</SelectItem>
                    <SelectItem value="Desktop Uygulama">Desktop Uygulama</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" name="category" value={formData.category} /> {/* Hidden input eklendi */}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="difficulty">Zorluk</Label>
                <Select value={formData.difficulty} onValueChange={(value) => updateField("difficulty", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kolay">Kolay</SelectItem>
                    <SelectItem value="Orta">Orta</SelectItem>
                    <SelectItem value="Zor">Zor</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" name="difficulty" value={formData.difficulty} /> {/* Hidden input eklendi */}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Öncelik</Label>
                <Select value={formData.priority} onValueChange={(value) => updateField("priority", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Düşük">Düşük</SelectItem>
                    <SelectItem value="Orta">Orta</SelectItem>
                    <SelectItem value="Yüksek">Yüksek</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" name="priority" value={formData.priority} /> {/* Hidden input eklendi */}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Durum</Label>
                <Select value={formData.status} onValueChange={(value) => updateField("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aktif">Aktif</SelectItem>
                    <SelectItem value="Beklemede">Beklemede</SelectItem>
                    <SelectItem value="Tamamlandı">Tamamlandı</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" name="status" value={formData.status} /> {/* Hidden input eklendi */}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="progress">İlerleme (%)</Label>
                <Input
                  id="progress"
                  name="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => updateField("progress", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="budget">Bütçe (₺)</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => updateField("budget", e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deadline">Bitiş Tarihi</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => updateField("deadline", e.target.value)}
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
              Güncelle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
