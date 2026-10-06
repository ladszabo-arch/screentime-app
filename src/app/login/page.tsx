import { login } from './actions'
import { Lock, Mail } from 'lucide-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-900/40">
            <Lock className="text-white" size={26} />
          </div>
          <h1 className="text-2xl font-bold text-white">Rodinný Screen Time</h1>
          <p className="mt-1 text-sm text-slate-400">Prihláste sa do svojho účtu</p>
        </div>

        <form
          action={login}
          className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-black/20 backdrop-blur"
        >
          {params.error && (
            <p className="mb-4 rounded-lg border border-rose-900/50 bg-rose-950/50 p-3 text-sm text-rose-400">
              Nesprávny email alebo heslo.
            </p>
          )}

          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Email
          </label>
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-3 focus-within:border-indigo-500">
            <Mail size={16} className="text-slate-500" />
            <input
              type="email"
              name="email"
              required
              className="w-full bg-transparent py-2.5 text-sm text-white placeholder-slate-500 outline-none"
              placeholder="meno@email.com"
            />
          </div>

          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Heslo
          </label>
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-3 focus-within:border-indigo-500">
            <Lock size={16} className="text-slate-500" />
            <input
              type="password"
              name="password"
              required
              className="w-full bg-transparent py-2.5 text-sm text-white placeholder-slate-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 py-2.5 font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:from-indigo-400 hover:to-violet-500"
          >
            Prihlásiť sa
          </button>
        </form>
      </div>
    </div>
  )
}

