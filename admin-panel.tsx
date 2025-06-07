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
import { LoginPage } from "./components/login-page"
import { ForgotPasswordPage } from "./components/forgot-password-page"
import { ChangePasswordPage } from "./components/change-password-page"
import JobPostForm from "./components/jobPost-page"
import QuestionBank from "./components/questionBank"

export default function AdminPanel() {
  const [currentPage, setCurrentPage] = React.useState("dashboard")
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [authPage, setAuthPage] = React.useState<"login" | "forgot" | "change">("login")

  // Listen for hash changes to navigate between pages
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) // Remove the #
      if (hash) {
        setCurrentPage(hash)
      }
    }

    // Set initial page based on hash
    handleHashChange()

    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

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

  const renderAuthPage = () => {
    switch (authPage) {
      case "forgot":
        return <ForgotPasswordPage onBackToLogin={() => setAuthPage("login")} />
      case "change":
        return <ChangePasswordPage onPasswordChanged={() => setAuthPage("login")} />
      case "login":
      default:
        return <LoginPage onLogin={() => setIsAuthenticated(true)} onForgotPassword={() => setAuthPage("forgot")} />
    }
  }

  if (!isAuthenticated) {
    return (
      <>
        {renderAuthPage()}
        <Toaster />
      </>
    )
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
