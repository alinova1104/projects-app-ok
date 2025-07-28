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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AddEventDialog() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "",
    project: "",
  })
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.date || !formData.type) {
      toast({
        title: "Eksik bilgi",
        description: "Lütfen tüm zorunlu alanları doldurun",
        type: "error",
      })
      return
    }

    setTimeout(() => {
      toast({
        title: "Etkinlik eklendi",
        description: `${formData.title} etkinliği takvime eklendi`,
        type: "success",
      })

      setFormData({ title: "", description: "", date: "", time: "", type: "", project: "" })
      setOpen(false)
    }, 1000)
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Etkinlik Ekle</span>
          <span className="sm:hidden">Ekle</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Yeni Etkinlik Ekle
          </DialogTitle>
          <DialogDescription>Takvime yeni bir etkinlik ekleyin</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Etkinlik Başlığı *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Örn: Sprint Planlama Toplantısı"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Etkinlik detayları..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Tarih *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField("date", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Saat</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => updateField("time", e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Etkinlik Türü *</Label>
              <Select value={formData.type} onValueChange={(value) => updateField("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tür seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Toplantı</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="milestone">Kilometre Taşı</SelectItem>
                  <SelectItem value="review">İnceleme</SelectItem>
                  <SelectItem value="presentation">Sunum</SelectItem>
                  <SelectItem value="training">Eğitim</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project">İlgili Proje</Label>
              <Select value={formData.project} onValueChange={(value) => updateField("project", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Proje seçin (opsiyonel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ecommerce">E-Ticaret Platformu</SelectItem>
                  <SelectItem value="fitness">Mobil Fitness Uygulaması</SelectItem>
                  <SelectItem value="chatbot">AI Chatbot Sistemi</SelectItem>
                  <SelectItem value="crm">CRM Sistemi</SelectItem>
                  <SelectItem value="blog">Blog Platformu</SelectItem>
                </SelectContent>
              </Select>
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
              Etkinlik Ekle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
