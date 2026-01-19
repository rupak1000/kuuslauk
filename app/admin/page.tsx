"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { Lock, Utensils, Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react"

interface AdminUser {
  id: string
  email: string
  name: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotSuccess, setForgotSuccess] = useState(false)
  const [forgotError, setForgotError] = useState("")

  useEffect(() => {
    document.body.classList.add("admin-light-theme")
    return () => {
      document.body.classList.remove("admin-light-theme")
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setAdminUser(data.admin)
        setIsAuthenticated(true)
        setError("")
      } else {
        setError(data.error || "Invalid email or password")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotLoading(true)
    setForgotError("")

    try {
      const response = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotEmail }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setForgotSuccess(true)
      } else {
        setForgotError(data.error || "Failed to send reset email")
      }
    } catch (err) {
      setForgotError("Request failed. Please try again.")
    } finally {
      setForgotLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setAdminUser(null)
    setEmail("")
    setPassword("")
  }

  const handleBackToLogin = () => {
    setShowForgotPassword(false)
    setForgotEmail("")
    setForgotError("")
    setForgotSuccess(false)
  }

  if (isAuthenticated && adminUser) {
    return <AdminDashboard onLogout={handleLogout} adminUser={adminUser} />
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-gray-200 bg-white shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <Utensils className="w-8 h-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900"> Admin Login</CardTitle>
          <CardDescription className="text-gray-600">
            {showForgotPassword
              ? "Enter your email to reset your password"
              : "Enter your credentials to access the dashboard"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showForgotPassword ? (
            forgotSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Check Your Email</h3>
                  <p className="text-gray-600 mt-2">
                    If an account exists with <strong>{forgotEmail}</strong>, you will receive a password reset link
                    shortly.
                  </p>
                </div>
                <Button onClick={handleBackToLogin} className="w-full bg-amber-600 text-white hover:bg-amber-700">
                  Back to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email" className="text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="Enter your admin email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                      disabled={forgotLoading}
                      required
                    />
                  </div>
                  {forgotError && <p className="text-sm text-red-500">{forgotError}</p>}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-amber-600 text-white hover:bg-amber-700"
                  disabled={forgotLoading}
                >
                  {forgotLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-gray-600 hover:text-gray-900"
                  onClick={handleBackToLogin}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </form>
            )
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                    disabled={isLoading}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-amber-600 hover:text-amber-700 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <Button type="submit" className="w-full bg-amber-600 text-white hover:bg-amber-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login to Dashboard"
                )}
              </Button>
            </form>
          )}
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-amber-600 hover:underline">
              Back to Website
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
