"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

const members = [
  {
    email: "john@googl.com",
    name: "john",
    role: "Master Admin",
    status: "ACTIVE",
    joinedAt: "2025/04/13/16:30",
  },
  {
    email: "abc@googl.com",
    name: "abc",
    role: "Sub Admin",
    status: "ACTIVE",
    joinedAt: "2025/04/14/06:10",
  },
  {
    email: "2131@googl.com",
    name: "2131",
    role: "Sub Admin",
    status: "Inactive",
    joinedAt: "2025/02/13/11:20",
  },
  {
    email: "cxwqc@googl.com",
    name: "cxwqc",
    role: "Normal User",
    status: "ACTIVE",
    joinedAt: "2025/04/13/11:20",
  },
  {
    email: "13dff@googl.com",
    name: "13dff",
    role: "Normal User",
    status: "Inactive",
    joinedAt: "2025/04/13/10:30",
  },
];

export function MembersTable({ 
  members = [], 
  isLoading, 
  error, 
  onEdit,
  onDelete,
  pagination,
  onPageChange,
  onRowsPerPageChange
}) {
  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  if (members.length === 0 && !isLoading) {
    return <div className="text-center py-4">멤버가 없습니다</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">No.</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>역할</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>마지막 로그인</TableHead>
              <TableHead>가입일</TableHead>
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
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
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
              members.map((member, index) => (
                <TableRow key={member._id}>
                  <TableCell>
                    {(pagination.page - 1) * pagination.limit + index + 1}
                  </TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <input
                          type="radio"
                          id={`active-${member._id}`}
                          name={`status-${member._id}`}
                          checked={member.status === "ACTIVE"}
                          disabled
                          className="sr-only"
                        />
                        <label
                          htmlFor={`active-${member._id}`}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            member.status === "ACTIVE"
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : 'bg-gray-100 text-gray-600 border border-gray-300'
                          }`}
                        >
                          활성
                        </label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <input
                          type="radio"
                          id={`inactive-${member._id}`}
                          name={`status-${member._id}`}
                          checked={member.status === "INACTIVE"}
                          disabled
                          className="sr-only"
                        />
                        <label
                          htmlFor={`inactive-${member._id}`}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            member.status === "INACTIVE"
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-gray-100 text-gray-600 border border-gray-300'
                          }`}
                        >
                          비활성
                        </label>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {member.lastLogin 
                      ? new Date(member.lastLogin).toLocaleString()
                      : "없음"}
                  </TableCell>
                  <TableCell>
                    {new Date(member.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(member._id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(member._id)}
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
            총 {pagination.total}명의 회원
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
          <span className="text-sm text-muted-foreground">명씩</span>
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
