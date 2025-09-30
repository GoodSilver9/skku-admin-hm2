"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { campusesAPI } from "@/api";
import { toast } from "sonner";

export default function AddCampusPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    status: "ACTIVE",
    isDefault: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "캠퍼스명은 필요합니다";
    } else if (formData.name.length < 2 || formData.name.length > 50) {
      newErrors.name = "캠퍼스명은 2에서 50 사이여야 합니다";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.name)) {
      newErrors.name =
        "캠퍼스명은 영문자, 숫자, 하이픈, 언더스코어만 사용할 수 있습니다";
    }

    if (!formData.displayName || formData.displayName.trim() === "") {
      newErrors.displayName = "표시명은 필요합니다";
    } else if (
      formData.displayName.length < 2 ||
      formData.displayName.length > 100
    ) {
      newErrors.displayName = "표시명은 2에서 100 사이여야 합니다";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "설명은 500자를 초과할 수 없습니다";
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
      const dataToSend = {
        name: formData.name,
        displayName: formData.displayName,
        description: formData.description || "",
        status: formData.status,
        isDefault: formData.isDefault,
      };

      const response = await campusesAPI.create(dataToSend);

      if (response?.data) {
        toast.success("캠퍼스가 성공적으로 생성되었습니다");
        router.push("/campuses");
      } else {
        throw new Error("캠퍼스 생성에 실패했습니다");
      }
    } catch (error) {
      console.error("Error creating campus:", error);

      if (error.response?.data) {
        const apiError = error.response.data;
        if (apiError.message) {
          toast.error(apiError.message);
        } else {
          toast.error("캠퍼스 생성 중 오류가 발생했습니다");
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
                  <BreadcrumbLink href="/campuses">캠퍼스 관리</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>새 캠퍼스 등록</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">새 캠퍼스 등록</h1>
          </div>
          <div className="mx-auto w-full max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">캠퍼스명 *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="캠퍼스명을 입력하세요 (영문자, 숫자, 하이픈, 언더스코어만 사용 가능)"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    컬렉션명은 자동으로 &quot;qa_{formData.name || "campusname"}
                    &quot;으로 생성됩니다
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="displayName">표시명 *</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="사용자에게 표시될 캠퍼스명을 입력하세요"
                    value={formData.displayName}
                    onChange={(e) =>
                      handleChange("displayName", e.target.value)
                    }
                  />
                  {errors.displayName && (
                    <p className="text-sm text-red-500">{errors.displayName}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">설명</Label>
                  <Textarea
                    id="description"
                    placeholder="캠퍼스에 대한 설명을 입력하세요 (선택사항)"
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    className="min-h-[100px]"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  )}
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
                  <Label htmlFor="isDefault">기본 캠퍼스 설정</Label>
                  <Select
                    value={formData.isDefault.toString()}
                    onValueChange={(value) =>
                      handleChange("isDefault", value === "true")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="기본 캠퍼스 여부 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">아니오</SelectItem>
                      <SelectItem value="true">
                        예 (기본 캠퍼스로 설정)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    기본 캠퍼스로 설정하면 다른 캠퍼스의 기본 설정이 해제됩니다
                  </p>
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "등록 중..." : "캠퍼스 등록"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => window.history.back()}
                >
                  취소
                </Button>
              </div>
            </form>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
