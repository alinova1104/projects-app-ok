"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, FolderOpen, Users, FileText, ExternalLink, Github, Calendar, Target } from "lucide-react"
import Link from "next/link"
import projectsData from "@/data/projects.json"

export default function SearchPage() {
  const { projects, teamMembers } = projectsData
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")

  // Arama fonksiyonu
  const searchResults = {
    projects: projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.languages.some((lang) => lang.toLowerCase().includes(searchTerm.toLowerCase())) ||
        project.features.some((feature) => feature.toLowerCase().includes(searchTerm.toLowerCase())),
    ),
    members: teamMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
    ),
    documents: projects.flatMap((project) =>
      project.documents
        .filter((doc) => doc.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((doc) => ({ ...project, document: doc })),
    ),
  }

  const totalResults = searchResults.projects.length + searchResults.members.length + searchResults.documents.length

  const difficultyColors = {
    Kolay:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    Orta: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    Zor: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  }

  const statusColors = {
    Aktif: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    Tamamlandı:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    Beklemede: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800",
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-background border-b border-border px-4 md:px-6 py-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Arama</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Projeler, ekip üyeleri ve dökümanlar arasında arama yapın
          </p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-background border-b border-border px-4 md:px-6 py-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Projeler, ekip üyeleri, dökümanlar arasında ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="projects">Projeler</SelectItem>
                <SelectItem value="members">Ekip Üyeleri</SelectItem>
                <SelectItem value="documents">Dökümanlar</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">İlgililik</SelectItem>
                <SelectItem value="date">Tarih</SelectItem>
                <SelectItem value="name">İsim</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        {searchTerm ? (
          <div className="space-y-6">
            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">{totalResults}</span> sonuç bulundu
              </p>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Tümü ({totalResults})</TabsTrigger>
                <TabsTrigger value="projects">Projeler ({searchResults.projects.length})</TabsTrigger>
                <TabsTrigger value="members">Ekip ({searchResults.members.length})</TabsTrigger>
                <TabsTrigger value="documents">Dökümanlar ({searchResults.documents.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                {/* Projects */}
                {searchResults.projects.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FolderOpen className="w-5 h-5" />
                      Projeler
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {searchResults.projects.slice(0, 4).map((project) => (
                        <Card key={project.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-base font-semibold truncate">
                                  <Link
                                    href={`/projects/${project.id}`}
                                    className="hover:text-primary transition-colors"
                                  >
                                    {project.name}
                                  </Link>
                                </CardTitle>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <Badge variant="outline" className={difficultyColors[project.difficulty]}>
                                    {project.difficulty}
                                  </Badge>
                                  <Badge variant="outline" className={statusColors[project.status]}>
                                    {project.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{project.category}</span>
                              <span>{project.progress}% tamamlandı</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Team Members */}
                {searchResults.members.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Ekip Üyeleri
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.members.slice(0, 6).map((member) => (
                        <Card key={member.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={member.avatar || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {member.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{member.name}</p>
                                <p className="text-sm text-muted-foreground">{member.role}</p>
                                <p className="text-xs text-muted-foreground">{member.projectCount} proje</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {searchResults.documents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Dökümanlar
                    </h3>
                    <div className="space-y-2">
                      {searchResults.documents.slice(0, 5).map((item, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-muted-foreground" />
                              <div className="flex-1">
                                <p className="font-medium">{item.document}</p>
                                <p className="text-sm text-muted-foreground">{item.name} projesinden</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="projects">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {searchResults.projects.map((project) => (
                    <Card key={project.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base font-semibold truncate">
                              <Link href={`/projects/${project.id}`} className="hover:text-primary transition-colors">
                                {project.name}
                              </Link>
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <Badge variant="outline" className={difficultyColors[project.difficulty]}>
                                {project.difficulty}
                              </Badge>
                              <Badge variant="outline" className={statusColors[project.status]}>
                                {project.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {project.liveUrl && (
                              <Button variant="ghost" size="sm" asChild>
                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </Button>
                            )}
                            {project.githubUrl && (
                              <Button variant="ghost" size="sm" asChild>
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                  <Github className="w-3 h-3" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <span>{project.category}</span>
                          <span>{project.progress}% tamamlandı</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(project.createdAt).toLocaleDateString("tr-TR")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {new Date(project.deadline).toLocaleDateString("tr-TR")}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="members">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.members.map((member) => (
                    <Card key={member.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-lg">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{member.name}</p>
                            <p className="text-sm text-primary">{member.role}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FolderOpen className="w-4 h-4" />
                            <span>{member.projectCount} proje</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Katılım: {new Date(member.joinDate).toLocaleDateString("tr-TR")}</span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1">
                            {member.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {member.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{member.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="documents">
                <div className="space-y-2">
                  {searchResults.documents.map((item, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium">{item.document}</p>
                            <p className="text-sm text-muted-foreground">
                              <Link href={`/projects/${item.id}`} className="hover:text-primary transition-colors">
                                {item.name}
                              </Link>{" "}
                              projesinden • {item.category}
                            </p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(item.updatedAt).toLocaleDateString("tr-TR")}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Arama yapmaya başlayın</h3>
            <p className="text-muted-foreground">Projeler, ekip üyeleri ve dökümanlar arasında arama yapabilirsiniz.</p>
          </div>
        )}
      </div>
    </div>
  )
}
