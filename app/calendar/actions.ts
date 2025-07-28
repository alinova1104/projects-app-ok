"use server"

import { revalidatePath } from "next/cache"
import { nanoid } from "nanoid"
import { getDb, setDb } from "@/lib/db"

export async function addEvent(prevState: any, formData: FormData) {
  try {
    const db = getDb()
    const newEvent = {
      id: nanoid(),
      name: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("type") as string, // Etkinlik türünü kategori olarak kullan
      deadline: formData.get("date") as string, // Tarihi deadline olarak kullan
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      status: "Aktif", // Etkinlikler varsayılan olarak aktif
      progress: 0,
      priority: "Orta", // Varsayılan öncelik
      budget: 0,
      languages: [],
      liveUrl: "",
      githubUrl: "",
      teamMembers: [],
      features: [],
      documents: [],
    }

    // Etkinliği bir proje olarak ekliyoruz, bu takvimde görünmesini sağlayacak
    db.projects.push(newEvent)
    setDb(db) // Bellek içi veritabanını güncelle

    revalidatePath("/calendar")
    revalidatePath("/projects") // Projeler sayfasını da etkileyebilir

    return { success: true, message: "Etkinlik başarıyla eklendi!" }
  } catch (error) {
    console.error("Etkinlik eklenirken hata oluştu:", error)
    return { success: false, message: "Etkinlik eklenirken bir hata oluştu." }
  }
}
