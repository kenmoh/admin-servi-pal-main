"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Eye, EyeOff, ShieldCheck, Shield } from "lucide-react"
import { z } from "zod"
import { useQueryClient } from "@tanstack/react-query"

const schema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(10, "Phone number must be at least 10 digits"),
  user_type: z.enum(["ADMIN", "MODERATOR"]),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type FormData = z.infer<typeof schema>
type FieldErrors = Partial<Record<keyof FormData, string>>

const defaultForm: FormData = {
  full_name: "",
  email: "",
  phone_number: "",
  user_type: "MODERATOR",
  password: "",
}

export function CreateAdminUserModal() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormData>(defaultForm)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const queryClient = useQueryClient()

  function handleChange(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setServerError(null)
  }

  function handleClose() {
    setOpen(false)
    setForm(defaultForm)
    setErrors({})
    setServerError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)

    const result = schema.safeParse(form)
    if (!result.success) {
      const fieldErrors: FieldErrors = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormData
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      })

      if (!response.ok) {
        const err = await response.json()
        setServerError(err.error || "Failed to create user")
        return
      }

      queryClient.invalidateQueries({ queryKey: ["users"] })
      handleClose()
    } catch {
      setServerError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <UserPlus className="w-4 h-4 mr-2" />
        Add Admin User
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-lg bg-primary/10">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <DialogTitle className="text-xl">Create Admin User</DialogTitle>
            </div>
            <DialogDescription>
              Create a new ADMIN or MODERATOR account with access to the dashboard.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {serverError && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 rounded-lg">
                {serverError}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                placeholder="John Doe"
                value={form.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                className={errors.full_name ? "border-red-500" : ""}
              />
              {errors.full_name && <p className="text-xs text-red-500">{errors.full_name}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                placeholder="+2348012345678"
                value={form.phone_number}
                onChange={(e) => handleChange("phone_number", e.target.value)}
                className={errors.phone_number ? "border-red-500" : ""}
              />
              {errors.phone_number && <p className="text-xs text-red-500">{errors.phone_number}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={form.user_type} onValueChange={(v) => handleChange("user_type", v)}>
                <SelectTrigger className={errors.user_type ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium">Admin</p>
                        <p className="text-xs text-muted-foreground">Full access to all features</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="MODERATOR">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Moderator</p>
                        <p className="text-xs text-muted-foreground">Limited management access</p>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.user_type && <p className="text-xs text-red-500">{errors.user_type}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Creating..." : "Create User"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
