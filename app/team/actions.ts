"use server"

import { revalidatePath } from "next/cache"
import { nanoid } from "nanoid"
import { getDb, setDb } from "@/lib/db"

export async function addTeamMember(prevState: any, formData: FormData) {
  try {
    const db = getDb()
    const newMember = {
      id: nanoid(),
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      role: formData.get("role") as string,
      skills: (formData.get("skills") as string)
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      avatar: "/placeholder.svg?height=64&width=64", // Varsayılan avatar
      joinDate: new Date().toISOString().split("T")[0],
      projectCount: 0, // Yeni üye başlangıçta proje sayısına sahip değil
    }

    db.teamMembers.push(newMember)
    setDb(db) // Bellek içi veritabanını güncelle

    revalidatePath("/team")

    return { success: true, message: "Ekip üyesi başarıyla eklendi!" }
  } catch (error) {
    console.error("Ekip üyesi eklenirken hata oluştu:", error)
    return { success: false, message: "Ekip üyesi eklenirken bir hata oluştu." }
  }
}
