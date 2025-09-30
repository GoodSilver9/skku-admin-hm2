"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { CampusesTable } from "@/components/campuses-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Plus } from "lucide-react";
import { campusesAPI } from "@/api";
import { toast } from "sonner";

export default function CampusPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("All");
  const [campuses, setCampuses] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCampuses();
  }, [searchTerm, status, pagination.page, pagination.limit]);

  const fetchCampuses = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
      };

      // Only add status filter if not "All"
      if (status !== "All") {
        params.status = status;
      }

      const response = await campusesAPI.getAll(params);

      setCampuses(response.data.campuses);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(
        err.response?.data?.message || "캠퍼스 목록을 불러오는데 실패했습니다"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleRowsPerPageChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleStatusUpdate = async (campusId, newStatus) => {
    try {
      await campusesAPI.update(campusId, { status: newStatus });
      // 로컬 상태만 업데이트하여 페이지 새로고침 방지
      setCampuses((prevCampuses) =>
        prevCampuses.map((campus) =>
          campus._id === campusId ? { ...campus, status: newStatus } : campus
        )
      );
      toast.success("캠퍼스 상태가 업데이트되었습니다");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "캠퍼스 상태를 업데이트하는데 실패했습니다"
      );
    }
  };

  const handleSetDefault = async (campusId) => {
    try {
      await campusesAPI.setDefault(campusId);
      // Refresh the list to update default status
      fetchCampuses();
      toast.success("기본 캠퍼스가 설정되었습니다");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "기본 캠퍼스 설정에 실패했습니다"
      );
    }
  };

  const handleEdit = (campusId) => {
    router.push(`/campuses/edit/${campusId}`);
  };

  const handleDelete = async (campusId) => {
    if (confirm("정말로 이 캠퍼스를 삭제하시겠습니까?")) {
      try {
        await campusesAPI.delete(campusId);
        // 삭제 후 목록 새로고침
        fetchCampuses();
        toast.success("캠퍼스가 삭제되었습니다");
      } catch (err) {
        toast.error(
          err.response?.data?.message || "캠퍼스 삭제에 실패했습니다"
        );
      }
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
                  <BreadcrumbPage>캠퍼스 목록</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h1 className="text-2xl font-bold">캠퍼스 목록</h1>
            <div className="flex items-center flex-wrap gap-4">
              <div className="flex gap-2 flex-wrap">
                <Input
                  type="text"
                  placeholder="캠퍼스 검색..."
                  className="w-[200px]"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">모든 상태</SelectItem>
                    <SelectItem value="ACTIVE">활성</SelectItem>
                    <SelectItem value="INACTIVE">비활성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => router.push("/campuses/add")}>
                <Plus className="mr-2 h-4 w-4" />
                캠퍼스 추가
              </Button>
            </div>
          </div>
          <CampusesTable
            campuses={campuses}
            isLoading={isLoading}
            error={error}
            pagination={pagination}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onStatusChange={handleStatusUpdate}
            onSetDefault={handleSetDefault}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
