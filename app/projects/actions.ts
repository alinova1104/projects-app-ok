"use server"

import { revalidatePath } from "next/cache"
import { nanoid } from "nanoid"
import { getDb, setDb } from "@/lib/db"

export async function createProject(prevState: any, formData: FormData) {
  try {
    const db = getDb()
    const newProject = {
      id: nanoid(),
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      difficulty: formData.get("difficulty") as string,
      languages: (formData.get("languages") as string)
        .split(",")
        .map((lang) => lang.trim())
        .filter(Boolean),
      liveUrl: formData.get("liveUrl") as string,
      githubUrl: formData.get("githubUrl") as string,
      features: (formData.get("features") as string)
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean),
      priority: formData.get("priority") as string,
      budget: Number.parseInt(formData.get("budget") as string) || 0,
      deadline: formData.get("deadline") as string,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      teamMembers: [], // Yeni projeler başlangıçta ekip üyesi olmadan başlar
      status: "Beklemede", // Yeni projeler varsayılan olarak beklemede
      progress: 0, // Yeni projeler varsayılan olarak 0 ilerleme
      documents: [], // Yeni projeler başlangıçta doküman olmadan başlar
    }

    db.projects.push(newProject)
    setDb(db) // Bellek içi veritabanını güncelle

    revalidatePath("/projects")
    revalidatePath("/statistics")
    revalidatePath("/reports")
    revalidatePath("/calendar")

    return { success: true, message: "Proje başarıyla oluşturuldu!" }
  } catch (error) {
    console.error("Proje oluşturulurken hata oluştu:", error)
    return { success: false, message: "Proje oluşturulurken bir hata oluştu." }
  }
}
