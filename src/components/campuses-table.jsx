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
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Star, StarOff } from "lucide-react";
import Link from "next/link";

export function CampusesTable({
    campuses = [],
    isLoading,
    error,
    pagination,
    onPageChange,
    onRowsPerPageChange,
    onStatusChange,
    onSetDefault,
    onEdit,
    onDelete,
}) {
    if (error) {
        return <div className="text-center text-red-500 py-4">{error}</div>;
    }

    if (campuses.length === 0 && !isLoading) {
        return <div className="text-center py-4">캠퍼스가 없습니다</div>;
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60px]">No.</TableHead>
                            <TableHead>캠퍼스명</TableHead>
                            <TableHead>표시명</TableHead>
                            <TableHead>컬렉션명</TableHead>
                            <TableHead>설명</TableHead>
                            <TableHead>상태</TableHead>
                            <TableHead>기본</TableHead>
                            <TableHead>생성일</TableHead>
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
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-32" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-48" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-8 w-[100px]" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-8 w-[80px]" />
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
                            campuses.map((campus, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {(pagination.page - 1) * pagination.limit + index + 1}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <Link
                                            href={`/campuses/edit/${campus._id}`}
                                            className="text-blue-500 hover:text-blue-600 hover:underline"
                                        >
                                            {campus.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{campus.displayName}</TableCell>
                                    <TableCell>
                                        <code className="text-xs text-black bg-gray-100 px-2 py-1 rounded">
                                            {campus.collectionName}
                                        </code>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                        {campus.description || "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <div className="flex items-center space-x-1">
                                                <input
                                                    type="radio"
                                                    id={`active-${campus._id}`}
                                                    name={`status-${campus._id}`}
                                                    checked={campus.status === "ACTIVE"}
                                                    onChange={() => onStatusChange(campus._id, "ACTIVE")}
                                                    className="sr-only"
                                                />
                                                <label
                                                    htmlFor={`active-${campus._id}`}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${campus.status === "ACTIVE"
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
                                                    id={`inactive-${campus._id}`}
                                                    name={`status-${campus._id}`}
                                                    checked={campus.status === "INACTIVE"}
                                                    onChange={() => onStatusChange(campus._id, "INACTIVE")}
                                                    className="sr-only"
                                                />
                                                <label
                                                    htmlFor={`inactive-${campus._id}`}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${campus.status === "INACTIVE"
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
                                        {campus.isDefault ? (
                                            <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                                                <Star className="h-3 w-3 mr-1" />
                                                기본
                                            </Badge>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onSetDefault(campus._id)}
                                                className="text-xs"
                                            >
                                                <StarOff className="h-3 w-3 mr-1" />
                                                설정
                                            </Button>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(campus.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => onEdit(campus._id)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => onDelete(campus._id)}
                                                disabled={campus.isDefault}
                                                title={campus.isDefault ? "기본 캠퍼스는 삭제할 수 없습니다" : "삭제"}
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
                        총 {pagination.total}개의 캠퍼스
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
