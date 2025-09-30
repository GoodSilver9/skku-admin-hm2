"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { authAPI } from "@/api"
import { toast } from "sonner"

export default function AccountPage() {
  const router = useRouter()
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    role: "",
    status: "",
    lastLogin: "",
    createdAt: "",
    updatedAt: ""
  })

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await authAPI.adminProfile()
      if (response?.data) {
        const user = response.data
        setUserData({
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        })
      } else {
        throw new Error("Failed to fetch user data")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      
      if (error.response?.data) {
        const apiError = error.response.data
        if (apiError.message) {
          toast.error(apiError.message)
        } else {
          toast.error("사용자 정보를 불러오는데 실패했습니다")
        }
      } else if (error.message) {
        toast.error(error.message)
      } else {
        toast.error("예기치 않은 오류가 발생했습니다")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const validateProfileForm = () => {
    const newErrors = {}

    if (!userData.name || userData.name.trim() === '') {
      newErrors.name = '이름은 필수 항목입니다'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePasswordForm = () => {
    const newErrors = {}

    if (!passwords.currentPassword) {
      newErrors.currentPassword = '현재 비밀번호를 입력해주세요'
    }

    if (!passwords.newPassword) {
      newErrors.newPassword = '새 비밀번호를 입력해주세요'
    } else if (passwords.newPassword.length < 6) {
      newErrors.newPassword = '비밀번호는 최소 6자 이상이어야 합니다'
    }

    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = '새 비밀번호를 다시 입력해주세요'
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()

    if (!validateProfileForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await authAPI.adminProfileUpdate({
        name: userData.name
      })
      
      if (response?.data) {
        toast.success("프로필이 성공적으로 수정되었습니다")
        fetchUserData()
      } else {
        throw new Error("프로필 수정에 실패했습니다")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      
      if (error.response?.data) {
        const apiError = error.response.data
        if (apiError.message) {
          toast.error(apiError.message)
        } else {
          toast.error("프로필 수정 중 오류가 발생했습니다")
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

  const handlePasswordChange = async (e) => {
    e.preventDefault()

    if (!validatePasswordForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await authAPI.adminProfileUpdate({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      })
      
      if (response?.data) {
        toast.success("비밀번호가 성공적으로 변경되었습니다")
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        })
      } else {
        throw new Error("비밀번호 변경에 실패했습니다")
      }
    } catch (error) {
      console.error("Error updating password:", error)
      
      if (error.response?.data) {
        const apiError = error.response.data
        if (apiError.message) {
          toast.error(apiError.message)
        } else {
          toast.error("비밀번호 변경 중 오류가 발생했습니다")
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

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-full">
            <p>로딩 중...</p>
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
                  <BreadcrumbPage>계정 설정</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">계정 설정</h1>
          </div>
          <div className="mx-auto w-full max-w-2xl space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>프로필 정보</CardTitle>
                <CardDescription>개인 정보를 업데이트하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">역할</Label>
                    <Input
                      id="role"
                      value={userData.role}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">상태</Label>
                    <Input
                      id="status"
                      value={userData.status}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="name">이름</Label>
                    <Input
                      id="name"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastLogin">마지막 로그인</Label>
                    <Input
                      id="lastLogin"
                      value={new Date(userData.lastLogin).toLocaleString()}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "업데이트 중..." : "프로필 업데이트"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>비밀번호 변경</CardTitle>
                <CardDescription>비밀번호를 업데이트하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="currentPassword">현재 비밀번호</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    />
                    {errors.currentPassword && (
                      <p className="text-sm text-red-500">{errors.currentPassword}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">새 비밀번호</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    />
                    {errors.newPassword && (
                      <p className="text-sm text-red-500">{errors.newPassword}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "업데이트 중..." : "비밀번호 변경"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 