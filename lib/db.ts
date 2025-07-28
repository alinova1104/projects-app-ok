// Bu dosya, v0 ortamında verilerinizi simüle etmek için geçici olarak kullanılmaktadır.
// Gerçek bir PHP MVC backend'de, bu veriler bir veritabanında (MySQL, PostgreSQL vb.) saklanacaktır.
// Frontend'deki api.ts dosyası, bu db.ts'yi doğrudan kullanmayacak, bunun yerine HTTP istekleri gönderecektir.

interface Project {
  id: string
  name: string
  description: string
  category: string
  status: "Aktif" | "Tamamlandı" | "Beklemede"
  priority: "Yüksek" | "Orta" | "Düşük"
  progress: number
  createdAt: string
  deadline: string
  budget: number
  teamMembers: { id: string; name: string; role: string; avatar?: string }[]
  languages: string[]
  features: string[]
  documents: string[]
  liveUrl?: string
  githubUrl?: string
  updatedAt: string
}

interface TeamMember {
  id: string
  name: string
  email: string
  phone: string
  role: string
  skills: string[]
  avatar?: string
  joinDate: string
  projectCount: number
}

interface Settings {
  name: string
  email: string
  phone: string
  avatar: string
  emailNotifications: boolean
  pushNotifications: boolean
  projectUpdates: boolean
  teamUpdates: boolean
  deadlineReminders: boolean
  theme: string
  language: string
  timezone: string
  twoFactorAuth: boolean
  sessionTimeout: string
}

interface DbState {
  projects: Project[]
  teamMembers: TeamMember[]
  settings: Settings
}

