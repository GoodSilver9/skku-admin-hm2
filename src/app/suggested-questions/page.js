"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SuggestedQuestionsTable } from "@/components/suggested-questions-table"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Plus } from "lucide-react"

export default function SuggestedQuestionsPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isActive, setIsActive] = useState(null)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchQuestions()
  }, [isActive, pagination.page, pagination.limit])

  const fetchQuestions = async () => {
    try {
      setIsLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      }
      
      if (isActive !== null) {
        params.isActive = isActive
      }
      
      const response = await suggestedQuestionsAPI.getAll(params)
      
      if (response?.data?.data) {
        setQuestions(response.data.data)
        const total = response.data.total || response.data.data.length
        const pages = Math.ceil(total / pagination.limit)
        setPagination(prev => ({
          ...prev,
          total,
          pages
        }))
      }
    } catch (error) {
      console.error("Error fetching questions:", error)
      setError("시작 질문을 불러오는데 실패했습니다")
      toast.error("시작 질문을 불러오는데 실패했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = (value) => {
    if (value === "all") {
      setIsActive(null)
    } else {
      setIsActive(value === "true")
    }
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const handleRowsPerPageChange = (newLimit) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }))
  }

  const handleEdit = (id) => {
    router.push(`/suggested-questions/edit/${id}`)
  }

  const handleDelete = async (id) => {
    if (!confirm("이 시작 질문을 삭제하시겠습니까?")) {
      return
    }

    try {
      const response = await suggestedQuestionsAPI.delete(id)
      if (response?.data) {
        toast.success("시작 질문이 성공적으로 삭제되었습니다")
        fetchQuestions()
      }
    } catch (error) {
      console.error("Error deleting question:", error)
      toast.error("시작 질문 삭제에 실패했습니다")
    }
  }

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const response = await suggestedQuestionsAPI.updateStatus(id, !currentStatus)
      if (response?.data) {
        toast.success(`질문이 ${!currentStatus ? "활성화" : "비활성화"}되었습니다`)
        setQuestions(prevQuestions => 
          prevQuestions.map(question => 
            question._id === id 
              ? { ...question, isActive: !currentStatus }
              : question
          )
        )
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("질문 상태 업데이트에 실패했습니다")
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
                  <BreadcrumbPage>시작 질문</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">시작 질문</h1>
            <div className="flex items-center gap-4">
              <Select value={isActive === null ? "all" : isActive.toString()} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="true">활성</SelectItem>
                  <SelectItem value="false">비활성</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => router.push("/suggested-questions/add")}>
                <Plus className="mr-2 h-4 w-4" />
                질문 추가
              </Button>
            </div>
          </div>

          <SuggestedQuestionsTable
            questions={questions}
            isLoading={isLoading}
            error={error}
            pagination={pagination}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onStatusToggle={handleStatusToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 