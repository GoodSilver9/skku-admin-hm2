"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { suggestedQuestionsAPI } from "@/api"
import { toast } from "sonner"

export default function AddSuggestedQuestionPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    question: "",
    isActive: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.question.trim()) {
      newErrors.question = "Question is required"
    } else if (formData.question.length < 5) {
      newErrors.question = "Question must be at least 5 characters long"
    } else if (formData.question.length > 500) {
      newErrors.question = "Question must not exceed 500 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await suggestedQuestionsAPI.create(formData)
      if (response?.data) {
        toast.success("질문이 성공적으로 생성되었습니다")
        router.push("/suggested-questions")
      } else {
        throw new Error("질문 생성에 실패했습니다")
      }
    } catch (error) {
      console.error("Error creating question:", error)
      
      if (error.response?.data) {
        const apiError = error.response.data
        if (apiError.message) {
          toast.error(apiError.message)
        } else {
          toast.error("질문 생성 중 오류가 발생했습니다")
        }
      } else if (error.message) {
        toast.error(error.message)
      } else {
        toast.error("예기치 않은 오류가 발생했습니다")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/suggested-questions">시작 질문</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>질문 등록</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">시작 질문 등록</h1>
          </div>
          <div className="mx-auto w-full max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="question">질문</Label>
                  <Textarea
                    id="question"
                    placeholder="제안할 질문을 입력하세요"
                    value={formData.question}
                    onChange={(e) => handleChange("question", e.target.value)}
                    className="min-h-[100px]"
                  />
                  {errors.question && (
                    <p className="text-sm text-red-500">{errors.question}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="isActive">상태</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => handleChange("isActive", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="isActive" className="text-sm">
                      활성
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 