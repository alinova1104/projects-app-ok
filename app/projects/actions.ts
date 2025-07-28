"use server"

import { revalidatePath } from "next/cache"
import { nanoid } from "nanoid"
import { getDb, setDb } from "@/lib/db"

export async function addProject(prevState: any, formData: FormData) {
  try {
    const db = getDb()
    const newProject = {
      id: nanoid(),
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      status: formData.get("status") as "Aktif" | "Tamamlandı" | "Beklemede",
      priority: formData.get("priority") as "Yüksek" | "Orta" | "Düşük",
      progress: Number.parseInt(formData.get("progress") as string),
      createdAt: new Date().toISOString().split("T")[0],
      deadline: formData.get("deadline") as string,
      budget: Number.parseInt(formData.get("budget") as string),
      teamMembers: [], // Yeni projede başlangıçta ekip üyesi yok
      languages: (formData.get("languages") as string)
        .split(",")
        .map((lang) => lang.trim())
        .filter(Boolean),
      features: (formData.get("features") as string)
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean),
      documents: (formData.get("documents") as string)
        .split(",")
        .map((doc) => doc.trim())
        .filter(Boolean),
      liveUrl: formData.get("liveUrl") as string,
      githubUrl: formData.get("githubUrl") as string,
      updatedAt: new Date().toISOString().split("T")[0],
    }

    db.projects.push(newProject)
    setDb(db) // Bellek içi veritabanını güncelle

    revalidatePath("/projects") // Projeler sayfasını yeniden doğrula
    revalidatePath(`/projects/${newProject.id}`) // Yeni proje detay sayfasını da doğrula

    return { success: true, message: "Proje başarıyla oluşturuldu!" }
  } catch (error) {
    console.error("Proje oluşturulurken hata oluştu:", error)
    return { success: false, message: "Proje oluşturulurken bir hata oluştu." }
  }
}

export async function editProject(prevState: any, formData: FormData) {
  try {
    const db = getDb()
    const projectId = formData.get("id") as string
    const projectIndex = db.projects.findIndex((p) => p.id === projectId)

    if (projectIndex === -1) {
      return { success: false, message: "Proje bulunamadı." }
    }

    const updatedProject = {
      ...db.projects[projectIndex],
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      status: formData.get("status") as "Aktif" | "Tamamlandı" | "Beklemede",
      priority: formData.get("priority") as "Yüksek" | "Orta" | "Düşük",
      progress: Number.parseInt(formData.get("progress") as string),
      deadline: formData.get("deadline") as string,
      budget: Number.parseInt(formData.get("budget") as string),
      languages: (formData.get("languages") as string)
        .split(",")
        .map((lang) => lang.trim())
        .filter(Boolean),
      features: (formData.get("features") as string)
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean),
      documents: (formData.get("documents") as string)
        .split(",")
        .map((doc) => doc.trim())
        .filter(Boolean),
      liveUrl: formData.get("liveUrl") as string,
      githubUrl: formData.get("githubUrl") as string,
      updatedAt: new Date().toISOString().split("T")[0],
    }

    db.projects[projectIndex] = updatedProject
    setDb(db) // Bellek içi veritabanını güncelle

    revalidatePath("/projects") // Projeler sayfasını yeniden doğrula
    revalidatePath(`/projects/${projectId}`) // Proje detay sayfasını yeniden doğrula

    return { success: true, message: "Proje başarıyla güncellendi!" }
  } catch (error) {
    console.error("Proje güncellenirken hata oluştu:", error)
    return { success: false, message: "Proje güncellenirken bir hata oluştu." }
  }
}
