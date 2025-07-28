"use client"

import { Label } from "@/components/ui/label"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Copy } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ProjectTemplate {
  id: string
  name: string
  description: string
  category: string
  difficulty: string
  languages: string[]
  features: string[]
  priority: string
  budget: number
  deadline: string
  status: string
  progress: number
}

const templates: ProjectTemplate[] = [
  {
    id: "tpl1",
    name: "Web Sitesi Geliştirme",
    description: "Modern ve duyarlı bir web sitesi oluşturma şablonu.",
    category: "Web Geliştirme",
    difficulty: "Orta",
    languages: ["React", "Next.js", "Tailwind CSS"],
    features: ["SEO Optimizasyonu", "İletişim Formu", "Duyarlı Tasarım"],
    priority: "Orta",
    budget: 50000,
    deadline: "2024-12-31",
    status: "Beklemede",
    progress: 0,
  },
  {
    id: "tpl2",
    name: "Mobil Uygulama Projesi",
    description: "iOS ve Android için çapraz platform mobil uygulama şablonu.",
    category: "Mobil Uygulama",
    difficulty: "Zor",
    languages: ["React Native", "Firebase"],
    features: ["Kullanıcı Kimlik Doğrulama", "Bildirimler", "Harita Entegrasyonu"],
    priority: "Yüksek",
    budget: 80000,
    deadline: "2025-03-31",
    status: "Beklemede",
    progress: 0,
  },
  {
    id: "tpl3",
    name: "Veri Analizi Raporu",
    description: "Veri analizi ve görsel raporlama için temel şablon.",
    category: "Yapay Zeka",
    difficulty: "Kolay",
    languages: ["Python", "Pandas", "Matplotlib"],
    features: ["Veri Temizleme", "Temel İstatistikler", "Görsel Raporlama"],
    priority: "Düşük",
    budget: 20000,
    deadline: "2024-10-31",
    status: "Beklemede",
    progress: 0,
  },
]

export function ProjectTemplates() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(undefined)
  const router = useRouter()

  const handleApplyTemplate = () => {
    if (selectedTemplateId) {
      const template = templates.find((t) => t.id === selectedTemplateId)
      if (template) {
        // Normalde burada API'ye yeni proje oluşturma isteği gönderilir
        // Şimdilik, yeni proje oluşturma sayfasına yönlendirip verileri query params ile taşıyabiliriz
        // Veya doğrudan api.ts üzerinden createProject çağrısı yapabiliriz.
        // Basitlik adına, yeni proje sayfasına yönlendirme yapalım ve orada formun doldurulmasını sağlayalım.
        const queryParams = new URLSearchParams({
          name: template.name,
          description: template.description,
          category: template.category,
          difficulty: template.difficulty,
          languages: template.languages.join(", "),
          features: template.features.join(", "),
          priority: template.priority,
          budget: template.budget.toString(),
          deadline: template.deadline,
          status: template.status,
          progress: template.progress.toString(),
        }).toString()

        router.push(`/projects/new?${queryParams}`)
        toast.success("Şablon Uygulandı", {
          description: `"${template.name}" şablonu yeni proje formuna uygulandı.`,
        })
        setIsOpen(false)
      }
    } else {
      toast.error("Hata", { description: "Lütfen bir şablon seçin." })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1 sm:flex-none bg-transparent">
          <Copy className="w-4 h-4 mr-2" />
          Şablonlar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="w-5 h-5" />
            Proje Şablonları
          </DialogTitle>
          <DialogDescription>Hazır şablonlardan birini seçerek yeni proje oluşturun.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="template">Şablon Seç</Label>
            <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
              <SelectTrigger>
                <SelectValue placeholder="Bir şablon seçin" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedTemplateId && (
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Açıklama:</p>
              <p>{templates.find((t) => t.id === selectedTemplateId)?.description}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            İptal
          </Button>
          <Button onClick={handleApplyTemplate} disabled={!selectedTemplateId}>
            <Plus className="w-4 h-4 mr-2" />
            Şablonu Uygula
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
