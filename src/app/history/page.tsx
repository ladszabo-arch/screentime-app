import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BottomNav from '@/components/BottomNav'
import { History as HistoryIcon, ArrowLeft, Gift, TrendingDown, Smartphone, Sun } from 'lucide-react'

const typeConfig: Record<string, { label: string; icon: any; color: string }> = {
  reward: { label: 'Odmena', icon: Gift, color: 'text-emerald-400 bg-emerald-500/10' },
  penalty: { label: 'Trest', icon: TrendingDown, color: 'text-rose-400 bg-rose-500/10' },
  usage: { label: 'Spotreba', icon: Smartphone, color: 'text-amber-400 bg-amber-500/10' },
  daily_baseline: { label: 'Denný základ', icon: Sun, color: 'text-sky-400 bg-sky-500/10' },
}

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

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 pb-28 pt-8">
      <a
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200"
      >
        <ArrowLeft size={16} />
        Späť na dashboard
      </a>

      <header className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600">
          <HistoryIcon className="text-white" size={20} />
        </div>
        <h1 className="text-xl font-bold text-white">História</h1>
      </header>

      <div className="flex flex-col gap-3">
        {transactions?.map((t: any) => {
          const conf = typeConfig[t.type] ?? {
            label: t.type,
            icon: Gift,
            color: 'text-slate-400 bg-slate-500/10',
          }
          const Icon = conf.icon

          return (
            <div
              key={t.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-md shadow-black/10"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${conf.color}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {profile?.role === 'parent' ? `${t.profiles?.full_name} — ` : ''}
                    {t.reason}
                  </p>
                  <p className="text-xs text-slate-500">
                    {conf.label} ·{' '}
                    {new Date(t.created_at).toLocaleString('sk-SK')}
                  </p>
                </div>
              </div>
              <p
                className={`shrink-0 text-lg font-bold ${
                  t.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {t.amount >= 0 ? '+' : ''}
                {t.amount} min
              </p>
            </div>
          )
        })}

        {transactions?.length === 0 && (
          <p className="text-center text-sm text-slate-500">Zatiaľ žiadne záznamy.</p>
        )}
      </div>

      <BottomNav isParent={profile?.role === 'parent'} />
    </main>
  )
}

