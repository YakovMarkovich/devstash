import Image from 'next/image'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  name?: string | null
  image?: string | null
  size?: 'sm' | 'md'
  className?: string
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
}

export function UserAvatar({ name, image, size = 'md', className }: UserAvatarProps) {
  const dim = size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-8 w-8 text-xs'

  if (image) {
    return (
      <Image
        src={image}
        alt={name ?? 'User avatar'}
        width={size === 'sm' ? 28 : 32}
        height={size === 'sm' ? 28 : 32}
        className={cn('rounded-full object-cover shrink-0', dim, className)}
      />
    )
  }

  const initials = name ? getInitials(name) : '?'

  return (
    <div
      className={cn(
        'rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shrink-0',
        dim,
        className
      )}
      aria-label={name ?? 'User'}
    >
      {initials}
    </div>
  )
}
