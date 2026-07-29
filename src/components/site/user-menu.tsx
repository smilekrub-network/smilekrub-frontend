import { useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { Gamepad2, LayoutDashboard, LogOut, User } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/toast'
import { authClient, initialsOf } from '#/lib/auth-client'
import type { SessionUser } from '#/lib/auth-client'

/**
 * Shared sign-out: clears the session on the API, drops the cached router
 * context so guards re-evaluate, then leaves any protected page.
 */
export function useSignOut() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  const signOut = async () => {
    if (pending) return
    setPending(true)
    try {
      await authClient.signOut()
      await router.invalidate()
      await router.navigate({ to: '/' })
    } catch {
      toast.add({
        title: 'ออกจากระบบไม่สำเร็จ',
        description: 'กรุณาลองใหม่อีกครั้ง',
        type: 'error',
      })
    } finally {
      setPending(false)
    }
  }

  return { signOut, pending }
}

export function UserAvatar({
  user,
  className,
}: {
  user: SessionUser
  className?: string
}) {
  return (
    <Avatar className={className}>
      <AvatarImage src={user.image ?? undefined} alt="" />
      <AvatarFallback>{initialsOf(user.name)}</AvatarFallback>
    </Avatar>
  )
}

/**
 * Dropdown body shared by the public nav bar and the admin sidebar.
 * `showAdminLink` is only ever passed for ADMIN users.
 */
export function UserMenuItems({ showAdminLink }: { showAdminLink: boolean }) {
  const { signOut, pending } = useSignOut()

  return (
    <>
      <DropdownMenuGroup>
        <DropdownMenuLabel>บัญชีของฉัน</DropdownMenuLabel>
        <DropdownMenuItem render={<Link to="/profile" />}>
          <User />
          โปรไฟล์
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link to="/register" />}>
          <Gamepad2 />
          สมัครเข้าเซิร์ฟ
        </DropdownMenuItem>
        {showAdminLink ? (
          <DropdownMenuItem render={<Link to="/admin" />}>
            <LayoutDashboard />
            แผงควบคุมแอดมิน
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem variant="destructive" disabled={pending} onClick={signOut}>
          <LogOut />
          ออกจากระบบ
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  )
}

/** Avatar + dropdown used in the public nav bar. */
export function UserMenu({ user }: { user: SessionUser }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="เมนูบัญชีผู้ใช้"
      >
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" className="w-56">
        <div className="flex items-center gap-2.5 px-3 py-2">
          <UserAvatar user={user} />
          <div className="grid flex-1 leading-tight">
            <span className="truncate text-sm font-medium">{user.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {user.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'สมาชิก'}
            </span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <UserMenuItems showAdminLink={user.role === 'ADMIN'} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
