import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { CheckCircle2, LayoutDashboard, LogOut, XCircle } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Footer } from '#/components/site/footer'
import { NavBar } from '#/components/site/nav-bar'
import { UserAvatar, useSignOut } from '#/components/site/user-menu'
import { getServerStatus } from '#/lib/server-status'
import { useServerStatus } from '#/lib/use-server-status'
import type { SessionUser } from '#/lib/auth-client'

export const Route = createFileRoute('/profile')({
  beforeLoad: ({ context, location }) => {
    if (!context.session) {
      throw redirect({ to: '/signin', search: { redirect: location.href } })
    }
    return { session: context.session }
  },
  component: Profile,
  loader: () => getServerStatus(),
  head: () => ({
    meta: [{ title: 'Smilekrub Network | บัญชีของฉัน' }],
  }),
})

function formatJoinedOn(iso: string) {
  return new Date(iso).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatMemberFor(iso: string) {
  const start = new Date(iso)
  const now = new Date()

  let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  let days = now.getDate() - start.getDate()
  if (days < 0) {
    months -= 1
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate()
  }

  if (months <= 0 && days <= 0) return 'สมัครวันนี้'

  const parts: Array<string> = []
  if (months > 0) parts.push(`${months} เดือน`)
  if (days > 0 || parts.length === 0) parts.push(`${days} วัน`)
  return parts.join(' ')
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-0.5 rounded-2xl bg-muted/50 px-4 py-3 text-center">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  )
}

function ProfileHeroCard({ user }: { user: SessionUser }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="relative h-28 bg-gradient-to-br from-primary/50 via-primary/15 to-transparent">
        <div className="absolute -top-10 -left-10 size-40 rounded-full bg-primary/40 blur-3xl" />
        <div className="absolute -top-8 -right-6 size-32 rounded-full bg-sky-400/30 blur-3xl" />
      </div>

      <CardContent className="-mt-12 flex flex-col items-center gap-3 pb-6 text-center">
        <UserAvatar user={user} className="size-24 ring-4 ring-card" />

        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold">{user.name}</span>
            <Badge variant={user.role === 'ADMIN' ? 'default' : 'outline'}>
              {user.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'สมาชิก'}
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </div>

        <div className="mt-2 flex w-full gap-2">
          <StatPill label="เข้าร่วมเมื่อ" value={formatJoinedOn(user.createdAt)} />
          <StatPill label="เป็นสมาชิกมาแล้ว" value={formatMemberFor(user.createdAt)} />
        </div>
      </CardContent>
    </Card>
  )
}

function ManageAccountCard({ user }: { user: SessionUser }) {
  const { signOut, pending } = useSignOut()

  return (
    <Card>
      <CardHeader>
        <CardTitle>จัดการบัญชี</CardTitle>
        <CardDescription>ข้อมูลบัญชีของคุณจากการเข้าสู่ระบบด้วย Google</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">อีเมล</span>
            <span className="text-sm font-medium">{user.email}</span>
          </div>
          {user.emailVerified ? (
            <Badge variant="outline" className="gap-1 border-primary/40 text-primary">
              <CheckCircle2 />
              ยืนยันแล้ว
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1 text-muted-foreground">
              <XCircle />
              ยังไม่ยืนยัน
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">สิทธิ์การใช้งาน</span>
            <span className="text-sm font-medium">
              {user.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'สมาชิกทั่วไป'}
            </span>
          </div>
          <Badge variant={user.role === 'ADMIN' ? 'default' : 'outline'}>{user.role}</Badge>
        </div>

        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          {user.role === 'ADMIN' ? (
            <Button variant="outline" render={<Link to="/admin" />}>
              <LayoutDashboard />
              แผงควบคุมแอดมิน
            </Button>
          ) : null}
          <Button variant="outline" disabled={pending} onClick={signOut}>
            <LogOut />
            ออกจากระบบ
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function Profile() {
  const status = useServerStatus(Route.useLoaderData())
  const { session } = Route.useRouteContext()
  const { user } = session

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar status={status} />

      <main className="mx-auto max-w-4xl px-6 pt-32 pb-24">
        <h1 className="mb-6 text-2xl font-semibold">บัญชีของฉัน</h1>

        <div className="grid gap-6 lg:grid-cols-[340px_1fr] lg:items-start">
          <ProfileHeroCard user={user} />
          <ManageAccountCard user={user} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
