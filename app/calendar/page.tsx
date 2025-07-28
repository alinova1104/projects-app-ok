"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, AlertCircle, CheckCircle } from "lucide-react"
import projectsData from "@/data/projects.json"
import { AddEventDialog } from "@/components/add-event-dialog"
import { useToast } from "@/hooks/use-toast"

export default function CalendarPage() {
  const { projects } = projectsData
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewType, setViewType] = useState("month")
  const { toast } = useToast()

  // Takvim için tarih hesaplamaları
  const today = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Ayın ilk günü ve son günü
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const firstDayOfWeek = firstDayOfMonth.getDay()

  // Takvim günlerini oluştur
  const calendarDays = []

  // Önceki ayın son günleri
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(firstDayOfMonth)
    date.setDate(date.getDate() - (i + 1))
    calendarDays.push({ date, isCurrentMonth: false })
  }

  // Bu ayın günleri
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    const date = new Date(currentYear, currentMonth, day)
    calendarDays.push({ date, isCurrentMonth: true })
  }

  // Sonraki ayın ilk günleri (42 gün tamamlamak için)
  const remainingDays = 42 - calendarDays.length
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(currentYear, currentMonth + 1, day)
    calendarDays.push({ date, isCurrentMonth: false })
  }

  // Proje etkinliklerini tarihlere göre grupla
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return projects.filter((project) => {
      const createdDate = project.createdAt.split("T")[0] || project.createdAt
      const deadlineDate = project.deadline.split("T")[0] || project.deadline
      return createdDate === dateStr || deadlineDate === dateStr
    })
  }

  // Yaklaşan etkinlikler
  const upcomingEvents = projects
    .filter((project) => {
      const deadline = new Date(project.deadline)
      const diffTime = deadline.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays >= 0 && diffDays <= 30
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 10)

  const monthNames = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ]

  const dayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"]

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)

    toast({
      title: "Takvim güncellendi",
      description: `${monthNames[newDate.getMonth()]} ${newDate.getFullYear()} görüntüleniyor`,
      type: "success",
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    toast({
      title: "Bugüne gidildi",
      description: "Takvim bugünün tarihine ayarlandı",
      type: "success",
    })
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Takvim</h1>
            <p className="text-sm md:text-base text-muted-foreground">Proje deadline'ları ve etkinlikleri</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={viewType} onValueChange={setViewType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Ay</SelectItem>
                <SelectItem value="week">Hafta</SelectItem>
                <SelectItem value="day">Gün</SelectItem>
              </SelectContent>
            </Select>
            <AddEventDialog />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Ana Takvim */}
          <div className="xl:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    {monthNames[currentMonth]} {currentYear}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToToday}>
                      Bugün
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {dayNames.map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    const events = getEventsForDate(day.date)
                    const isToday = day.date.toDateString() === today.toDateString()

                    return (
                      <div
                        key={index}
                        className={`min-h-[80px] p-1 border rounded-lg ${
                          day.isCurrentMonth
                            ? "bg-background border-border"
                            : "bg-muted/50 border-muted text-muted-foreground"
                        } ${isToday ? "ring-2 ring-primary" : ""}`}
                      >
                        <div
                          className={`text-sm font-medium mb-1 ${
                            isToday ? "text-primary" : day.isCurrentMonth ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {day.date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {events.slice(0, 2).map((project) => {
                            const isDeadline = project.deadline.split("T")[0] === day.date.toISOString().split("T")[0]
                            return (
                              <div
                                key={project.id}
                                className={`text-xs p-1 rounded truncate ${
                                  isDeadline
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                }`}
                                title={project.name}
                              >
                                {isDeadline ? "📅" : "🚀"} {project.name}
                              </div>
                            )
                          })}
                          {events.length > 2 && (
                            <div className="text-xs text-muted-foreground">+{events.length - 2} daha</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Yan Panel */}
          <div className="space-y-6">
            {/* Bugünün Etkinlikleri */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bugün</CardTitle>
                <CardDescription>
                  {today.toLocaleDateString("tr-TR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {getEventsForDate(today).length > 0 ? (
                  <div className="space-y-3">
                    {getEventsForDate(today).map((project) => (
                      <div key={project.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{project.name}</p>
                          <p className="text-xs text-muted-foreground">{project.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Bugün için etkinlik yok</p>
                )}
              </CardContent>
            </Card>

            {/* Yaklaşan Deadline'lar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Yaklaşan Deadline'lar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map((project) => {
                    const deadline = new Date(project.deadline)
                    const diffTime = deadline.getTime() - today.getTime()
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                    const isUrgent = diffDays <= 7

                    return (
                      <div key={project.id} className="flex items-center gap-3 p-3 rounded-lg border">
                        <div className={`w-3 h-3 rounded-full ${isUrgent ? "bg-red-500" : "bg-orange-500"}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{project.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={statusColors[project.status]}>
                              {project.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {diffDays === 0 ? "Bugün" : diffDays === 1 ? "Yarın" : `${diffDays} gün`}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">{deadline.toLocaleDateString("tr-TR")}</div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Proje İstatistikleri */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bu Ay</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Tamamlanan</span>
                    </div>
                    <span className="text-sm font-medium">
                      {projects.filter((p) => p.status === "Tamamlandı").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Aktif</span>
                    </div>
                    <span className="text-sm font-medium">{projects.filter((p) => p.status === "Aktif").length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">Bekleyen</span>
                    </div>
                    <span className="text-sm font-medium">
                      {projects.filter((p) => p.status === "Beklemede").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
