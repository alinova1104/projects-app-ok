"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Bell, Shield, Palette, Save, Upload } from "lucide-react"
import { ChangePasswordDialog } from "@/components/change-password-dialog"
import { toast } from "sonner" // sonner'dan toast import edildi

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Profil ayarları
    name: "Admin User",
    email: "admin@example.com",
    phone: "+90 555 123 4567",
    avatar: "/placeholder.svg?height=64&width=64",

    // Bildirim ayarları
    emailNotifications: true,
    pushNotifications: false,
    projectUpdates: true,
    teamUpdates: true,
    deadlineReminders: true,

    // Görünüm ayarları
    theme: "light",
    language: "tr",
    timezone: "Europe/Istanbul",

    // Güvenlik ayarları
    twoFactorAuth: false,
    sessionTimeout: "30",
  })

  const handleSave = () => {
    // Burada normalde API'ye ayarlar gönderilir
    toast.success("Ayarlar kaydedildi", {
      description: "Tüm ayarlarınız başarıyla güncellendi",
    })
  }

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handlePhotoUpload = () => {
    toast.info("Fotoğraf yükleniyor", {
      description: "Profil fotoğrafınız güncelleniyor",
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-background border-b border-border px-4 md:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Ayarlar</h1>
            <p className="text-sm md:text-base text-muted-foreground">Hesap ve uygulama ayarlarınızı yönetin</p>
          </div>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            Kaydet
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profil Ayarları */}
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profil Ayarları
              </CardTitle>
              <CardDescription>Kişisel bilgilerinizi güncelleyin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                  <AvatarImage src={settings.avatar || "/placeholder.svg"} />
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <Button variant="outline" size="sm" onClick={handlePhotoUpload}>
                    <Upload className="w-4 h-4 mr-2" />
                    Fotoğraf Yükle
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG veya GIF. Maksimum 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input id="name" value={settings.name} onChange={(e) => updateSetting("name", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSetting("email", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" value={settings.phone} onChange={(e) => updateSetting("phone", e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bildirim Ayarları */}
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Bildirim Ayarları
              </CardTitle>
              <CardDescription>Hangi bildirimleri almak istediğinizi seçin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>E-posta Bildirimleri</Label>
                    <p className="text-sm text-muted-foreground">Önemli güncellemeler için e-posta alın</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Bildirimleri</Label>
                    <p className="text-sm text-muted-foreground">Tarayıcı bildirimleri alın</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Proje Güncellemeleri</Label>
                    <p className="text-sm text-muted-foreground">Proje durumu değişikliklerinde bildirim alın</p>
                  </div>
                  <Switch
                    checked={settings.projectUpdates}
                    onCheckedChange={(checked) => updateSetting("projectUpdates", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Ekip Güncellemeleri</Label>
                    <p className="text-sm text-muted-foreground">Yeni ekip üyesi eklendiğinde bildirim alın</p>
                  </div>
                  <Switch
                    checked={settings.teamUpdates}
                    onCheckedChange={(checked) => updateSetting("teamUpdates", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Deadline Hatırlatmaları</Label>
                    <p className="text-sm text-muted-foreground">Proje deadline'ları yaklaştığında hatırlatma alın</p>
                  </div>
                  <Switch
                    checked={settings.deadlineReminders}
                    onCheckedChange={(checked) => updateSetting("deadlineReminders", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Görünüm Ayarları */}
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Görünüm Ayarları
              </CardTitle>
              <CardDescription>Uygulamanın görünümünü özelleştirin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="theme">Tema</Label>
                  <Select value={settings.theme} onValueChange={(value) => updateSetting("theme", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Açık</SelectItem>
                      <SelectItem value="dark">Koyu</SelectItem>
                      <SelectItem value="system">Sistem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language">Dil</Label>
                  <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tr">Türkçe</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone">Saat Dilimi</Label>
                  <Select value={settings.timezone} onValueChange={(value) => updateSetting("timezone", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Istanbul">İstanbul</SelectItem>
                      <SelectItem value="Europe/London">Londra</SelectItem>
                      <SelectItem value="America/New_York">New York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Güvenlik Ayarları */}
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Güvenlik Ayarları
              </CardTitle>
              <CardDescription>Hesabınızın güvenliğini artırın</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>İki Faktörlü Doğrulama</Label>
                  <p className="text-sm text-muted-foreground">Hesabınız için ek güvenlik katmanı ekleyin</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => updateSetting("twoFactorAuth", checked)}
                />
              </div>

              <Separator />

              <div>
                <Label htmlFor="sessionTimeout">Oturum Zaman Aşımı (dakika)</Label>
                <Select
                  value={settings.sessionTimeout}
                  onValueChange={(value) => updateSetting("sessionTimeout", value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 dakika</SelectItem>
                    <SelectItem value="30">30 dakika</SelectItem>
                    <SelectItem value="60">1 saat</SelectItem>
                    <SelectItem value="120">2 saat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <ChangePasswordDialog />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
