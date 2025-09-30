"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { membersAPI } from "@/api";
import { toast } from "sonner";

export default function EditMemberPage({ params }) {
  const awaitedParams = React.use(params);
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "NORMAL_USER",
    status: "ACTIVE",
    password: "",
    isAdmin: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchMember();
  }, [awaitedParams.id]);

  const fetchMember = async () => {
    try {
      const response = await membersAPI.getById(awaitedParams.id);
      if (response?.data?.user) {
        const member = response.data.user;
        setFormData({
          email: member.email,
          name: member.name,
          role: member.role,
          status: member.status,
          password: "",
          isAdmin:
            member.role === "MASTER_ADMIN" || member.role === "SUB_ADMIN",
        });
      } else {
        throw new Error("Failed to fetch member");
      }
    } catch (error) {
      console.error("Error fetching member:", error);

      if (error.response?.data) {
        const apiError = error.response.data;
        if (apiError.message) {
          toast.error(apiError.message);
        } else {
          toast.error("멤버 상세 정보를 불러오는데 실패했습니다");
        }
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("예기치 않은 오류가 발생했습니다");
      }
      router.push("/members");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.name && formData.name.trim() === "") {
      newErrors.name = "이름은 비어있을 수 없습니다";
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "비밀번호는 최소 6자 이상이어야 합니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Only send fields that have values
      const dataToSend = {};
      if (formData.name) dataToSend.name = formData.name;
      if (formData.role) dataToSend.role = formData.role;
      if (formData.status) dataToSend.status = formData.status;
      if (formData.password) dataToSend.password = formData.password;

      const response = await membersAPI.update(awaitedParams.id, dataToSend);

      if (response?.data?.user) {
        toast.success("멤버 정보가 성공적으로 수정되었습니다");
        router.push("/members");
      } else {
        throw new Error("멤버 정보 수정에 실패했습니다");
      }
    } catch (error) {
      console.error("Error updating member:", error);

      if (error.response?.data) {
        const apiError = error.response.data;
        if (apiError.message) {
          toast.error(apiError.message);
        } else {
          toast.error("멤버 정보 수정 중 오류가 발생했습니다");
        }
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("예기치 않은 오류가 발생했습니다");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "이 멤버를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await membersAPI.delete(awaitedParams.id);
      if (response?.data) {
        toast.success("멤버가 성공적으로 삭제되었습니다");
        router.push("/members");
      } else {
        throw new Error("멤버 삭제에 실패했습니다");
      }
    } catch (error) {
      console.error("Error deleting member:", error);

      if (error.response?.data) {
        const apiError = error.response.data;
        if (apiError.message) {
          toast.error(apiError.message);
        } else {
          toast.error("멤버 삭제에 실패했습니다");
        }
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("예기치 않은 오류가 발생했습니다");
      }
    } finally {
      setIsDeleting(false);
    }
  };

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
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/members">사용자 관리</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>사용자 수정</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">사용자 수정</h1>
          </div>
          <div className="mx-auto w-full max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="이메일 주소를 입력하세요"
                    value={formData.email}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="전체 이름을 입력하세요"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">비밀번호</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="현재 비밀번호를 유지하려면 비워두세요"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="role">역할</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleChange("role", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="역할 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MASTER_ADMIN">마스터 관리자</SelectItem>
                      <SelectItem value="SUB_ADMIN">서브 관리자</SelectItem>
                      <SelectItem value="NORMAL_USER">일반 사용자</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="status">상태</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">활성</SelectItem>
                      <SelectItem value="INACTIVE">비활성</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="isAdmin">관리자 상태</Label>
                  <Input
                    id="isAdmin"
                    type="text"
                    value={formData.isAdmin ? "예" : "아니오"}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "삭제 중..." : "삭제"}
                </Button>
                <div className="flex gap-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "수정 중..." : "수정"}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => window.history.back()}
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
  );
}
