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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LayoutTemplateIcon as Template, Code, Smartphone, Brain, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const templates = [
  {
    id: "web-app",
    name: "Web Uygulaması",
    description: "Modern web uygulaması geliştirme şablonu",
    icon: Globe,
    category: "Web Geliştirme",
    difficulty: "Orta",
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    features: ["Kullanıcı Yönetimi", "API Entegrasyonu", "Responsive Tasarım", "SEO Optimizasyonu"],
  },
  {
    id: "mobile-app",
    name: "Mobil Uygulama",
    description: "Cross-platform mobil uygulama şablonu",
    icon: Smartphone,
    category: "Mobil Uygulama",
    difficulty: "Zor",
    technologies: ["React Native", "TypeScript", "Firebase"],
    features: ["Push Notifications", "Offline Support", "Biometric Auth", "App Store Ready"],
  },
  {
    id: "ai-project",
    name: "AI/ML Projesi",
    description: "Yapay zeka ve makine öğrenmesi projesi şablonu",
    icon: Brain,
    category: "Yapay Zeka",
    difficulty: "Zor",
    technologies: ["Python", "TensorFlow", "FastAPI", "Docker"],
    features: ["Model Training", "API Endpoints", "Data Processing", "Monitoring"],
  },
  {
    id: "api-service",
    name: "API Servisi",
    description: "RESTful API servisi geliştirme şablonu",
    icon: Code,
    category: "Backend",
    difficulty: "Kolay",
    technologies: ["Node.js", "Express", "MongoDB", "JWT"],
    features: ["Authentication", "Rate Limiting", "Documentation", "Testing"],
  },
]

export function ProjectTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleUseTemplate = (template: any) => {
    toast({
      title: "Şablon kullanılıyor",
      description: `${template.name} şablonu ile yeni proje oluşturuluyor`,
      type: "success",
    })
    router.push(`/projects/new?template=${template.id}`)
    setIsOpen(false)
  }

  const difficultyColors = {
    Kolay:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    Orta: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    Zor: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-transparent">
          <Template className="w-4 h-4 mr-2" />
          Şablondan Oluştur
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Template className="w-5 h-5" />
            Proje Şablonları
          </DialogTitle>
          <DialogDescription>Hazır şablonlardan birini seçerek hızlıca proje oluşturun</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {templates.map((template) => {
            const Icon = template.icon
            return (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedTemplate?.id === template.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription className="text-sm">{template.category}</CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={difficultyColors[template.difficulty as keyof typeof difficultyColors]}
                    >
                      {template.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Teknolojiler</h4>
                      <div className="flex flex-wrap gap-1">
                        {template.technologies.map((tech, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Özellikler</h4>
                      <div className="space-y-1">
                        {template.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-1 h-1 bg-primary rounded-full"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                        {template.features.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{template.features.length - 3} daha fazla özellik
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            İptal
          </Button>
          <Button
            onClick={() => selectedTemplate && handleUseTemplate(selectedTemplate)}
            disabled={!selectedTemplate}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Şablonu Kullan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
