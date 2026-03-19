'use server'

import { supabase } from '@/supabase/supabase'
import { loginSchema } from '@/lib/validations/auth'
import { redirect } from 'next/navigation'

const ALLOWED_USER_TYPES = ['MODERATOR', 'ADMIN', 'SUPER_ADMIN']

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const validation = loginSchema.safeParse({ email, password })

  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: validation.data.email,
    password: validation.data.password,
  })

  if (error) {
    return { error: error.message }
  }

  const userType = data.user?.user_metadata?.user_type

  if (!userType || !ALLOWED_USER_TYPES.includes(userType)) {
    await supabase.auth.signOut()
    return { error: 'Unauthorized access. Admin privileges required.' }
  }

  redirect('/admin/dashboard')
}
