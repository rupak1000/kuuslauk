"use client"

import type React from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, LinkIcon, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
}

export function ImageUpload({ value, onChange, label = "Image", placeholder = "food dish" }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(value || "")
  const [uploadMode, setUploadMode] = useState<"upload" | "url">("upload")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size must be less than 10MB")
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }

      const data = await response.json()
      setPreview(data.url)
      onChange(data.url)
    } catch (error) {
      console.error("Upload error:", error)
      setUploadError(error instanceof Error ? error.message : "Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlChange = (url: string) => {
    setPreview(url)
    onChange(url)
    setUploadError(null)
  }

  const handleClear = () => {
    setPreview("")
    onChange("")
    setUploadError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-3">
      <Label className="text-gray-900 font-semibold">{label}</Label>

      <Tabs value={uploadMode} onValueChange={(v) => setUploadMode(v as "upload" | "url")} className="w-full">
        <TabsList className="bg-gray-100 w-full">
          <TabsTrigger
            value="upload"
            className="flex-1 text-gray-700 data-[state=active]:bg-amber-500 data-[state=active]:text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </TabsTrigger>
          <TabsTrigger
            value="url"
            className="flex-1 text-gray-700 data-[state=active]:bg-amber-500 data-[state=active]:text-white"
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-3">
          <div className="flex flex-col gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
              disabled={isUploading}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="border-gray-300 text-gray-700 hover:bg-gray-100 bg-white w-full"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading to Cloudinary...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Image File
                </>
              )}
            </Button>
            {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
            <p className="text-xs text-gray-500">Supports JPG, PNG, WebP, GIF. Max 10MB. Uploaded to Cloudinary.</p>
          </div>
        </TabsContent>

        <TabsContent value="url" className="mt-3">
          <Input
            placeholder={`/your-image.jpg or https://...`}
            value={value.startsWith("data:") ? "" : value}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="bg-white border-gray-300 text-gray-900"
          />
          <p className="text-xs text-gray-500 mt-2">Enter a direct image URL or Cloudinary URL.</p>
        </TabsContent>
      </Tabs>

      {/* Preview */}
      {preview && (
        <div className="relative mt-3">
          <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-300">
            <Image
              src={preview || `/placeholder.svg?height=128&width=256&query=${encodeURIComponent(placeholder)}`}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 w-6 h-6"
            onClick={handleClear}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
