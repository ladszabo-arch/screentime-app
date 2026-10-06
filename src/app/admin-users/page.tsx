import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { adminSetPassword } from './actions'
import { ArrowLeft, UserCog } from 'lucide-react'

export default async function AdminUsersPage() {
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

  const { data: allUsers } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .order('role', { ascending: true })

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
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600">
          <UserCog className="text-white" size={20} />
        </div>
        <h1 className="text-xl font-bold text-white">Nastavenie hesiel</h1>
      </header>

      <div className="flex flex-col gap-4">
        {allUsers?.map((u) => (
          <form
            key={u.id}
            action={adminSetPassword}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/20"
          >
            <input type="hidden" name="user_id" value={u.id} />
            <p className="mb-3 font-semibold text-white">
              {u.full_name}{' '}
              <span className="text-xs font-normal text-slate-500">
                ({u.role === 'parent' ? 'rodič' : 'dieťa'})
              </span>
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="password"
                name="password"
                placeholder="Nové heslo (min. 6 znakov)"
                minLength={6}
                required
                className="flex-1 rounded-lg border border-slate-700 bg-slate-800/50 p-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:from-indigo-400 hover:to-violet-500"
              >
                Nastaviť heslo
              </button>
            </div>
          </form>
        ))}
      </div>
    </main>
  )
}
