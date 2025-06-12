"use client"

import * as React from "react"
import { Eye, EyeOff, GraduationCap, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { usePostData } from "@/hooks/usePostData"
import { useRouter } from "next/navigation"

interface LoginPageProps {
  onLogin: () => void
  onForgotPassword: () => void
}

export default  function LoginPage({ onLogin, onForgotPassword }: LoginPageProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    // rememberMe: false,
  })

      const router = useRouter()

  const { toast } = useToast();

    const { mutate } = usePostData("http://localhost:5001/api/admin/loginAdmin");  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    mutate(formData, {
      onSuccess: (response) => {
        console.log("Admin Login Successfully:", response);
        router.push("/")
        toast({
          title: "Admin Login Successful",
          description: "Welcome back to EduAdmin!",
        });
      },
      onError: (error: any) => {
        console.error("Failed to login", error);
        toast({
          title: "Admin Login Failed",
        //   description: "Welcome back to EduAdmin!",
        });
      },
    });        
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 text-white">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Solvarsity Admin</h1>
              <p className="text-sm text-slate-500">Learning Management System</p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold text-slate-900">Welcome Back</CardTitle>
            <CardDescription className="text-slate-600">Sign in to your admin account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@eduplatform.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 border-slate-200 focus:border-blue-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10 border-slate-200 focus:border-blue-300"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange("rememberMe", checked as boolean)}
                  />
                  <Label htmlFor="rememberMe" className="text-sm text-slate-600">
                    Remember me
                  </Label>
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-blue-600 hover:text-blue-700 p-0"
                  onClick={onForgotPassword}
                >
                  Forgot password?
                </Button>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" >
                {/* {isLoading ? "Signing in..." : "Sign In"} */} Login 
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm font-medium text-slate-700 mb-2">Demo Credentials:</p>
              <div className="text-sm text-slate-600 space-y-1">
                <p>
                  <strong>Email:</strong> admin@eduplatform.com
                </p>
                <p>
                  <strong>Password:</strong> admin123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">© 2024 EduAdmin. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
