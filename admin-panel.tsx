"use client"

import * as React from "react"
import { AppSidebar } from "./components/app-sidebar"
import { TopNavigation } from "./components/top-navigation"
import { DashboardPage } from "./components/dashboard-page"
import { CoursesPage } from "./components/courses-page"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { LecturesPage } from "./components/lectures-page"
import { SettingsPage } from "./components/settings-page"
import { ForgotPasswordPage } from "./components/forgot-password-page"
import { ChangePasswordPage } from "./components/change-password-page"
import JobPostForm from "./components/jobPost-page"
import QuestionBank from "./components/questionBank"
import { useRouter } from "next/navigation"

export default function AdminPanel() {
  const router = useRouter()

  const [currentPage, setCurrentPage] = React.useState("dashboard")
  const [isAuthChecked, setIsAuthChecked] = React.useState(false)

  // 1️⃣ Always run all hooks
  React.useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("adminToken="))
      ?.split("=")[1]

    if (!token) {
      router.push("/admin/login")
    } else {
      setIsAuthChecked(true)
    }
  }, [router])

  // 2️⃣ Also always run this hook regardless of auth state
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash) setCurrentPage(hash)
    }

    handleHashChange()
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  // 3️⃣ Safe conditional rendering after all hooks are declared
  if (!isAuthChecked) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading Admin Panel...
      </div>
    )
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "courses":
        return <CoursesPage />
      case "lectures":
        return <LecturesPage />
      case "Question-Bank":
        return <QuestionBank />
      case "settings":
        return <SettingsPage />
      case "jobPost":
        return <JobPostForm />
      case "dashboard":
      default:
        return <DashboardPage />
    }
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-slate-50 flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <TopNavigation />
          <main className="flex-1 p-6">{renderCurrentPage()}</main>
        </SidebarInset>
      </div>
      <Toaster />
    </SidebarProvider>
  )
}
