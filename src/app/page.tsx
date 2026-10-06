import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BottomNav from '@/components/BottomNav'
import { Clock } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  const isParent = profile?.role === 'parent'

  if (isParent) {
    const { data: children } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('role', 'child')

    const { data: balances } = await supabase
      .from('child_balances')
      .select('child_id, balance')

    const colors = [
      'from-indigo-500 to-violet-600',
      'from-emerald-500 to-teal-600',
      'from-amber-500 to-orange-600',
      'from-rose-500 to-pink-600',
    ]

    return (
      <main className="mx-auto min-h-screen max-w-2xl px-4 pb-28 pt-8">
        <header className="mb-8">
          <p className="text-sm text-slate-400">Vitaj späť,</p>
          <h1 className="text-2xl font-bold text-white">{profile?.full_name}</h1>
        </header>

        <div className="flex flex-col gap-4 sm:flex-row">
          {children?.map((child, i) => {
            const balance =
              balances?.find((b) => b.child_id === child.id)?.balance ?? 0

            return (
              <div
                key={child.id}
                className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/20"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${colors[i % colors.length]} text-lg font-bold text-white shadow-md`}
                  >
                    {child.full_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{child.full_name}</p>
                    <p className="text-xs text-slate-500">Dieťa</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <Clock size={16} />
                  <span className="text-xs">Dostupné minúty</span>
                </div>
                <p className="mt-1 text-3xl font-bold text-white">
                  {balance}{' '}
                  <span className="text-base font-medium text-slate-500">min</span>
                </p>
              </div>
            )
          })}
        </div>

        <BottomNav isParent={isParent} />
      </main>
    )
  }

  const { data: balanceRow } = await supabase
    .from('child_balances')
    .select('balance')
    .eq('child_id', user.id)
    .maybeSingle()

  const balance = balanceRow?.balance ?? 0

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 pb-28 text-center">
      <p className="text-sm text-slate-400">Ahoj,</p>
      <h1 className="mb-8 text-2xl font-bold text-white">{profile?.full_name} 👋</h1>

      <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl shadow-black/20">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600">
          <Clock className="text-white" size={22} />
        </div>
        <p className="text-sm text-slate-400">Dostupné minúty</p>
        <p className="mt-1 text-5xl font-bold text-white">{balance}</p>
        <p className="text-sm text-slate-500">minút</p>
      </div>

      <BottomNav isParent={isParent} />
    </main>
  )
}


