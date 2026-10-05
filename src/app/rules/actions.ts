'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createRule(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const title = formData.get('title') as string
  const minutes_reward = Number(formData.get('minutes_reward'))
  const frequency = formData.get('frequency') as string

  await supabase.from('rules').insert({
    title,
    minutes_reward,
    frequency,
    created_by: user?.id,
  })

  revalidatePath('/rules')
}

export async function updateRule(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const minutes_reward = Number(formData.get('minutes_reward'))
  const frequency = formData.get('frequency') as string
  const active = formData.get('active') === 'on'

  await supabase
    .from('rules')
    .update({
      title,
      minutes_reward,
      frequency,
      active,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  revalidatePath('/rules')
}
