'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createTransaction(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const child_id = formData.get('child_id') as string
  const amount = Number(formData.get('amount'))
  const reason = formData.get('reason') as string
  const type = formData.get('type') as string

  await supabase.from('minute_transactions').insert({
    child_id,
    created_by: user.id,
    amount,
    reason,
    type,
  })

  revalidatePath('/')
  revalidatePath('/transactions')
}
