import initialData from "@/data/projects.json"

// Bu, v0 ortamında değişikliklerin oturum boyunca kalıcı görünmesini sağlayan basit bir bellek içi depolamadır.
// Gerçek bir uygulamada, veritabanı (örneğin PostgreSQL, MongoDB) kullanılmalıdır.
let db = { ...initialData }

export function getDb() {
  return db
}

export function setDb(newDb: typeof initialData) {
  db = newDb
}
