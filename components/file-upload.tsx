"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, XCircle, CheckCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface UploadedFile {
  id: string
  name: string
  size: number
  status: "uploading" | "completed" | "failed"
  progress: number
}

export function FileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  let nextFileId = 1

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    if (selectedFiles.length === 0) return

    const newFiles: UploadedFile[] = selectedFiles.map((file) => ({
      id: `file-${nextFileId++}`,
      name: file.name,
      size: file.size,
      status: "uploading",
      progress: 0,
    }))

    setFiles((prevFiles) => [...prevFiles, ...newFiles])

    newFiles.forEach((file) => {
      simulateUpload(file)
    })
  }

  const simulateUpload = (fileToUpload: UploadedFile) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      if (progress >= 100) {
        clearInterval(interval)
        setFiles((prevFiles) =>
          prevFiles.map((f) => (f.id === fileToUpload.id ? { ...f, status: "completed", progress: 100 } : f)),
        )
        toast.success("Yükleme Başarılı", {
          description: `${fileToUpload.name} başarıyla yüklendi.`,
        })
      } else {
        setFiles((prevFiles) => prevFiles.map((f) => (f.id === fileToUpload.id ? { ...f, progress: progress } : f)))
      }
    }, 100) // Her 100ms'de %10 ilerleme
  }

  const handleRemoveFile = (id: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id))
    toast.info("Dosya Kaldırıldı", {
      description: "Dosya listeden kaldırıldı.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Dosya Yükle
        </CardTitle>
        <CardDescription>Projenizle ilgili dosyaları buraya yükleyin.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <Label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Dosyaları buraya sürükle bırak</span> veya tıkla
              </p>
              <p className="text-xs text-muted-foreground">PDF, DOCX, JPG, PNG (Maks. 10MB)</p>
            </div>
            <Input id="file-upload" type="file" className="hidden" multiple onChange={handleFileChange} />
          </Label>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Yüklenen Dosyalar</h3>
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  {file.status === "uploading" && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                  {file.status === "completed" && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {file.status === "failed" && <XCircle className="w-5 h-5 text-red-500" />}
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveFile(file.id)}>
                  <XCircle className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
