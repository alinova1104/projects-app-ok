"use client"

import { CardDescription } from "@/components/ui/card"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, AlertCircle, CheckCircle } from "lucide-react"
import { AddEventDialog } from "@/components/add-event-dialog"
import { getDb } from "@/lib/db" // Veriyi sunucuda çekmek için db'den import edildi
import { toast } from "sonner" // sonner'dan toast import edildi
import { format } from "date-fns"
import { tr } from "date-fns/locale" // Türkçe dil desteği için

export default function CalendarPage() {
  const { projects } = getDb() // Veri doğrudan sunucuda çekildi
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [viewType, setViewType] = useState("month")

  // Takvim için tarih hesaplamaları
  const today = new Date()
  const currentMonth = date.getMonth()
  const currentYear = date.getFullYear()

  // Ayın ilk günü ve son günü
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const firstDayOfWeek = firstDayOfMonth.getDay()

  // Takvim günlerini oluştur
  const calendarDays = []

  // Önceki ayın son günleri
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = new Date(firstDayOfMonth)
    day.setDate(day.getDate() - (i + 1))
    calendarDays.push({ day, isCurrentMonth: false })
  }

  // Bu ayın günleri
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    const dayDate = new Date(currentYear, currentMonth, day)
    calendarDays.push({ day: dayDate, isCurrentMonth: true })
  }

  // Sonraki ayın ilk günleri (42 gün tamamlamak için)
  const remainingDays = 42 - calendarDays.length
  for (let day = 1; day <= remainingDays; day++) {
    const dayDate = new Date(currentYear, currentMonth + 1, day)
    calendarDays.push({ day: dayDate, isCurrentMonth: false })
  }

  // Proje etkinliklerini tarihlere göre grupla
  const getEventsForDate = (selectedDate: Date) => {
    const dateStr = selectedDate.toISOString().split("T")[0]
    return projects.filter((project) => {
      // Projelerin createdAt veya deadline alanlarını etkinlik olarak kabul et
      const createdDate = project.createdAt?.split("T")[0] || project.createdAt
      const deadlineDate = project.deadline?.split("T")[0] || project.deadline
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
    const newDate = new Date(date)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setDate(newDate)

    toast.info("Takvim güncellendi", {
      description: `${monthNames[newDate.getMonth()]} ${newDate.getFullYear()} görüntüleniyor`,
    })
  }

  const goToToday = () => {
    setDate(new Date())
    toast.info("Bugüne gidildi", {
      description: "Takvim bugünün tarihine ayarlandı",
    })
  }

  const statusColors = {
    Aktif: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    Tamamlandı:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    Beklemede: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800",
  }

  const eventsForSelectedDate = projects.filter(
    (project) => project.deadline && date && new Date(project.deadline).toDateString() === date.toDateString(),
  )

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

      <div className="flex-1 overflow-auto p-4 md:p-6 grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Ana Takvim */}
        <div className="xl:col-span-3">
          <Card className="bg-card text-card-foreground">
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
                {calendarDays.map((dayInfo, index) => {
                  const events = getEventsForDate(dayInfo.day)
                  const isToday = dayInfo.day.toDateString() === today.toDateString()

                  return (
                    <div
                      key={index}
                      className={`min-h-[80px] p-1 border rounded-lg ${
                        dayInfo.isCurrentMonth
                          ? "bg-background border-border"
                          : "bg-muted/50 border-muted text-muted-foreground"
                      } ${isToday ? "ring-2 ring-primary" : ""}`}
                    >
                      <div
                        className={`text-sm font-medium mb-1 ${
                          isToday
                            ? "text-primary"
                            : dayInfo.isCurrentMonth
                              ? "text-foreground"
                              : "text-muted-foreground"
                        }`}
                      >
                        {dayInfo.day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {events.slice(0, 2).map((project) => {
                          const isDeadline = project.deadline?.split("T")[0] === dayInfo.day.toISOString().split("T")[0]
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
          <Card className="bg-card text-card-foreground">
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
          <Card className="bg-card text-card-foreground">
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
          <Card className="bg-card text-card-foreground">
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
                  <span className="text-sm font-medium">{projects.filter((p) => p.status === "Beklemede").length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seçili Tarihin Etkinlikleri */}
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="text-lg">{date ? format(date, "PPP", { locale: tr }) : "Etkinlikler"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {eventsForSelectedDate.length > 0 ? (
                eventsForSelectedDate.map((event) => (
                  <div key={event.id} className="border-l-4 border-blue-500 pl-3 py-2">
                    <h3 className="font-semibold text-foreground">{event.name}</h3>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <p className="text-xs text-muted-foreground">Kategori: {event.category}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">Bu tarihte etkinlik bulunmuyor.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Takvim */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Takvim</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                locale={tr} // Takvimi Türkçe yap
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
