'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function adminSetPassword(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'parent') {
    redirect('/')
  }

  const targetUserId = formData.get('user_id') as string
  const newPassword = formData.get('password') as string

  if (!newPassword || newPassword.length < 6) {
    redirect('/admin-users?error=short')
  }

  const adminClient = createAdminClient()

  const { error } = await adminClient.auth.admin.updateUserById(targetUserId, {
    password: newPassword,
  })

  if (error) {
    redirect('/admin-users?error=1')
  }

  revalidatePath('/admin-users')
  redirect('/admin-users?success=1')
}

