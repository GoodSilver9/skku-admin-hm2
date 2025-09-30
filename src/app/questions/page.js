"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { QuestionsTable } from "@/components/questions-table";
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
import { questionsAPI, campusesAPI } from "@/api";

export default function QuestionsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [authorId, setAuthorId] = useState("All");
  const [status, setStatus] = useState("All");
  const [campusId, setCampusId] = useState("All");
  const [questions, setQuestions] = useState([]);
  const [authors, setAuthors] = useState([]);
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
    fetchQuestions();
    fetchAuthors();
    fetchCampuses();
  }, [
    searchTerm,
    authorId,
    status,
    campusId,
    pagination.page,
    pagination.limit,
  ]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
      };

      // Only add author filter if not "All"
      if (authorId !== "All") {
        params.authorId = authorId;
      }

      // Only add status filter if not "All"
      if (status !== "All") {
        params.status = status;
      }

      // Only add campus filter if not "All"
      if (campusId !== "All") {
        params.campusId = campusId;
      }

      const response = await questionsAPI.getAll(params);
      setQuestions(response.data.questions);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(
        err.response?.data?.message || "질문 목록을 불러오는데 실패했습니다"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await questionsAPI.getAuthors();
      setAuthors(response.data.authors);
    } catch (err) {
      console.error("작성자 목록을 불러오는데 실패했습니다:", err);
      setError(
        err.response?.data?.message || "작성자 목록을 불러오는데 실패했습니다"
      );
    }
  };

  const fetchCampuses = async () => {
    try {
      const response = await campusesAPI.getAll({ status: "ACTIVE" });
      setCampuses(response.data.campuses);
    } catch (err) {
      console.error("캠퍼스 목록을 불러오는데 실패했습니다:", err);
      setError(
        err.response?.data?.message || "캠퍼스 목록을 불러오는데 실패했습니다"
      );
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleAuthorChange = (value) => {
    setAuthorId(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleCampusChange = (value) => {
    setCampusId(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleRowsPerPageChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleStatusUpdate = async (questionId, newStatus, campusName) => {
    try {
      await questionsAPI.updateStatus(
        questionId,
        { status: newStatus },
        campusName
      );
      // 로컬 상태만 업데이트하여 페이지 새로고침 방지
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question._id === questionId
            ? { ...question, status: newStatus }
            : question
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "질문 상태를 업데이트하는데 실패했습니다"
      );
    }
  };

  const handleEdit = (questionId, campusName) => {
    router.push(`/questions/edit/${questionId}?campusName=${campusName}`);
  };

  const handleDelete = async (questionId, campusName) => {
    if (confirm("정말로 이 질문을 삭제하시겠습니까?")) {
      try {
        await questionsAPI.delete(questionId, campusName);
        // 삭제 후 목록 새로고침
        fetchQuestions();
      } catch (err) {
        alert(err.response?.data?.message || "질문 삭제에 실패했습니다");
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
                  <BreadcrumbLink href="/questions">질문 관리</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>질문 목록</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h1 className="text-2xl font-bold">질문 목록</h1>
            <div className="flex items-center flex-wrap gap-4">
              <div className="flex gap-2 flex-wrap">
                <Input
                  type="text"
                  placeholder="질문 검색..."
                  className="w-[200px]"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Select value={authorId} onValueChange={handleAuthorChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="작성자 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">모든 작성자</SelectItem>
                    {authors.map((author, index) => (
                      <SelectItem key={index} value={author.id}>
                        {author.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Select value={campusId} onValueChange={handleCampusChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="캠퍼스 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">모든 캠퍼스</SelectItem>
                    {campuses.map((campus) => (
                      <SelectItem key={campus._id} value={campus._id}>
                        {campus.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => router.push("/questions/add")}>
                <Plus className="mr-2 h-4 w-4" />
                질문 추가
              </Button>
            </div>
          </div>
          <QuestionsTable
            questions={questions}
            isLoading={isLoading}
            error={error}
            pagination={pagination}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onStatusChange={handleStatusUpdate}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
