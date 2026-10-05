import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createRule, updateRule } from './actions'

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

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-6 text-2xl font-bold">Správa pravidiel</h1>

      <a href="/" className="mb-6 inline-block text-blue-600 underline">
        ← Späť na dashboard
      </a>

      <form action={createRule} className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold">Pridať nové pravidlo</h2>

        <label className="mb-1 block text-sm font-medium text-gray-700">
          Názov
        </label>
        <input
          type="text"
          name="title"
          required
          className="mb-4 w-full rounded border border-gray-300 p-2"
        />

        <label className="mb-1 block text-sm font-medium text-gray-700">
          Počet minút (záporné číslo = trest)
        </label>
        <input
          type="number"
          name="minutes_reward"
          required
          className="mb-4 w-full rounded border border-gray-300 p-2"
        />

        <label className="mb-1 block text-sm font-medium text-gray-700">
          Frekvencia
        </label>
        <select
          name="frequency"
          required
          className="mb-4 w-full rounded border border-gray-300 p-2"
        >
          <option value="daily">Denne</option>
          <option value="weekly">Týždenne</option>
          <option value="one-time">Jednorazovo</option>
        </select>

        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Pridať pravidlo
        </button>
      </form>

      <h2 className="mb-4 text-lg font-semibold">Existujúce pravidlá</h2>

      <div className="flex flex-col gap-4">
        {rules?.map((rule) => (
          <form
            key={rule.id}
            action={updateRule}
            className="rounded-lg bg-white p-4 shadow-md"
          >
            <input type="hidden" name="id" value={rule.id} />

            <div className="mb-3 flex gap-3">
              <input
                type="text"
                name="title"
                defaultValue={rule.title}
                required
                className="flex-1 rounded border border-gray-300 p-2"
              />
              <input
                type="number"
                name="minutes_reward"
                defaultValue={rule.minutes_reward}
                required
                className="w-28 rounded border border-gray-300 p-2"
              />
              <select
                name="frequency"
                defaultValue={rule.frequency}
                required
                className="rounded border border-gray-300 p-2"
              >
                <option value="daily">Denne</option>
                <option value="weekly">Týždenne</option>
                <option value="one-time">Jednorazovo</option>
              </select>
            </div>

            <label className="mb-3 flex items-center gap-2 text-sm">
              <input type="checkbox" name="active" defaultChecked={rule.active} />
              Aktívne
            </label>

            <button
              type="submit"
              className="rounded bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Uložiť zmeny
            </button>
          </form>
        ))}
      </div>
    </main>
  )
}
