"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Mail, Phone, Calendar, FolderOpen, Users, MessageCircle, User } from "lucide-react"
import { AddTeamMemberDialog } from "@/components/add-team-member-dialog"
import { teamApi } from "@/api" // api.ts'den import edildi
import { toast } from "sonner"

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchTeamMembers = async () => {
    setLoading(true)
    setError(null)
    const response = await teamApi.getTeamMembers()
    if (response.success && response.data) {
      setTeamMembers(response.data)
    } else {
      setError(response.message || "Ekip üyeleri yüklenirken bir hata oluştu.")
      toast.error("Hata", { description: response.message || "Ekip üyeleri yüklenirken bir hata oluştu." })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewProfile = (member: any) => {
    toast.info("Profil görüntüleniyor", {
      description: `${member.name} profiline yönlendiriliyorsunuz (simüle edildi)`,
    })
  }

  const handleSendMessage = (member: any) => {
    toast.info("Mesaj gönderiliyor", {
      description: `${member.name} ile mesajlaşma başlatılıyor (simüle edildi)`,
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent" />
        <p className="mt-4 text-muted-foreground">Ekip üyeleri yükleniyor...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-red-500">
        <p>{error}</p>
        <Button onClick={fetchTeamMembers} className="mt-4">
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
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Ekip</h1>
            <p className="text-sm md:text-base text-muted-foreground">Takım üyelerinizi yönetin ve görüntüleyin</p>
          </div>
          <AddTeamMemberDialog onMemberAdded={fetchTeamMembers} /> {/* Callback eklendi */}
        </div>
      </header>

      {/* Search */}
      <div className="bg-background border-b border-border px-4 md:px-6 py-4">
        <div className="relative max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Ekip üyesi ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-base font-medium text-primary">{member.role}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Katılım: {new Date(member.joinDate).toLocaleDateString("tr-TR")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FolderOpen className="w-4 h-4" />
                      <span>{member.projectCount} proje</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Yetenekler</h4>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleViewProfile(member)}
                    >
                      <User className="w-4 h-4 mr-1" />
                      Profil
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleSendMessage(member)}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Mesaj
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Ekip üyesi bulunamadı</h3>
            <p className="text-muted-foreground">Arama kriterlerinize uygun ekip üyesi bulunmuyor.</p>
            <AddTeamMemberDialog onMemberAdded={fetchTeamMembers} />
          </div>
        )}
      </div>
    </div>
  )
}
