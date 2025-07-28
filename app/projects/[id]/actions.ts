"use server"

import { revalidatePath } from "next/cache"
import { getDb, setDb } from "@/lib/db"

export async function updateProject(prevState: any, formData: FormData) {
  try {
    const db = getDb()
    const id = formData.get("id") as string
    const projectIndex = db.projects.findIndex((p) => p.id === id)

    if (projectIndex === -1) {
      return { success: false, message: "Proje bulunamadı." }
    }

    const updatedProject = {
      ...db.projects[projectIndex],
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      difficulty: formData.get("difficulty") as string,
      priority: formData.get("priority") as string,
      status: formData.get("status") as string,
      progress: Number.parseInt(formData.get("progress") as string) || 0,
      budget: Number.parseInt(formData.get("budget") as string) || 0,
      deadline: formData.get("deadline") as string,
      updatedAt: new Date().toISOString().split("T")[0],
    }

    db.projects[projectIndex] = updatedProject
    setDb(db) // Bellek içi veritabanını güncelle

    revalidatePath(`/projects/${id}`)
    revalidatePath("/projects")
    revalidatePath("/statistics")
    revalidatePath("/reports")
    revalidatePath("/calendar")

    return { success: true, message: "Proje başarıyla güncellendi!" }
  } catch (error) {
    console.error("Proje güncellenirken hata oluştu:", error)
    return { success: false, message: "Proje güncellenirken bir hata oluştu." }
  }
}