const initialData: DbState = {
  projects: [
    {
      id: "1",
      name: "E-ticaret Platformu Geliştirme",
      description:
        "Müşteriler için modern ve ölçeklenebilir bir e-ticaret platformu oluşturma. Ürün yönetimi, sepet, ödeme entegrasyonları ve kullanıcı profilleri içerecek.",
      category: "Web Geliştirme",
      status: "Aktif",
      priority: "Yüksek",
      progress: 75,
      createdAt: "2023-01-15",
      deadline: "2024-12-31",
      budget: 150000,
      teamMembers: [
        { id: "t1", name: "Ayşe Yılmaz", role: "Proje Yöneticisi", avatar: "/placeholder.svg?height=64&width=64" },
        { id: "t2", name: "Can Demir", role: "Full-stack Geliştirici", avatar: "/placeholder.svg?height=64&width=64" },
        { id: "t3", name: "Elif Kaya", role: "UI/UX Tasarımcı", avatar: "/placeholder.svg?height=64&width=64" },
      ],
      languages: ["React", "Node.js", "MongoDB", "TypeScript"],
      features: [
        "Ürün Katalog Yönetimi",
        "Kullanıcı Kimlik Doğrulama",
        "Ödeme Ağ Geçidi Entegrasyonu",
        "Sipariş Takibi",
        "Arama ve Filtreleme",
      ],
      documents: ["Proje Planı.pdf", "Teknik Şartname.docx", "Veritabanı Şeması.sql"],
      liveUrl: "https://example.com/ecommerce",
      githubUrl: "https://github.com/example/ecommerce",
      updatedAt: "2024-07-20",
    },
    {
      id: "2",
      name: "Mobil Uygulama Tasarımı",
      description:
        "Yeni bir sosyal medya mobil uygulaması için kullanıcı arayüzü ve deneyimi tasarımı. iOS ve Android uyumlu olacak.",
      category: "Mobil Geliştirme",
      status: "Beklemede",
      priority: "Orta",
      progress: 20,
      createdAt: "2024-03-01",
      deadline: "2024-09-30",
      budget: 75000,
      teamMembers: [
        { id: "t3", name: "Elif Kaya", role: "UI/UX Tasarımcı", avatar: "/placeholder.svg?height=64&width=64" },
        { id: "t4", name: "Deniz Akın", role: "Mobil Geliştirici", avatar: "/placeholder.svg?height=64&width=64" },
      ],
      languages: ["Figma", "Sketch", "React Native"],
      features: ["Kullanıcı Akışları", "Etkileşimli Prototipleme", "Bildirim Sistemi", "Profil Özelleştirme"],
      documents: ["Tasarım Kılavuzu.pdf", "Kullanıcı Hikayeleri.docx"],
      liveUrl: "",
      githubUrl: "",
      updatedAt: "2024-07-10",
    },
    {
      id: "3",
      name: "Veri Analizi ve Raporlama Sistemi",
      description:
        "Büyük veri setlerini analiz etmek ve görsel raporlar oluşturmak için bir sistem geliştirme. Makine öğrenimi entegrasyonları içerebilir.",
      category: "Veri Bilimi",
      status: "Tamamlandı",
      priority: "Düşük",
      progress: 100,
      createdAt: "2022-11-01",
      deadline: "2023-06-30",
      budget: 120000,
      teamMembers: [
        { id: "t5", name: "Burak Can", role: "Veri Bilimci", avatar: "/placeholder.svg?height=64&width=64" },
        { id: "t2", name: "Can Demir", role: "Full-stack Geliştirici", avatar: "/placeholder.svg?height=64&width=64" },
      ],
      languages: ["Python", "SQL", "Tableau", "Pandas"],
      features: ["Veri Temizleme Modülü", "Görsel Rapor Paneli", "Tahminsel Analiz", "Otomatik Raporlama"],
      documents: ["Veri Modeli.xlsx", "Algoritma Dokümantasyonu.pdf"],
      liveUrl: "https://example.com/data-dashboard",
      githubUrl: "https://github.com/example/data-analysis",
      updatedAt: "2023-06-25",
    },
    {
      id: "4",
      name: "Kurumsal Web Sitesi Yenileme",
      description:
        "Şirketin mevcut web sitesini modern teknolojilerle yeniden tasarlama ve geliştirme. SEO optimizasyonu ve mobil uyumluluk öncelikli.",
      category: "Web Geliştirme",
      status: "Aktif",
      priority: "Orta",
      progress: 60,
      createdAt: "2024-05-10",
      deadline: "2024-11-15",
      budget: 90000,
      teamMembers: [
        { id: "t1", name: "Ayşe Yılmaz", role: "Proje Yöneticisi", avatar: "/placeholder.svg?height=64&width=64" },
        { id: "t6", name: "Cemil Işık", role: "Front-end Geliştirici", avatar: "/placeholder.svg?height=64&width=64" },
      ],
      languages: ["Next.js", "Tailwind CSS", "Strapi"],
      features: [
        "Duyarlı Tasarım",
        "İçerik Yönetim Sistemi Entegrasyonu",
        "SEO Dostu Yapı",
        "Performans Optimizasyonu",
      ],
      documents: ["Site Haritası.pdf", "Tasarım Onayları.pptx"],
      liveUrl: "",
      githubUrl: "https://github.com/example/corporate-website",
      updatedAt: "2024-07-18",
    },
    {
      id: "5",
      name: "Siber Güvenlik Denetimi",
      description: "Şirket içi sistemlerin ve ağ altyapısının kapsamlı siber güvenlik denetimi ve zafiyet analizi.",
      category: "Güvenlik",
      status: "Beklemede",
      priority: "Yüksek",
      progress: 10,
      createdAt: "2024-07-01",
      deadline: "2024-08-31",
      budget: 50000,
      teamMembers: [
        {
          id: "t7",
          name: "Zeynep Çelik",
          role: "Siber Güvenlik Uzmanı",
          avatar: "/placeholder.svg?height=64&width=64",
        },
      ],
      languages: ["Nessus", "Wireshark", "Kali Linux"],
      features: ["Penetrasyon Testi", "Zafiyet Tarama", "Güvenlik Politikası Geliştirme", "Eğitim ve Farkındalık"],
      documents: ["Denetim Planı.pdf", "Risk Değerlendirme Raporu.xlsx"],
      liveUrl: "",
      githubUrl: "",
      updatedAt: "2024-07-05",
    },
  ],
  teamMembers: [
    {
      id: "t1",
      name: "Ayşe Yılmaz",
      email: "ayse.yilmaz@example.com",
      phone: "+90 532 111 2233",
      role: "Proje Yöneticisi",
      skills: ["Proje Yönetimi", "Ekip Liderliği", "Risk Yönetimi"],
      avatar: "/placeholder.svg?height=64&width=64",
      joinDate: "2020-03-10",
      projectCount: 3,
    },
    {
      id: "t2",
      name: "Can Demir",
      email: "can.demir@example.com",
      phone: "+90 543 222 3344",
      role: "Full-stack Geliştirici",
      skills: ["React", "Node.js", "MongoDB", "AWS"],
      avatar: "/placeholder.svg?height=64&width=64",
      joinDate: "2019-07-20",
      projectCount: 5,
    },
    {
      id: "t3",
      name: "Elif Kaya",
      email: "elif.kaya@example.com",
      phone: "+90 554 333 4455",
      role: "UI/UX Tasarımcı",
      skills: ["Figma", "Sketch", "Kullanıcı Araştırması", "Prototipleme"],
      avatar: "/placeholder.svg?height=64&width=64",
      joinDate: "2021-01-05",
      projectCount: 2,
    },
    {
      id: "t4",
      name: "Deniz Akın",
      email: "deniz.akin@example.com",
      phone: "+90 505 444 5566",
      role: "Mobil Geliştirici",
      skills: ["React Native", "Flutter", "Swift", "Kotlin"],
      avatar: "/placeholder.svg?height=64&width=64",
      joinDate: "2022-09-12",
      projectCount: 1,
    },
    {
      id: "t5",
      name: "Burak Can",
      email: "burak.can@example.com",
      phone: "+90 530 555 6677",
      role: "Veri Bilimci",
      skills: ["Python", "R", "Makine Öğrenimi", "Veri Görselleştirme"],
      avatar: "/placeholder.svg?height=64&width=64",
      joinDate: "2018-04-25",
      projectCount: 4,
    },
    {
      id: "t6",
      name: "Cemil Işık",
      email: "cemil.isik@example.com",
      phone: "+90 542 666 7788",
      role: "Front-end Geliştirici",
      skills: ["Next.js", "Tailwind CSS", "JavaScript", "HTML/CSS"],
      avatar: "/placeholder.svg?height=64&width=64",
      joinDate: "2023-02-18",
      projectCount: 2,
    },
    {
      id: "t7",
      name: "Zeynep Çelik",
      email: "zeynep.celik@example.com",
      phone: "+90 533 777 8899",
      role: "Siber Güvenlik Uzmanı",
      skills: ["Penetrasyon Testi", "Ağ Güvenliği", "Sızma Testi", "Adli Bilişim"],
      avatar: "/placeholder.svg?height=64&width=64",
      joinDate: "2021-11-01",
      projectCount: 1,
    },
  ],
  settings: {
    name: "Admin User",
    email: "admin@example.com",
    phone: "+90 555 123 4567",
    avatar: "/placeholder.svg?height=64&width=64",
    emailNotifications: true,
    pushNotifications: false,
    projectUpdates: true,
    teamUpdates: true,
    deadlineReminders: true,
    theme: "light",
    language: "tr",
    timezone: "Europe/Istanbul",
    twoFactorAuth: false,
    sessionTimeout: "30",
  },
}

let db: DbState = { ...initialData }

export function getDb(): DbState {
  return db
}

export function setDb(newDb: DbState) {
  db = newDb
}
