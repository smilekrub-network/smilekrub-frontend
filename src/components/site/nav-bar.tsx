import { useState } from 'react'
import { Link, useRouteContext } from '@tanstack/react-router'
import { Gamepad2, LayoutDashboard, LogOut, Menu, User, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { ServerStatusChip } from '#/components/site/server-status-chip'
import { UserAvatar, UserMenu, useSignOut } from '#/components/site/user-menu'
import { NAV_LINKS } from '#/lib/site-content'
import type { ServerStatus } from '#/lib/server-status'

export function NavBar({ status }: { status: ServerStatus }) {
  const [open, setOpen] = useState(false)
  const { session } = useRouteContext({ from: '__root__' })
  const { signOut, pending } = useSignOut()
  const isAdmin = session?.user.role === 'ADMIN'

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src="/smilekrub_logo_white.png" alt="Smilekrub" className="h-8 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              size="sm"
              render={<a href={link.href} />}
              className="text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ServerStatusChip status={status} className="hidden sm:inline-flex" />
          {session ? (
            <>
              {isAdmin ? (
                <Button
                  variant="ghost"
                  size="sm"
                  render={<Link to="/admin" />}
                  className="hidden font-medium sm:inline-flex"
                >
                  แอดมิน
                </Button>
              ) : null}
              <UserMenu user={session.user} />
            </>
          ) : (
            <Button
              size="sm"
              render={<Link to="/signin" />}
              className="hidden font-medium sm:inline-flex"
            >
              เข้าสู่ระบบ
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden border-t border-border/50 lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              {session ? (
                <>
                  <div className="mt-1 flex items-center gap-2.5 border-t border-border/50 px-3 pt-4">
                    <UserAvatar user={session.user} />
                    <div className="grid flex-1 leading-tight">
                      <span className="truncate text-sm font-medium">{session.user.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {session.user.email}
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <User className="size-4" />
                    โปรไฟล์
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <Gamepad2 className="size-4" />
                    สมัครเข้าเซิร์ฟ
                  </Link>
                  {isAdmin ? (
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      <LayoutDashboard className="size-4" />
                      แผงควบคุมแอดมิน
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      setOpen(false)
                      void signOut()
                    }}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                  >
                    <LogOut className="size-4" />
                    ออกจากระบบ
                  </button>
                </>
              ) : (
                <Link
                  to="/signin"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 font-medium text-foreground transition-colors hover:bg-muted"
                >
                  เข้าสู่ระบบ
                </Link>
              )}
              <ServerStatusChip status={status} className="mt-2 self-start sm:hidden" />
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
