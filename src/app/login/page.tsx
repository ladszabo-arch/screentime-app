import { login } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; msg?: string; }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        action={login}
        className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md"
      >
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Rodinný Screen Time
        </h1>

         {params.error && (
          <p className="mb-4 rounded bg-red-100 p-2 text-sm text-red-700">
            Nesprávny email alebo heslo.
          </p>
        )}



        <label className="mb-1 block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          className="mb-4 w-full rounded border border-gray-300 p-2"
        />

        <label className="mb-1 block text-sm font-medium text-gray-700">
          Heslo
        </label>
        <input
          type="password"
          name="password"
          required
          className="mb-6 w-full rounded border border-gray-300 p-2"
        />

        <button
          type="submit"
          className="w-full rounded bg-blue-600 p-2 font-semibold text-white hover:bg-blue-700"
        >
          Prihlásiť sa
        </button>
      </form>
    </div>
  )
}
