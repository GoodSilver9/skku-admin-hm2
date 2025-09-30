"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
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
import { questionsAPI, uploadAPI, campusesAPI } from "@/api";
import { toast } from "sonner";
import { X } from "lucide-react";

export default function AddQuestionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    status: "ACTIVE",
    campusId: "",
    imageIds: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [campuses, setCampuses] = useState([]);
  const [isLoadingCampuses, setIsLoadingCampuses] = useState(true);

  useEffect(() => {
    fetchCampuses();
  }, []);

  const fetchCampuses = async () => {
    try {
      const response = await campusesAPI.getAll({ status: "ACTIVE" });
      setCampuses(response.data.campuses);
    } catch (err) {
      console.error("캠퍼스 목록을 불러오는데 실패했습니다:", err);
      toast.error("캠퍼스 목록을 불러오는데 실패했습니다");
    } finally {
      setIsLoadingCampuses(false);
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const totalImages = uploadedImages.length + acceptedFiles.length;
      if (totalImages > 5) {
        toast.error(
          `최대 5개의 이미지만 허용됩니다. 이미 ${uploadedImages.length}개의 이미지가 있고 ${acceptedFiles.length}개를 추가하려고 합니다.`
        );
        return;
      }

      setIsUploading(true);
      try {
        const uploadPromises = acceptedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("image", file);

          const response = await uploadAPI.upload(formData);
          return response.data.data.imageId;
        });

        const newImageIds = await Promise.all(uploadPromises);
        setFormData((prev) => ({
          ...prev,
          imageIds: [...prev.imageIds, ...newImageIds],
        }));
        setUploadedImages((prev) => [...prev, ...acceptedFiles]);
        toast.success(
          `성공적으로 ${acceptedFiles.length}개의 이미지${
            acceptedFiles.length > 1 ? "들" : ""
          } 업로드됨`
        );
      } catch (error) {
        console.error("Error uploading images:", error);
        toast.error("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
      } finally {
        setIsUploading(false);
      }
    },
    [uploadedImages.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: 5 - uploadedImages.length,
    onDropRejected: (rejectedFiles) => {
      const totalImages = uploadedImages.length + rejectedFiles.length;
      if (totalImages > 5) {
        toast.error(
          `최대 5개의 이미지만 허용됩니다. 이미 ${uploadedImages.length}개의 이미지가 있습니다.`
        );
      } else {
        toast.error(
          "일부 파일이 거부되었습니다. 파일 유형을 확인하고 다시 시도하세요."
        );
      }
    },
  });

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageIds: prev.imageIds.filter((_, i) => i !== index),
    }));
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title || formData.title.trim() === "") {
      newErrors.title = "제목은 필요합니다";
    } else if (formData.title.length < 5 || formData.title.length > 200) {
      newErrors.title = "제목은 5에서 200 사이여야 합니다";
    }

    if (!formData.content || formData.content.trim() === "") {
      newErrors.content = "내용은 필요합니다";
    } else if (formData.content.length < 10) {
      newErrors.content = "내용은 최소 10자 이상이어야 합니다";
    }

    if (!formData.campusId || formData.campusId === "") {
      newErrors.campusId = "캠퍼스를 선택해주세요";
    }

    if (formData.tags) {
      const tags = formData.tags.split(",").map((tag) => tag.trim());
      if (tags.some((tag) => tag.length > 50)) {
        newErrors.tags = "각 태그는 50자를 초과할 수 없습니다";
      }
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
        title: formData.title,
        content: formData.content,
        status: formData.status,
        campusId: formData.campusId,
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
        imageIds: formData.imageIds,
      };

      const response = await questionsAPI.create(dataToSend);

      if (response?.data?.questionId) {
        toast.success("질문이 성공적으로 생성되었습니다");
        router.push("/questions");
      } else {
        throw new Error("질문 생성에 실패했습니다");
      }
    } catch (error) {
      console.error("Error creating question:", error);

      if (error.response?.data) {
        const apiError = error.response.data;
        if (apiError.message) {
          toast.error(apiError.message);
        } else {
          toast.error("질문 생성 중 오류가 발생했습니다");
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
                  <BreadcrumbLink href="/questions">질문 관리</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>새 질문 등록</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">새 질문 등록</h1>
          </div>
          <div className="mx-auto w-full max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="title">제목</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="질문 제목을 입력하세요"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="content">내용</Label>
                  <Textarea
                    id="content"
                    placeholder="질문 내용을 입력하세요"
                    value={formData.content}
                    onChange={(e) => handleChange("content", e.target.value)}
                    className="min-h-[200px]"
                  />
                  {errors.content && (
                    <p className="text-sm text-red-500">{errors.content}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tags">태그</Label>
                  <Input
                    id="tags"
                    type="text"
                    placeholder="쉼표로 구분하여 태그를 입력하세요"
                    value={formData.tags}
                    onChange={(e) => handleChange("tags", e.target.value)}
                  />
                  {errors.tags && (
                    <p className="text-sm text-red-500">{errors.tags}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="campusId">캠퍼스 *</Label>
                  <Select
                    value={formData.campusId}
                    onValueChange={(value) => handleChange("campusId", value)}
                    disabled={isLoadingCampuses}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoadingCampuses
                            ? "캠퍼스 로딩 중..."
                            : "캠퍼스를 선택하세요"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {campuses.map((campus) => (
                        <SelectItem key={campus._id} value={campus._id}>
                          {campus.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.campusId && (
                    <p className="text-sm text-red-500">{errors.campusId}</p>
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
                  <Label>이미지 (최대 5개)</Label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
                      isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25"
                    }`}
                  >
                    <input {...getInputProps()} />
                    {isUploading ? (
                      <p>업로드 중...</p>
                    ) : isDragActive ? (
                      <p>여기에 이미지를 놓으세요...</p>
                    ) : (
                      <p>이미지를 여기에 끌어다 놓거나 클릭하여 선택하세요</p>
                    )}
                  </div>
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {uploadedImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`업로드된 이미지 ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <Button type="submit" disabled={isSubmitting || isUploading}>
                  {isSubmitting ? "등록 중..." : "질문 등록"}
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
