"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, X } from "lucide-react"
import { ProjectTemplates } from "@/components/project-templates"
import { useActionState } from "react" // useActionState import edildi
import { createProject } from "@/app/projects/actions" // Server Action import edildi
import { toast } from "sonner" // sonner'dan toast import edildi

export default function NewProject() {
  const router = useRouter()
  const [state, formAction] = useActionState(createProject, { success: false, message: "" }) // useActionState kullanımı

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    difficulty: "",
    languages: "",
    liveUrl: "",
    githubUrl: "",
    features: "",
    priority: "",
    budget: "",
    deadline: "",
  })

  useEffect(() => {
    if (state.success) {
      toast.success(state.message)
      router.push("/projects")
    } else if (state.message) {
      toast.error(state.message)
    }
  }, [state, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-background border-b border-border px-4 md:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/projects">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Geri
              </Link>
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-foreground">Yeni Proje Oluştur</h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Yeni bir proje oluşturmak için bilgileri doldurun
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ProjectTemplates />
            <Button variant="outline" className="flex-1 sm:flex-none bg-transparent" asChild>
              <Link href="/projects">
                <X className="w-4 h-4 mr-2" />
                İptal
              </Link>
            </Button>
            <Button
              type="submit"
              form="project-form"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex-1 sm:flex-none"
            >
              <Save className="w-4 h-4 mr-2" />
              Kaydet
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <form id="project-form" action={formAction} className="space-y-6">
            {" "}
            {/* formAction buraya eklendi */}
            {/* Temel Bilgiler */}
            <Card>
              <CardHeader>
                <CardTitle>Temel Bilgiler</CardTitle>
                <CardDescription>Projenizin temel bilgilerini girin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Proje Adı *</Label>
                    <Input
                      id="name"
                      name="name" // name prop'u eklendi
                      placeholder="Proje adını girin"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Kategori *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Web Geliştirme">Web Geliştirme</SelectItem>
                        <SelectItem value="Mobil Uygulama">Mobil Uygulama</SelectItem>
                        <SelectItem value="Yapay Zeka">Yapay Zeka</SelectItem>
                        <SelectItem value="Desktop Uygulama">Desktop Uygulama</SelectItem>
                        <SelectItem value="DevOps">DevOps</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" name="category" value={formData.category} /> {/* Hidden input eklendi */}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Açıklama *</Label>
                  <Textarea
                    id="description"
                    name="description" // name prop'u eklendi
                    placeholder="Proje açıklamasını girin"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="difficulty">Zorluk Düzeyi *</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => handleInputChange("difficulty", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Zorluk seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kolay">Kolay</SelectItem>
                        <SelectItem value="Orta">Orta</SelectItem>
                        <SelectItem value="Zor">Zor</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" name="difficulty" value={formData.difficulty} /> {/* Hidden input eklendi */}
                  </div>
                  <div>
                    <Label htmlFor="priority">Öncelik *</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Öncelik seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Düşük">Düşük</SelectItem>
                        <SelectItem value="Orta">Orta</SelectItem>
                        <SelectItem value="Yüksek">Yüksek</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" name="priority" value={formData.priority} /> {/* Hidden input eklendi */}
                  </div>
                  <div>
                    <Label htmlFor="budget">Bütçe (₺)</Label>
                    <Input
                      id="budget"
                      name="budget" // name prop'u eklendi
                      type="number"
                      placeholder="0"
                      value={formData.budget}
                      onChange={(e) => handleInputChange("budget", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="deadline">Bitiş Tarihi</Label>
                  <Input
                    id="deadline"
                    name="deadline" // name prop'u eklendi
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange("deadline", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
            {/* Teknik Detaylar */}
            <Card>
              <CardHeader>
                <CardTitle>Teknik Detaylar</CardTitle>
                <CardDescription>Projenizin teknik özelliklerini belirtin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="languages">Programlama Dilleri/Teknolojiler</Label>
                  <Input
                    id="languages"
                    name="languages" // name prop'u eklendi
                    placeholder="JavaScript, React, Node.js, PostgreSQL (virgülle ayırın)"
                    value={formData.languages}
                    onChange={(e) => handleInputChange("languages", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="features">Özellikler</Label>
                  <Textarea
                    id="features"
                    name="features" // name prop'u eklendi
                    placeholder="Proje özelliklerini virgülle ayırarak yazın"
                    value={formData.features}
                    onChange={(e) => handleInputChange("features", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="liveUrl">Canlı Demo URL</Label>
                    <Input
                      id="liveUrl"
                      name="liveUrl" // name prop'u eklendi
                      type="url"
                      placeholder="https://example.com"
                      value={formData.liveUrl}
                      onChange={(e) => handleInputChange("liveUrl", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="githubUrl">GitHub URL</Label>
                    <Input
                      id="githubUrl"
                      name="githubUrl" // name prop'u eklendi
                      type="url"
                      placeholder="https://github.com/username/repo"
                      value={formData.githubUrl}
                      onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
