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
import { useActionState } from "react"
import { updateSettings } from "@/app/settings/actions" // Server Action import edildi
import { getDb } from "@/lib/db" // Veriyi sunucuda çekmek için db'den import edildi

export default function SettingsPage() {
  const initialSettings = getDb().settings // Başlangıç ayarları db'den çekildi
  const [settings, setSettings] = useState(initialSettings)
  const [state, formAction] = useActionState(updateSettings, null)

  // Form gönderildikten sonra toast göstermek için
  useState(() => {
    if (state?.success) {
      toast.success(state.message)
      // Ayarlar güncellendiğinde UI'ı senkronize etmek için db'den tekrar çekebiliriz
      // Ancak useActionState ile form gönderildiği için revalidatePath zaten tetiklenir
      // ve bir sonraki render'da güncel veriler gelir.
    } else if (state?.success === false) {
      toast.error(state.message)
    }
  }, [state])

  const handlePhotoUpload = () => {
    toast.info("Fotoğraf yükleniyor", {
      description: "Profil fotoğrafınız güncelleniyor (Bu özellik şu an için simüle edilmiştir).",
    })
    // Gerçek bir uygulamada burada dosya yükleme API çağrısı yapılır
    // ve başarılı olursa settings.avatar güncellenir.
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
            type="submit"
            form="settings-form" // Form ID'si ile eşleştirildi
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            Kaydet
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <form id="settings-form" action={formAction} className="max-w-4xl mx-auto space-y-6">
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
                  <input type="hidden" name="avatar" value={settings.avatar} /> {/* Avatar URL'sini göndermek için */}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input
                    id="name"
                    name="name"
                    value={settings.name}
                    onChange={(e) => setSettings((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={settings.phone}
                    onChange={(e) => setSettings((prev) => ({ ...prev, phone: e.target.value }))}
                  />
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
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Bildirimleri</Label>
                    <p className="text-sm text-muted-foreground">Tarayıcı bildirimleri alın</p>
                  </div>
                  <Switch
                    name="pushNotifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Proje Güncellemeleri</Label>
                    <p className="text-sm text-muted-foreground">Proje durumu değişikliklerinde bildirim alın</p>
                  </div>
                  <Switch
                    name="projectUpdates"
                    checked={settings.projectUpdates}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, projectUpdates: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Ekip Güncellemeleri</Label>
                    <p className="text-sm text-muted-foreground">Yeni ekip üyesi eklendiğinde bildirim alın</p>
                  </div>
                  <Switch
                    name="teamUpdates"
                    checked={settings.teamUpdates}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, teamUpdates: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Deadline Hatırlatmaları</Label>
                    <p className="text-sm text-muted-foreground">Proje deadline'ları yaklaştığında hatırlatma alın</p>
                  </div>
                  <Switch
                    name="deadlineReminders"
                    checked={settings.deadlineReminders}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, deadlineReminders: checked }))}
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
                  <Select
                    name="theme"
                    value={settings.theme}
                    onValueChange={(value) => setSettings((prev) => ({ ...prev, theme: value }))}
                  >
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
                  <Select
                    name="language"
                    value={settings.language}
                    onValueChange={(value) => setSettings((prev) => ({ ...prev, language: value }))}
                  >
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
                  <Select
                    name="timezone"
                    value={settings.timezone}
                    onValueChange={(value) => setSettings((prev) => ({ ...prev, timezone: value }))}
                  >
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
                  name="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, twoFactorAuth: checked }))}
                />
              </div>

              <Separator />

              <div>
                <Label htmlFor="sessionTimeout">Oturum Zaman Aşımı (dakika)</Label>
                <Select
                  name="sessionTimeout"
                  value={settings.sessionTimeout}
                  onValueChange={(value) => setSettings((prev) => ({ ...prev, sessionTimeout: value }))}
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
        </form>
      </div>
    </div>
  )
}
