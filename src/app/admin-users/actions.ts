'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function adminSetPassword(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Nie si prihlásený.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'parent') {
    return { error: 'Nemáš oprávnenie.' }
  }

  const targetUserId = formData.get('user_id') as string
  const newPassword = formData.get('password') as string

  if (!newPassword || newPassword.length < 6) {
    return { error: 'Heslo musí mať aspoň 6 znakov.' }
  }

  const adminClient = createAdminClient()

  const { error } = await adminClient.auth.admin.updateUserById(targetUserId, {
    password: newPassword,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin-users')
  return { success: true }
}
