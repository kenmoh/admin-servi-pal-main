'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginSchema } from "@/lib/validations/auth"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      const validation = loginSchema.safeParse({ email, password })
      if (!validation.success) {
        setError(validation.error.issues[0].message)
        return
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: validation.data.email, password: validation.data.password }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.detail || 'Login failed.')
        return
      }

      router.push('/admin/dashboard')
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-5", className)} {...props}>
      {error && (
        <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="admin@servipal.com"
            className="h-11"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="h-11 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button
          className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white mt-2"
          type="submit"
          disabled={loading}
        >
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</> : 'Sign in'}
        </Button>
      </form>
    </div>
  )
}
