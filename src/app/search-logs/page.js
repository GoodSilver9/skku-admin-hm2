"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Search, Calendar } from "lucide-react"

// Mock data - replace with actual data from your API
const searchLogs = [
  {
    id: 1,
    searchTerm: "React authentication best practices",
    date: "2024-03-20 14:30:25"
  },
  {
    id: 2,
    searchTerm: "NextJS API routes",
    date: "2024-03-20 13:15:10"
  },
  {
    id: 3,
    searchTerm: "Database indexing",
    date: "2024-03-19 16:45:33"
  },
  {
    id: 4,
    searchTerm: "TypeScript interfaces",
    date: "2024-03-19 11:20:45"
  },
  {
    id: 5,
    searchTerm: "Redux state management",
    date: "2024-03-18 09:55:15"
  }
]

export default function SearchLogsPage() {
  const [searchFilter, setSearchFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("all")

  // Filter logs and always sort by newest first
  const filteredLogs = searchLogs
    .filter(log => 
      log.searchTerm.toLowerCase().includes(searchFilter.toLowerCase()) &&
      (dateFilter === "all" || log.date.startsWith(dateFilter))
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  // Get unique dates for filter
  const uniqueDates = [...new Set(searchLogs.map(log => log.date.split(" ")[0]))]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>검색 로그</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex-1 space-y-6 p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">검색 로그</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>검색 기록</CardTitle>
              <CardDescription>검색 패턴을 확인하고 분석하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="검색어로 필터링..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-48">
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger>
                        <Calendar className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="날짜로 필터링" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">모든 날짜</SelectItem>
                        {uniqueDates.map(date => (
                          <SelectItem key={date} value={date}>
                            {date}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[70%]">검색어</TableHead>
                        <TableHead className="text-right">날짜 및 시간</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.searchTerm}</TableCell>
                          <TableCell className="text-right">{log.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredLogs.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    필터와 일치하는 검색 로그가 없습니다.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
} 