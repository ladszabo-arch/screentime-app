import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createTransaction } from './actions'

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
    <main className="mx-auto max-w-xl p-8">
      <h1 className="mb-6 text-2xl font-bold">Pridať / Odobrať minúty</h1>

      <a href="/" className="mb-6 inline-block text-blue-600 underline">
        ← Späť na dashboard
      </a>

      <form action={createTransaction} className="rounded-lg bg-white p-6 shadow-md">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Dieťa
        </label>
        <select
          name="child_id"
          required
          className="mb-4 w-full rounded border border-gray-300 p-2"
        >
          {children?.map((child) => (
            <option key={child.id} value={child.id}>
              {child.full_name}
            </option>
          ))}
        </select>

        <label className="mb-1 block text-sm font-medium text-gray-700">
          Vybrať z preddefinovaného pravidla (voliteľné)
        </label>
        <select
          id="rule-select"
          className="mb-4 w-full rounded border border-gray-300 p-2"
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

        <label className="mb-1 block text-sm font-medium text-gray-700">
          Počet minút (kladné = pridať, záporné = odobrať)
        </label>
        <input
          type="number"
          name="amount"
          id="amount-input"
          required
          className="mb-4 w-full rounded border border-gray-300 p-2"
        />

        <label className="mb-1 block text-sm font-medium text-gray-700">
          Dôvod
        </label>
        <input
          type="text"
          name="reason"
          id="reason-input"
          required
          className="mb-4 w-full rounded border border-gray-300 p-2"
        />

        <label className="mb-1 block text-sm font-medium text-gray-700">
          Typ
        </label>
        <select
          name="type"
          required
          className="mb-6 w-full rounded border border-gray-300 p-2"
        >
          <option value="reward">Odmena</option>
          <option value="penalty">Trest</option>
          <option value="usage">Spotreba (hranie)</option>
        </select>

        <button
          type="submit"
          className="w-full rounded bg-blue-600 p-2 font-semibold text-white hover:bg-blue-700"
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
    </main>
  )
}
