"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Plus, FolderOpen } from "lucide-react"
import Link from "next/link"
import { DraggableProjectCard } from "@/components/draggable-project-card"
import { DropZone } from "@/components/drop-zone"
import { getDb } from "@/lib/db" // Veriyi sunucuda çekmek için db'den import edildi
import { useState } from "react" // Client component'e dönüştürmek için useState eklendi

export default function ProjectsPage() {
  const { projects } = getDb() // Veri doğrudan sunucuda çekildi
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || project.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || project.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = Array.from(new Set(projects.map((p) => p.category)))
  const statuses = Array.from(new Set(projects.map((p) => p.status)))

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-background border-b border-border px-4 md:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Projeler</h1>
            <p className="text-sm md:text-base text-muted-foreground">Tüm projelerinizi yönetin ve takip edin</p>
          </div>
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto"
            asChild
          >
            <Link href="/projects/new">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Proje
            </Link>
          </Button>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-background border-b border-border px-4 md:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Proje ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        {filteredProjects.length > 0 ? (
          <DropZone status="all" className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {filteredProjects.map((project) => (
              <DraggableProjectCard key={project.id} project={project} />
            ))}
          </DropZone>
        ) : (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Proje bulunamadı</h3>
            <p className="text-gray-500 mb-4">Arama kriterlerinize uygun proje bulunmuyor.</p>
            <Button asChild>
              <Link href="/projects/new">Yeni Proje Oluştur</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
