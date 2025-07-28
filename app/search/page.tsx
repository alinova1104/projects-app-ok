"use client"

import { AvatarFallback } from "@/components/ui/avatar"

import { AvatarImage } from "@/components/ui/avatar"

import { Avatar } from "@/components/ui/avatar"

import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, FolderOpen, Users, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"
import { projectApi, teamApi } from "@/api" // api.ts'den import edildi
import { toast } from "sonner"

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [projects, setProjects] = useState<any[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    const [projectsRes, teamMembersRes] = await Promise.all([projectApi.getProjects(), teamApi.getTeamMembers()])

    if (projectsRes.success && projectsRes.data) {
      setProjects(projectsRes.data)
    } else {
      setError(projectsRes.message || "Projeler yüklenirken hata oluştu.")
      toast.error("Hata", { description: projectsRes.message || "Projeler yüklenirken hata oluştu." })
    }

    if (teamMembersRes.success && teamMembersRes.data) {
      setTeamMembers(teamMembersRes.data)
    } else {
      setError(teamMembersRes.message || "Ekip üyeleri yüklenirken hata oluştu.")
      toast.error("Hata", { description: teamMembersRes.message || "Ekip üyeleri yüklenirken hata oluştu." })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredTeamMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent" />
        <p className="mt-4 text-muted-foreground">Veriler yükleniyor...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-red-500">
        <p>{error}</p>
        <Button onClick={fetchData} className="mt-4">
          Tekrar Dene
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-background border-b border-border px-4 md:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Arama</h1>
            <p className="text-sm md:text-base text-muted-foreground">Projeler ve ekip üyeleri arasında arama yapın</p>
          </div>
        </div>
      </header>

      {/* Search Input */}
      <div className="bg-background border-b border-border px-4 md:px-6 py-4">
        <div className="relative max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Arama yap..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Search Results */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        {searchTerm.length > 0 && (
          <div className="space-y-6">
            {/* Proje Sonuçları */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5" />
                  Projeler ({filteredProjects.length})
                </CardTitle>
                <CardDescription>Arama teriminize uyan projeler</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProjects.map((project) => (
                      <Link key={project.id} href={`/projects/${project.id}`} className="block">
                        <Card className="hover:shadow-lg transition-shadow duration-200">
                          <CardHeader>
                            <CardTitle className="text-lg">{project.name}</CardTitle>
                            <CardDescription>{project.category}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                              <Calendar className="w-3 h-3" />
                              <span>Deadline: {new Date(project.deadline).toLocaleDateString("tr-TR")}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <DollarSign className="w-3 h-3" />
                              <span>Bütçe: ₺{project.budget.toLocaleString()}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Proje bulunamadı.</p>
                )}
              </CardContent>
            </Card>

            {/* Ekip Üyesi Sonuçları */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Ekip Üyeleri ({filteredTeamMembers.length})
                </CardTitle>
                <CardDescription>Arama teriminize uyan ekip üyeleri</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredTeamMembers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTeamMembers.map((member) => (
                      <Card
                        key={member.id}
                        className="flex items-center p-4 hover:shadow-lg transition-shadow duration-200"
                      >
                        <Avatar className="w-12 h-12 mr-4">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Ekip üyesi bulunamadı.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {searchTerm.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Arama yapın</h3>
            <p className="text-gray-500 mb-4">
              Projeleriniz ve ekip üyeleriniz arasında arama yapmak için yukarıdaki kutuyu kullanın.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
