import { updatePassword } from './actions'
import { Lock, KeyRound } from 'lucide-react'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  const errorMessages: Record<string, string> = {
    mismatch: 'Heslá sa nezhodujú.',
    short: 'Heslo musí mať aspoň 6 znakov.',
    '1': 'Odkaz na obnovenie hesla už nie je platný. Skúste si vyžiadať nový.',
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-900/40">
            <KeyRound className="text-white" size={26} />
          </div>
          <h1 className="text-2xl font-bold text-white">Nové heslo</h1>
          <p className="mt-1 text-sm text-slate-400">Zadajte si nové heslo k účtu</p>
        </div>

        <form
          action={updatePassword}
          className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-black/20 backdrop-blur"
        >
          {params.error && (
            <p className="mb-4 rounded-lg border border-rose-900/50 bg-rose-950/50 p-3 text-sm text-rose-400">
              {errorMessages[params.error] ?? 'Nastala chyba, skúste to znova.'}
            </p>
          )}

          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Nové heslo
          </label>
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-3 focus-within:border-indigo-500">
            <Lock size={16} className="text-slate-500" />
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="w-full bg-transparent py-2.5 text-sm text-white placeholder-slate-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Zopakovať heslo
          </label>
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-3 focus-within:border-indigo-500">
            <Lock size={16} className="text-slate-500" />
            <input
              type="password"
              name="confirmPassword"
              required
              minLength={6}
              className="w-full bg-transparent py-2.5 text-sm text-white placeholder-slate-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 py-2.5 font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:from-indigo-400 hover:to-violet-500"
          >
            Uložiť nové heslo
          </button>
        </form>
      </div>
    </div>
  )
}
