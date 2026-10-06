'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    redirect('/reset-password?error=mismatch')
  }

  if (password.length < 6) {
    redirect('/reset-password?error=short')
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    redirect('/reset-password?error=1')
  }

  redirect('/login?reset=success')
}
