// Bu dosya, varsayımsal bir PHP MVC backend API'si ile etkileşim kurmak için kullanılacaktır.
// Gerçek bir uygulamada, 'http://your-php-backend.com/api' gibi bir URL'ye istekler gönderirsiniz.
// V0 ortamında bu API çağrıları simüle edilecektir.

import { nanoid } from "nanoid"
import { getDb, setDb } from "./lib/db" // Simülasyon için db'yi kullanıyoruz

const API_BASE_URL = "/api" // Varsayımsal API base URL'si

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Helper function for simulating API calls
async function simulateApiCall<T>(
  operation: () => T | Promise<T>,
  successMessage: string,
  errorMessage: string,
): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const result = operation()
        resolve({ success: true, data: result, message: successMessage })
      } catch (e: any) {
        console.error("API Simülasyon Hatası:", e)
        resolve({ success: false, message: errorMessage, error: e.message })
      }
    }, 500) // 500ms gecikme simülasyonu
  })
}

// --- Proje API'si ---
export const projectApi = {
  async getProjects(): Promise<ApiResponse<any[]>> {
    return simulateApiCall(() => getDb().projects, "Projeler başarıyla çekildi.", "Projeler çekilirken hata oluştu.")
  },

  async getProjectById(id: string): Promise<ApiResponse<any>> {
    return simulateApiCall(
      () => getDb().projects.find((p) => p.id === id),
      "Proje başarıyla çekildi.",
      "Proje bulunamadı.",
    )
  },

  async createProject(projectData: any): Promise<ApiResponse<any>> {
    return simulateApiCall(
      () => {
        const db = getDb()
        const newProject = {
          id: nanoid(),
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
          teamMembers: [],
          documents: [],
          languages: [],
          features: [],
          status: "Beklemede",
          progress: 0,
          ...projectData,
        }
        db.projects.push(newProject)
        setDb(db)
        return newProject
      },
      "Proje başarıyla oluşturuldu.",
      "Proje oluşturulurken hata oluştu.",
    )
  },

  async updateProject(id: string, projectData: any): Promise<ApiResponse<any>> {
    return simulateApiCall(
      () => {
        const db = getDb()
        const index = db.projects.findIndex((p) => p.id === id)
        if (index === -1) throw new Error("Proje bulunamadı.")
        const updatedProject = {
          ...db.projects[index],
          ...projectData,
          updatedAt: new Date().toISOString().split("T")[0],
        }
        db.projects[index] = updatedProject
        setDb(db)
        return updatedProject
      },
      "Proje başarıyla güncellendi.",
      "Proje güncellenirken hata oluştu.",
    )
  },

  async deleteProject(id: string): Promise<ApiResponse<boolean>> {
    return simulateApiCall(
      () => {
        const db = getDb()
        const initialLength = db.projects.length
        db.projects = db.projects.filter((p) => p.id !== id)
        setDb(db)
        return db.projects.length < initialLength
      },
      "Proje başarıyla silindi.",
      "Proje silinirken hata oluştu.",
    )
  },
}

// --- Ekip Üyesi API'si ---
export const teamApi = {
  async getTeamMembers(): Promise<ApiResponse<any[]>> {
    return simulateApiCall(
      () => getDb().teamMembers,
      "Ekip üyeleri başarıyla çekildi.",
      "Ekip üyeleri çekilirken hata oluştu.",
    )
  },

  async createTeamMember(memberData: any): Promise<ApiResponse<any>> {
    return simulateApiCall(
      () => {
        const db = getDb()
        const newMember = {
          id: nanoid(),
          joinDate: new Date().toISOString().split("T")[0],
          projectCount: 0,
          avatar: "/placeholder.svg?height=64&width=64",
          ...memberData,
        }
        db.teamMembers.push(newMember)
        setDb(db)
        return newMember
      },
      "Ekip üyesi başarıyla eklendi.",
      "Ekip üyesi eklenirken hata oluştu.",
    )
  },
}

// --- Etkinlik API'si (Projeler üzerinden simüle ediliyor) ---
export const eventApi = {
  async createEvent(eventData: any): Promise<ApiResponse<any>> {
    return simulateApiCall(
      () => {
        const db = getDb()
        const newEvent = {
          id: nanoid(),
          name: eventData.title,
          description: eventData.description,
          category: eventData.type,
          deadline: eventData.date,
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
          status: "Aktif", // Varsayılan durum
          progress: 0,
          priority: "Orta",
          budget: 0,
          languages: [],
          liveUrl: "",
          githubUrl: "",
          teamMembers: [],
          features: [],
          documents: [],
        }
        db.projects.push(newEvent) // Etkinlikleri projeler listesine ekleyerek simüle ediyoruz
        setDb(db)
        return newEvent
      },
      "Etkinlik başarıyla eklendi.",
      "Etkinlik eklenirken hata oluştu.",
    )
  },
}

// --- Ayarlar API'si ---
export const settingsApi = {
  async getSettings(): Promise<ApiResponse<any>> {
    return simulateApiCall(() => getDb().settings, "Ayarlar başarıyla çekildi.", "Ayarlar çekilirken hata oluştu.")
  },

  async updateSettings(settingsData: any): Promise<ApiResponse<any>> {
    return simulateApiCall(
      () => {
        const db = getDb()
        db.settings = { ...db.settings, ...settingsData }
        setDb(db)
        return db.settings
      },
      "Ayarlar başarıyla güncellendi.",
      "Ayarlar güncellenirken hata oluştu.",
    )
  },
}
