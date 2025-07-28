"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, Plus } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useActionState } from "react"
import { addProject } from "@/app/projects/actions" // Server Action import edildi
import { toast } from "sonner" // sonner'dan toast import edildi
import { useRouter } from "next/navigation" // useRouter import edildi

export default function NewProjectPage() {
  const router = useRouter()
  const [state, formAction] = useActionState(addProject, null)

  // Form gönderildikten sonra toast göstermek ve yönlendirmek için useEffect kullanın
  useState(() => {
    if (state?.success) {
      toast.success(state.message)
      router.push("/projects") // Projeler sayfasına yönlendir
    } else if (state?.success === false) {
      toast.error(state.message)
    }
  }, [state, router])

  const [deadline, setDeadline] = useState<Date | undefined>(undefined)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-background border-b border-border px-4 md:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Yeni Proje Oluştur</h1>
            <p className="text-sm md:text-base text-muted-foreground">Yeni bir proje ekleyin ve detaylarını girin</p>
          </div>
          <Button
            type="submit" // Formun submit butonu olarak ayarlandı
            form="new-project-form" // Form ID'si ile eşleştirildi
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Proje Oluştur
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <form id="new-project-form" action={formAction} className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Proje Bilgileri</CardTitle>
              <CardDescription>Projenin temel bilgilerini girin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Proje Adı</Label>
                  <Input id="name" name="name" placeholder="Proje adı" required />
                </div>
                <div>
                  <Label htmlFor="category">Kategori</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Web Geliştirme">Web Geliştirme</SelectItem>
                      <SelectItem value="Mobil Geliştirme">Mobil Geliştirme</SelectItem>
                      <SelectItem value="Veri Bilimi">Veri Bilimi</SelectItem>
                      <SelectItem value="Tasarım">Tasarım</SelectItem>
                      <SelectItem value="Güvenlik">Güvenlik</SelectItem>
                      <SelectItem value="Diğer">Diğer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Açıklama</Label>
                <Textarea id="description" name="description" placeholder="Proje açıklaması" rows={4} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Durum</Label>
                  <Select name="status" defaultValue="Aktif" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Durum seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aktif">Aktif</SelectItem>
                      <SelectItem value="Beklemede">Beklemede</SelectItem>
                      <SelectItem value="Tamamlandı">Tamamlandı</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Öncelik</Label>
                  <Select name="priority" defaultValue="Orta" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Öncelik seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yüksek">Yüksek</SelectItem>
                      <SelectItem value="Orta">Orta</SelectItem>
                      <SelectItem value="Düşük">Düşük</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Bütçe (₺)</Label>
                  <Input id="budget" name="budget" type="number" placeholder="Bütçe" defaultValue={0} required />
                </div>
                <div>
                  <Label htmlFor="deadline">Deadline</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !deadline && "text-muted-foreground",
                        )}
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
              <div>
                <Label htmlFor="progress">İlerleme (%)</Label>
                <Input id="progress" name="progress" type="number" min="0" max="100" defaultValue={0} required />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ek Bilgiler</CardTitle>
              <CardDescription>Projenin teknoloji, özellik ve doküman bilgilerini girin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="languages">Kullanılan Teknolojiler (virgülle ayırın)</Label>
                <Input id="languages" name="languages" placeholder="React, Node.js, MongoDB" />
              </div>
              <div>
                <Label htmlFor="features">Proje Özellikleri (virgülle ayırın)</Label>
                <Input id="features" name="features" placeholder="Kullanıcı kimlik doğrulama, Ödeme entegrasyonu" />
              </div>
              <div>
                <Label htmlFor="documents">Proje Dökümanları (virgülle ayırın)</Label>
                <Input id="documents" name="documents" placeholder="Proje Planı.pdf, Teknik Şartname.docx" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="liveUrl">Canlı URL</Label>
                  <Input id="liveUrl" name="liveUrl" type="url" placeholder="https://proje.com" />
                </div>
                <div>
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input id="githubUrl" name="githubUrl" type="url" placeholder="https://github.com/kullanici/proje" />
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
