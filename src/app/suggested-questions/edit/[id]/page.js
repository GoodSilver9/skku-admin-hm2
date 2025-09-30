"use client"

import React, { useState, useEffect } from "react"
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

export default function EditSuggestedQuestionPage({ params }) {
  const router = useRouter()
  const awaitedParams = React.use(params)
  const [formData, setFormData] = useState({
    question: "",
    isActive: true
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchQuestion()
  }, [awaitedParams.id])

  const fetchQuestion = async () => {
    try {
      const response = await suggestedQuestionsAPI.getById(awaitedParams.id)
      if (response?.data?.data) {
        setFormData({
          question: response.data.data.question,
          isActive: response.data.data.isActive
        })
      } else {
        throw new Error("질문 상세 정보를 불러오는데 실패했습니다")
      }
    } catch (error) {
      console.error("Error fetching question:", error)
      
      if (error.response?.data) {
        const apiError = error.response.data
        if (apiError.message) {
          toast.error(apiError.message)
        } else {
          toast.error("질문 상세 정보를 불러오는데 실패했습니다")
        }
      } else if (error.message) {
        toast.error(error.message)
      } else {
        toast.error("예기치 않은 오류가 발생했습니다")
      }
      router.push("/suggested-questions")
    } finally {
      setIsLoading(false)
    }
  }

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
      const response = await suggestedQuestionsAPI.update(awaitedParams.id, formData)
      if (response?.data) {
        toast.success("질문이 성공적으로 수정되었습니다")
        router.push("/suggested-questions")
      } else {
        throw new Error("질문 수정에 실패했습니다")
      }
    } catch (error) {
      console.error("Error updating question:", error)
      
      if (error.response?.data) {
        const apiError = error.response.data
        if (apiError.message) {
          toast.error(apiError.message)
        } else {
          toast.error("질문 수정 중 오류가 발생했습니다")
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

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this suggested question?")) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await suggestedQuestionsAPI.delete(awaitedParams.id)
      if (response?.data) {
        toast.success("질문이 성공적으로 삭제되었습니다")
        router.push("/suggested-questions")
      } else {
        throw new Error("질문 삭제에 실패했습니다")
      }
    } catch (error) {
      console.error("Error deleting question:", error)
      
      if (error.response?.data) {
        const apiError = error.response.data
        if (apiError.message) {
          toast.error(apiError.message)
        } else {
          toast.error("질문 삭제에 실패했습니다")
        }
      } else if (error.message) {
        toast.error(error.message)
      } else {
        toast.error("예기치 않은 오류가 발생했습니다")
      }
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-full">
            <p>Loading...</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
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
                  <BreadcrumbPage>질문 수정</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Edit Suggested Question</h1>
          </div>
          <div className="mx-auto w-full max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    placeholder="Enter the suggested question"
                    value={formData.question}
                    onChange={(e) => handleChange("question", e.target.value)}
                    className="min-h-[100px]"
                  />
                  {errors.question && (
                    <p className="text-sm text-red-500">{errors.question}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="isActive">Status</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => handleChange("isActive", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="isActive" className="text-sm">
                      Active
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
                <div className="flex gap-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 