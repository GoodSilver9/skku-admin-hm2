"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

export function QuestionsTable({
  questions = [],
  isLoading,
  error,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  onStatusChange,
  onEdit,
  onDelete,
}) {
  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  if (questions.length === 0 && !isLoading) {
    return <div className="text-center py-4">질문이 없습니다</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">No.</TableHead>
              <TableHead>질문 ID</TableHead>
              <TableHead>제목</TableHead>
              <TableHead>작성자</TableHead>
              <TableHead>생성일</TableHead>
              <TableHead>수정일</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="w-[120px]">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Skeleton rows for loading state
              Array.from({ length: pagination.limit || 10 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-[120px]" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              questions.map((question, index) => (
                <TableRow key={question._id}>
                  <TableCell>
                    {(pagination.page - 1) * pagination.limit + index + 1}
                  </TableCell>
                  <TableCell className="font-medium">
                    {question.questionId}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/questions/edit/${question._id}`}
                      className="text-blue-500 hover:text-blue-600 hover:underline"
                    >
                      {question.title}
                    </Link>
                  </TableCell>
                  <TableCell>{question.authorId?.email || "알 수 없음"}</TableCell>
                  <TableCell>
                    {new Date(question.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(question.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <input
                          type="radio"
                          id={`active-${question._id}`}
                          name={`status-${question._id}`}
                          checked={question.status === "ACTIVE"}
                          onChange={() => onStatusChange(question._id, "ACTIVE", question.campusId.name)}
                          className="sr-only"
                        />
                        <label
                          htmlFor={`active-${question._id}`}
                          className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${question.status === "ACTIVE"
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                            }`}
                        >
                          활성
                        </label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <input
                          type="radio"
                          id={`inactive-${question._id}`}
                          name={`status-${question._id}`}
                          checked={question.status === "INACTIVE"}
                          onChange={() => onStatusChange(question._id, "INACTIVE", question.campusId.name)}
                          className="sr-only"
                        />
                        <label
                          htmlFor={`inactive-${question._id}`}
                          className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${question.status === "INACTIVE"
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                            }`}
                        >
                          비활성
                        </label>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(question._id, question.campusId.name)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(question._id, question.campusId.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Advanced Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            총 {pagination.total}개의 질문
          </span>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">페이지당</span>
          <Select
            value={pagination.limit.toString()}
            onValueChange={(value) => onRowsPerPageChange(parseInt(value))}
          >
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">개씩</span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            이전
          </Button>
          <Input
            type="number"
            min={1}
            max={pagination.pages}
            value={pagination.page}
            onChange={(e) => {
              const newPage = parseInt(e.target.value);
              if (newPage >= 1 && newPage <= pagination.pages) {
                onPageChange(newPage);
              }
            }}
            className="w-16 h-8 text-center"
          />
          <span className="text-sm">/ {pagination.pages} 페이지</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
