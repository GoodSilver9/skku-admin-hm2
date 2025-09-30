"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

export function ImageUpload({ images = [], onChange, maxImages = 30, maxSize = 5 }) {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const validFiles = files.filter(file => {
      // Check file size (5MB)
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB`)
        return false
      }
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert(`File ${file.name} is not an image`)
        return false
      }
      return true
    })

    if (images.length + validFiles.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`)
      return
    }

    // Create preview URLs for valid files
    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }))

    onChange([...images, ...newImages])
  }

  const removeImage = (index) => {
    const newImages = [...images]
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(newImages[index].preview)
    newImages.splice(index, 1)
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image.preview}
              alt={image.name}
              className="w-full h-32 object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeImage(index)}
            >
              <X className="h-4 w-4" />
            </Button>
            <p className="text-xs mt-1 truncate">{image.name}</p>
          </div>
        ))}
        {images.length < maxImages && (
          <div className="border-2 border-dashed rounded-lg flex items-center justify-center h-32">
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="text-center p-4">
              <p className="text-sm text-muted-foreground">Click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">Max {maxSize}MB per image</p>
            </div>
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        {images.length} of {maxImages} images uploaded
      </p>
    </div>
  )
} 