import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logout } from './login/actions'

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


  if (profile?.role === 'parent') {
    const { data: children } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('role', 'child')

    const { data: balances } = await supabase
      .from('child_balances')
      .select('child_id, balance')

    return (
      <main className="flex min-h-screen flex-col items-center gap-6 p-8">
        <h1 className="text-2xl font-bold">Rodinný Screen Time Manager</h1>
        <p>
          Prihlásený ako: <strong>{profile.full_name}</strong> (rodič)
        </p>

        <div className="flex gap-6">
          {children?.map((child) => {
            const balance =
              balances?.find((b) => b.child_id === child.id)?.balance ?? 0

            return (
              <div
                key={child.id}
                className="w-56 rounded-lg bg-white p-6 text-center shadow-md"
              >
                <h2 className="text-lg font-semibold">{child.full_name}</h2>
                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {balance} min
                </p>
              </div>
            )
          })}
        </div>

                <nav className="flex gap-4">
          <a href="/transactions" className="text-blue-600 underline">
            Pridať/Odobrať minúty
          </a>
          <a href="/rules" className="text-blue-600 underline">
            Správa pravidiel
          </a>
          <a href="/history" className="text-blue-600 underline">
            História
          </a>
        </nav>

        <form action={logout}>
          <button
            type="submit"
            className="rounded bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
          >
            Odhlásiť sa
          </button>
        </form>
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
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Rodinný Screen Time Manager</h1>
      <p className="text-lg">
        Ahoj, <strong>{profile?.full_name}</strong>!
      </p>
      <div className="rounded-lg bg-white p-8 text-center shadow-md">
        <p className="text-sm text-gray-500">Dostupné minúty</p>
        <p className="text-4xl font-bold text-blue-600">{balance} min</p>
      </div>
            <a href="/history" className="text-blue-600 underline">
        História
      </a>

      <form action={logout}>
        <button
          type="submit"
          className="rounded bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
        >
          Odhlásiť sa
        </button>
      </form>
    </main>
  )
}


