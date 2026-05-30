'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { UserAvatar } from '@/components/UserAvatar'
import { signOutAction } from '@/lib/auth-actions'

interface UserMenuProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 w-full px-2 py-2 rounded-md hover:bg-sidebar-accent transition-colors text-left"
        aria-expanded={open}
      >
        <UserAvatar name={user.name} image={user.image} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{user.name ?? 'User'}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      </button>

      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-50">
          <button
            onClick={() => {
              router.push('/profile')
              setOpen(false)
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm hover:bg-sidebar-accent transition-colors"
          >
            <User className="h-4 w-4 text-muted-foreground" />
            Profile
          </button>
          <div className="border-t border-border" />
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm hover:bg-sidebar-accent transition-colors text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
