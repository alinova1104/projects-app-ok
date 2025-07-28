"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, User, FolderOpen, MessageSquare } from "lucide-react"

interface Activity {
  id: string
  type: "comment" | "project_update" | "member_join"
  user: {
    name: string
    avatar?: string
  }
  timestamp: string
  content: string
  project?: {
    id: string
    name: string
  }
}

interface ActivityFeedProps {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Aktivite Akışı
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {activity.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{activity.user.name}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.type === "comment" && (
                      <>
                        <MessageSquare className="inline-block w-4 h-4 mr-1 text-blue-500" />
                        {activity.content}
                        {activity.project && (
                          <span className="ml-1">
                            {" "}
                            - <span className="font-semibold">{activity.project.name}</span> projesine yorum yaptı
                          </span>
                        )}
                      </>
                    )}
                    {activity.type === "project_update" && (
                      <>
                        <FolderOpen className="inline-block w-4 h-4 mr-1 text-green-500" />
                        {activity.content}
                        {activity.project && (
                          <span className="ml-1">
                            {" "}
                            - <span className="font-semibold">{activity.project.name}</span> projesini güncelledi
                          </span>
                        )}
                      </>
                    )}
                    {activity.type === "member_join" && (
                      <>
                        <User className="inline-block w-4 h-4 mr-1 text-purple-500" />
                        {activity.content}
                      </>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center">Henüz bir aktivite bulunmuyor.</p>
        )}
      </CardContent>
    </Card>
  )
}
