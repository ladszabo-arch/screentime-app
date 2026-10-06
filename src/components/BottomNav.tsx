'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ArrowLeftRight, ClipboardList, History, LogOut } from 'lucide-react'
import { logout } from '@/app/login/actions'

export default function BottomNav({ isParent }: { isParent: boolean }) {
  const pathname = usePathname()

  const items = [
    { href: '/', label: 'Domov', icon: Home },
    ...(isParent
      ? [
          { href: '/transactions', label: 'Minúty', icon: ArrowLeftRight },
          { href: '/rules', label: 'Pravidlá', icon: ClipboardList },
        ]
      : []),
    { href: '/history', label: 'História', icon: History },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-800 bg-slate-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-around px-2 py-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs font-medium transition-colors ${
                active
                  ? 'bg-indigo-500/15 text-indigo-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              {label}
            </Link>
          )
        })}

        <form action={logout}>
          <button
            type="submit"
            className="flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs font-medium text-slate-400 transition-colors hover:text-rose-400"
          >
            <LogOut size={20} />
            Odhlásiť
          </button>
        </form>
      </div>
    </nav>
  )
}
