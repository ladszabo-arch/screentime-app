import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createRule, updateRule } from './actions'
import BottomNav from '@/components/BottomNav'
import { ClipboardList, Plus, ArrowLeft } from 'lucide-react'

export default async function RulesPage() {
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

  const { data: rules } = await supabase
    .from('rules')
    .select('id, title, minutes_reward, frequency, active')
    .order('active', { ascending: false })
    .order('title', { ascending: true })

  const freqLabels: Record<string, string> = {
    daily: 'Denne',
    weekly: 'Týždenne',
    'one-time': 'Jednorazovo',
  }

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
          <ClipboardList className="text-white" size={20} />
        </div>
        <h1 className="text-xl font-bold text-white">Správa pravidiel</h1>
      </header>

      <form
        action={createRule}
        className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/20"
      >
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-300">
          <Plus size={16} className="text-indigo-400" />
          Pridať nové pravidlo
        </h2>

        <label className="mb-1.5 block text-xs font-medium text-slate-400">
          Názov
        </label>
        <input
          type="text"
          name="title"
          required
          className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-800/50 p-2.5 text-sm text-white outline-none focus:border-indigo-500"
        />

        <label className="mb-1.5 block text-xs font-medium text-slate-400">
          Počet minút (záporné číslo = trest)
        </label>
        <input
          type="number"
          name="minutes_reward"
          required
          className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-800/50 p-2.5 text-sm text-white outline-none focus:border-indigo-500"
        />

        <label className="mb-1.5 block text-xs font-medium text-slate-400">
          Frekvencia
        </label>
        <select
          name="frequency"
          required
          className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-800/50 p-2.5 text-sm text-white outline-none focus:border-indigo-500"
        >
          <option value="daily">Denne</option>
          <option value="weekly">Týždenne</option>
          <option value="one-time">Jednorazovo</option>
        </select>

        <button
          type="submit"
          className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:from-indigo-400 hover:to-violet-500"
        >
          Pridať pravidlo
        </button>
      </form>

      <h2 className="mb-4 text-sm font-semibold text-slate-300">
        Existujúce pravidlá
      </h2>

      <div className="flex flex-col gap-3">
        {rules?.map((rule) => (
          <form
            key={rule.id}
            action={updateRule}
            className={`rounded-2xl border p-4 shadow-md transition ${
              rule.active
                ? 'border-slate-800 bg-slate-900/70'
                : 'border-slate-800/50 bg-slate-900/30 opacity-60'
            }`}
          >
            <input type="hidden" name="id" value={rule.id} />

            <div className="mb-3 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                name="title"
                defaultValue={rule.title}
                required
                className="flex-1 rounded-lg border border-slate-700 bg-slate-800/50 p-2 text-sm text-white outline-none focus:border-indigo-500"
              />
              <input
                type="number"
                name="minutes_reward"
                defaultValue={rule.minutes_reward}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 p-2 text-sm text-white outline-none focus:border-indigo-500 sm:w-24"
              />
              <select
                name="frequency"
                defaultValue={rule.frequency}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 p-2 text-sm text-white outline-none focus:border-indigo-500 sm:w-32"
              >
                <option value="daily">Denne</option>
                <option value="weekly">Týždenne</option>
                <option value="one-time">Jednorazovo</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-slate-400">
                <input
                  type="checkbox"
                  name="active"
                  defaultChecked={rule.active}
                  className="h-4 w-4 rounded accent-indigo-500"
                />
                Aktívne · {freqLabels[rule.frequency] ?? rule.frequency}
              </label>

              <button
                type="submit"
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
              >
                Uložiť
              </button>
            </div>
          </form>
        ))}
      </div>

      <BottomNav isParent={true} />
    </main>
  )
}

