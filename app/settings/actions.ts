"use server"

import { revalidatePath } from "next/cache"
import { getDb, setDb } from "@/lib/db"

export async function updateSettings(prevState: any, formData: FormData) {
  try {
    const db = getDb()

    const updatedSettings = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      avatar: formData.get("avatar") as string, // Varsayılan olarak placeholder.svg
      emailNotifications: formData.get("emailNotifications") === "on",
      pushNotifications: formData.get("pushNotifications") === "on",
      projectUpdates: formData.get("projectUpdates") === "on",
      teamUpdates: formData.get("teamUpdates") === "on",
      deadlineReminders: formData.get("deadlineReminders") === "on",
      theme: formData.get("theme") as string,
      language: formData.get("language") as string,
      timezone: formData.get("timezone") as string,
      twoFactorAuth: formData.get("twoFactorAuth") === "on",
      sessionTimeout: formData.get("sessionTimeout") as string,
    }

    db.settings = updatedSettings
    setDb(db) // Bellek içi veritabanını güncelle

    revalidatePath("/settings") // Ayarlar sayfasını yeniden doğrula

    return { success: true, message: "Ayarlar başarıyla güncellendi!" }
  } catch (error) {
    console.error("Ayarlar güncellenirken hata oluştu:", error)
    return { success: false, message: "Ayarlar güncellenirken bir hata oluştu." }
  }
}
