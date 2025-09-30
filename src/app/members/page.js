"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { MembersTable } from "@/components/members-table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Plus } from "lucide-react"
import { membersAPI } from "@/api"

export default function MembersPage() {
  const router = useRouter()
  const [role, setRole] = useState("All")
  const [status, setStatus] = useState("All")
  const [members, setMembers] = useState([])
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMembers()
  }, [role, status, pagination.page, pagination.limit])

  const fetchMembers = async () => {
    try {
      setIsLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit
      }

      // Only add role filter if not "All"
      if (role !== "All") {
        params.role = role === "Master Admin" ? "MASTER_ADMIN" : 
                    role === "Sub Admin" ? "SUB_ADMIN" : "NORMAL_USER"
      }

      // Only add status filter if not "All"
      if (status !== "All") {
        params.status = status
      }

      const response = await membersAPI.getAll(params)
      setMembers(response.data.users)
      setPagination(response.data.pagination)
    } catch (err) {
      setError(err.response?.data?.message || "멤버 목록을 불러오는데 실패했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (userId) => {
    router.push(`/members/edit/${userId}`)
  }

  const handleDelete = async (userId) => {
    if (confirm("정말로 이 멤버를 삭제하시겠습니까?")) {
      try {
        await membersAPI.delete(userId)
        // 삭제 후 목록 새로고침
        fetchMembers()
      } catch (err) {
        alert(err.response?.data?.message || "멤버 삭제에 실패했습니다")
      }
    }
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const handleRowsPerPageChange = (newLimit) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }))
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
                  <BreadcrumbLink href="/members">사용자 관리</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>사용자 목록</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h1 className="text-2xl font-bold">사용자 목록</h1>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex gap-2 flex-wrap">
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="역할 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">모든 역할</SelectItem>
                    <SelectItem value="Master Admin">마스터 관리자</SelectItem>
                    <SelectItem value="Sub Admin">서브 관리자</SelectItem>
                    <SelectItem value="Normal User">일반 사용자</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">모든 상태</SelectItem>
                    <SelectItem value="ACTIVE">활성</SelectItem>
                    <SelectItem value="INACTIVE">비활성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => router.push("/members/add")}>
                <Plus className="mr-2 h-4 w-4" />
                멤버 추가
              </Button>
            </div>
          </div>
          <MembersTable 
            members={members} 
            isLoading={isLoading} 
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pagination={pagination}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 