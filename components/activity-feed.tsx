"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Activity, FolderOpen, Users, FileText, CheckCircle, Clock } from "lucide-react"

const activities = [
  {
    id: "1",
    type: "project_created",
    user: { name: "Ahmet Yılmaz", avatar: "/placeholder.svg?height=32&width=32" },
    project: "E-Ticaret Platformu",
    timestamp: "2 dakika önce",
    icon: FolderOpen,
    color: "text-blue-500",
  },
  {
    id: "2",
    type: "project_completed",
    user: { name: "Ayşe Kaya", avatar: "/placeholder.svg?height=32&width=32" },
    project: "Mobil Fitness Uygulaması",
    timestamp: "15 dakika önce",
    icon: CheckCircle,
    color: "text-green-500",
  },
  {
    id: "3",
    type: "team_joined",
    user: { name: "Mehmet Demir", avatar: "/placeholder.svg?height=32&width=32" },
    project: "AI Chatbot Sistemi",
    timestamp: "1 saat önce",
    icon: Users,
    color: "text-purple-500",
  },
  {
    id: "4",
    type: "document_uploaded",
    user: { name: "Fatma Özkan", avatar: "/placeholder.svg?height=32&width=32" },
    project: "CRM Sistemi",
    timestamp: "2 saat önce",
    icon: FileText,
    color: "text-orange-500",
  },
  {
    id: "5",
    type: "deadline_approaching",
    user: { name: "Sistem", avatar: "/placeholder.svg?height=32&width=32" },
    project: "Blog Platformu",
    timestamp: "3 saat önce",
    icon: Clock,
    color: "text-red-500",
  },
]

const getActivityText = (activity: any) => {
  switch (activity.type) {
    case "project_created":
      return `${activity.project} projesini oluşturdu`
    case "project_completed":
      return `${activity.project} projesini tamamladı`
    case "team_joined":
      return `${activity.project} projesine katıldı`
    case "document_uploaded":
      return `${activity.project} projesine döküman yükledi`
    case "deadline_approaching":
      return `${activity.project} projesi deadline'ı yaklaşıyor`
    default:
      return "Bilinmeyen aktivite"
  }
}

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Son Aktiviteler
        </CardTitle>
        <CardDescription>Takımınızın son aktiviteleri</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className={`p-2 rounded-full bg-muted ${activity.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">
                        {activity.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{activity.user.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{getActivityText(activity)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
