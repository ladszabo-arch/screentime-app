import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createTransaction } from './actions'
import BottomNav from '@/components/BottomNav'
import { ArrowLeftRight, ArrowLeft } from 'lucide-react'

export default async function TransactionsPage() {
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

  const { data: children } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('role', 'child')

  const { data: rules } = await supabase
    .from('rules')
    .select('id, title, minutes_reward')
    .eq('active', true)
    .order('title', { ascending: true })

  return (
    <main className="mx-auto min-h-screen max-w-xl px-4 pb-28 pt-8">
      <a
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200"
      >
        <ArrowLeft size={16} />
        Späť na dashboard
      </a>

      <header className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
          <ArrowLeftRight className="text-white" size={20} />
        </div>
        <h1 className="text-xl font-bold text-white">Pridať / Odobrať minúty</h1>
      </header>

      <form
        action={createTransaction}
        className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/20"
      >
        <label className="mb-1.5 block text-xs font-medium text-slate-400">
          Dieťa
        </label>
        <select
          name="child_id"
          required
          className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-800/50 p-2.5 text-sm text-white outline-none focus:border-indigo-500"
        >
          {children?.map((child) => (
            <option key={child.id} value={child.id}>
              {child.full_name}
            </option>
          ))}
        </select>

        <label className="mb-1.5 block text-xs font-medium text-slate-400">
          Vybrať z preddefinovaného pravidla (voliteľné)
        </label>
        <select
          id="rule-select"
          className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-800/50 p-2.5 text-sm text-white outline-none focus:border-indigo-500"
          defaultValue=""
        >
          <option value="">— vlastný zápis —</option>
          {rules?.map((rule) => (
            <option
              key={rule.id}
              value={rule.minutes_reward}
              data-title={rule.title}
            >
              {rule.title} ({rule.minutes_reward > 0 ? '+' : ''}
              {rule.minutes_reward} min)
            </option>
          ))}
        </select>

        <label className="mb-1.5 block text-xs font-medium text-slate-400">
          Počet minút (kladné = pridať, záporné = odobrať)
        </label>
        <input
          type="number"
          name="amount"
          id="amount-input"
          required
          className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-800/50 p-2.5 text-sm text-white outline-none focus:border-indigo-500"
        />

        <label className="mb-1.5 block text-xs font-medium text-slate-400">
          Dôvod
        </label>
        <input
          type="text"
          name="reason"
          id="reason-input"
          required
          className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-800/50 p-2.5 text-sm text-white outline-none focus:border-indigo-500"
        />

        <label className="mb-1.5 block text-xs font-medium text-slate-400">
          Typ
        </label>
        <select
          name="type"
          required
          className="mb-6 w-full rounded-lg border border-slate-700 bg-slate-800/50 p-2.5 text-sm text-white outline-none focus:border-indigo-500"
        >
          <option value="reward">Odmena</option>
          <option value="penalty">Trest</option>
          <option value="usage">Spotreba (hranie)</option>
        </select>

        <button
          type="submit"
          className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition hover:from-emerald-400 hover:to-teal-500"
        >
          Uložiť
        </button>
      </form>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('rule-select').addEventListener('change', function (e) {
              const selected = e.target.options[e.target.selectedIndex];
              if (selected.value !== '') {
                document.getElementById('amount-input').value = selected.value;
                document.getElementById('reason-input').value = selected.dataset.title;
              }
            });
          `,
        }}
      />

      <BottomNav isParent={true} />
    </main>
  )
}

