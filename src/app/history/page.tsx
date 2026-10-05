import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function HistoryPage() {
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

  let query = supabase
    .from('minute_transactions')
    .select('id, amount, reason, type, created_at, child_id, profiles!minute_transactions_child_id_fkey(full_name)')
    .order('created_at', { ascending: false })

  if (profile?.role !== 'parent') {
    query = query.eq('child_id', user.id)
  }

  const { data: transactions } = await query

  const typeLabels: Record<string, string> = {
    reward: 'Odmena',
    penalty: 'Trest',
    usage: 'Spotreba',
    daily_baseline: 'Denný základ',
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-bold">História</h1>

      <a href="/" className="mb-6 inline-block text-blue-600 underline">
        ← Späť na dashboard
      </a>

      <div className="flex flex-col gap-3">
        {transactions?.map((t: any) => (
          <div
            key={t.id}
            className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md"
          >
            <div>
              <p className="font-semibold">
                {profile?.role === 'parent' ? `${t.profiles?.full_name} — ` : ''}
                {t.reason}
              </p>
              <p className="text-sm text-gray-500">
                {typeLabels[t.type] ?? t.type} ·{' '}
                {new Date(t.created_at).toLocaleString('sk-SK')}
              </p>
            </div>
            <p
              className={
                t.amount >= 0
                  ? 'text-xl font-bold text-green-600'
                  : 'text-xl font-bold text-red-600'
              }
            >
              {t.amount >= 0 ? '+' : ''}
              {t.amount} min
            </p>
          </div>
        ))}

        {transactions?.length === 0 && (
          <p className="text-gray-500">Zatiaľ žiadne záznamy.</p>
        )}
      </div>
    </main>
  )
}
