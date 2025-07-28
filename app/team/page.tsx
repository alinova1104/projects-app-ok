"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, UsersIcon, UserPlus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AddTeamMemberDialog } from "@/components/add-team-member-dialog"
import { getDb } from "@/lib/db" // Veriyi sunucuda çekmek için db'den import edildi

export default function TeamPage() {
  const { teamMembers } = getDb() // Veri doğrudan sunucuda çekildi
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-background border-b border-border px-4 md:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Ekip Üyeleri</h1>
            <p className="text-sm md:text-base text-muted-foreground">Tüm ekip üyelerinizi yönetin</p>
          </div>
          <AddTeamMemberDialog />
        </div>
      </header>

      {/* Search */}
      <div className="bg-background border-b border-border px-4 md:px-6 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="flex flex-col items-center text-center p-6">
                <Avatar className="w-20 h-20 mb-4">
                  <AvatarImage src={member.avatar || "/placeholder.svg?height=64&width=64"} />
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {member.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <UsersIcon className="inline-block w-4 h-4 mr-1" />
                  {member.projectCount} Proje
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ekip üyesi bulunamadı</h3>
            <p className="text-gray-500 mb-4">Arama kriterlerinize uygun ekip üyesi bulunmuyor.</p>
            <AddTeamMemberDialog />
          </div>
        )}
      </div>
    </div>
  )
}
