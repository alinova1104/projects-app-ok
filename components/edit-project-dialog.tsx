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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Edit, Save } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useActionState } from "react"
import { editProject } from "@/app/projects/actions" // Server Action import edildi
import { toast } from "sonner" // sonner'dan toast import edildi

interface EditProjectDialogProps {
  project: {
    id: string
    name: string
    description: string
    category: string
    status: "Aktif" | "Tamamlandı" | "Beklemede"
    priority: "Yüksek" | "Orta" | "Düşük"
    progress: number
    deadline: string
    budget: number
    languages: string[]
    features: string[]
    documents: string[]
    liveUrl?: string
    githubUrl?: string
  }
}

export function EditProjectDialog({ project }: EditProjectDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction] = useActionState(editProject, null)

  // Form gönderildikten sonra toast göstermek ve dialogu kapatmak için
  useState(() => {
    if (state?.success) {
      toast.success(state.message)
      setIsOpen(false) // Dialogu kapat
    } else if (state?.success === false) {
      toast.error(state.message)
    }
  }, [state])

  const [deadline, setDeadline] = useState<Date | undefined>(project.deadline ? new Date(project.deadline) : undefined)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
          <Edit className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Düzenle</span>
          <span className="sm:hidden">Düzenle</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Proje Düzenle</DialogTitle>
          <DialogDescription>Proje bilgilerini güncelleyin.</DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <input type="hidden" name="id" value={project.id} /> {/* Proje ID'si gizli input olarak eklendi */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Proje Adı
              </Label>
              <Input id="name" name="name" defaultValue={project.name} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Kategori
              </Label>
              <Select name="category" defaultValue={project.category} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Web Geliştirme">Web Geliştirme</SelectItem>
                  <SelectItem value="Mobil Geliştirme">Mobil Geliştirme</SelectItem>
                  <SelectItem value="Veri Bilimi">Veri Bilimci</SelectItem>
                  <SelectItem value="Tasarım">Tasarım</SelectItem>
                  <SelectItem value="Güvenlik">Güvenlik</SelectItem>
                  <SelectItem value="Diğer">Diğer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Açıklama
              </Label>
              <Textarea id="description" name="description" defaultValue={project.description} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Durum
              </Label>
              <Select name="status" defaultValue={project.status} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Durum seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Beklemede">Beklemede</SelectItem>
                  <SelectItem value="Tamamlandı">Tamamlandı</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Öncelik
              </Label>
              <Select name="priority" defaultValue={project.priority} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Öncelik seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yüksek">Yüksek</SelectItem>
                  <SelectItem value="Orta">Orta</SelectItem>
                  <SelectItem value="Düşük">Düşük</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="progress" className="text-right">
                İlerleme (%)
              </Label>
              <Input
                id="progress"
                name="progress"
                type="number"
                min="0"
                max="100"
                defaultValue={project.progress}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budget" className="text-right">
                Bütçe (₺)
              </Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                defaultValue={project.budget}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deadline" className="text-right">
                Deadline
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !deadline && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deadline ? format(deadline, "PPP") : <span>Tarih seçin</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={deadline} onSelect={setDeadline} initialFocus />
                  </PopoverContent>
                </Popover>
                <input type="hidden" name="deadline" value={deadline ? format(deadline, "yyyy-MM-dd") : ""} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="languages" className="text-right">
                Teknolojiler
              </Label>
              <Input
                id="languages"
                name="languages"
                defaultValue={project.languages.join(", ")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="features" className="text-right">
                Özellikler
              </Label>
              <Input id="features" name="features" defaultValue={project.features.join(", ")} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="documents" className="text-right">
                Dökümanlar
              </Label>
              <Input
                id="documents"
                name="documents"
                defaultValue={project.documents.join(", ")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="liveUrl" className="text-right">
                Canlı URL
              </Label>
              <Input id="liveUrl" name="liveUrl" type="url" defaultValue={project.liveUrl} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="githubUrl" className="text-right">
                GitHub URL
              </Label>
              <Input
                id="githubUrl"
                name="githubUrl"
                type="url"
                defaultValue={project.githubUrl}
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
