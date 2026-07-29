import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import {
  ArrowLeft,
  CheckCircle2,
  Gamepad2,
  Globe,
  LayoutDashboard,
  LogOut,
  XCircle,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Footer } from '#/components/site/footer'
import { NavBar } from '#/components/site/nav-bar'
import { UserAvatar, useSignOut } from '#/components/site/user-menu'
import { MinecraftTag } from '#/components/ui/minecraft-menu'
import { getServerStatus } from '#/lib/server-status'
import { fetchMyRegistration } from '#/lib/session'
import { useServerStatus } from '#/lib/use-server-status'
import type { SessionUser } from '#/lib/auth-client'
import type { PlayerRegistration } from '#/lib/register-api'

const PIXEL_SHADOW = 'shadow-[4px_4px_0_0_rgba(0,0,0,0.35)] dark:shadow-[4px_4px_0_0_rgba(0,0,0,0.6)]'

// The site renders forced-dark, where `foreground` is near-white — this gives a
// white active pill with dark text while staying on semantic tokens.
const ACTIVE_TAB =
  'gap-2 px-4 data-active:bg-foreground data-active:text-background dark:data-active:border-transparent dark:data-active:bg-foreground dark:data-active:text-background'

export const Route = createFileRoute('/profile')({
  beforeLoad: ({ context, location }) => {
    if (!context.session) {
      throw redirect({ to: '/signin', search: { redirect: location.href } })
    }
    return { session: context.session }
  },
  component: Profile,
  loader: async () => ({
    status: await getServerStatus(),
    registration: await fetchMyRegistration(),
  }),
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
    <div className="flex flex-1 flex-col items-center gap-1 rounded-xl border-2 border-black/20 bg-muted/50 px-4 py-3 text-center dark:border-black/50">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  )
}

function ProfileHeroCard({ user }: { user: SessionUser }) {
  return (
    <Card className={cn('overflow-hidden border-2 border-black/40 p-0 dark:border-black/60', PIXEL_SHADOW)}>
      <div className="relative h-28 bg-gradient-to-br from-primary/50 via-primary/15 to-transparent">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.4) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />
        <div className="absolute -top-10 -left-10 size-40 rounded-full bg-primary/40 blur-3xl" />
        <div className="absolute -top-8 -right-6 size-32 rounded-full bg-sky-400/30 blur-3xl" />
      </div>

      <CardContent className="-mt-12 flex flex-col items-center gap-3 pb-6 text-center">
        <div className="rounded-full border-2 border-black/50 bg-card p-1 shadow-[2px_2px_0_0_rgba(0,0,0,0.4)] dark:border-black/70">
          <UserAvatar user={user} className="size-24" />
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold">{user.name}</span>
            <MinecraftTag color={user.role === 'ADMIN' ? 'gold' : 'aqua'} className="gap-1">
              {user.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'สมาชิก'}
            </MinecraftTag>
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

function GameAccountCard({ registration }: { registration: PlayerRegistration }) {
  return (
    <Card className={cn('border-2 border-black/40 dark:border-black/60', PIXEL_SHADOW)}>
      <CardHeader>
        <CardTitle>ข้อมูลในเกม</CardTitle>
        <CardDescription>บัญชี Minecraft ที่ผูกกับบัญชีเว็บนี้</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center gap-3 rounded-xl border-2 border-black/20 bg-muted/50 px-4 py-3 dark:border-black/50">
          <Avatar className="size-12">
            <AvatarImage
              src={`https://mc-heads.net/avatar/${registration.minecraftUuid}/96`}
              alt=""
            />
            <AvatarFallback>
              {registration.minecraftUsername.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">{registration.minecraftUsername}</span>
            <span className="text-xs text-muted-foreground">Minecraft: Java Edition</span>
          </div>
          <MinecraftTag color="green" className="ml-auto gap-1">
            <CheckCircle2 className="size-3.5" />
            ลงทะเบียนแล้ว
          </MinecraftTag>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">UUID</span>
          <span className="font-mono text-xs break-all">{registration.minecraftUuid}</span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">สมัครเข้าเซิร์ฟเมื่อ</span>
          <span className="text-sm font-medium">{formatJoinedOn(registration.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function ManageAccountCard({
  user,
  showRegisterButton,
}: {
  user: SessionUser
  showRegisterButton: boolean
}) {
  const { signOut, pending } = useSignOut()

  return (
    <Card className={cn('border-2 border-black/40 dark:border-black/60', PIXEL_SHADOW)}>
      <CardHeader>
        <CardTitle>ข้อมูลในเว็บ</CardTitle>
        <CardDescription>ข้อมูลบัญชีของคุณจากการเข้าสู่ระบบด้วย Google</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">อีเมล</span>
            <span className="text-sm font-medium">{user.email}</span>
          </div>
          {user.emailVerified ? (
            <MinecraftTag color="green" className="gap-1">
              <CheckCircle2 className="size-3.5" />
              ยืนยันแล้ว
            </MinecraftTag>
          ) : (
            <MinecraftTag color="red" className="gap-1">
              <XCircle className="size-3.5" />
              ยังไม่ยืนยัน
            </MinecraftTag>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">สิทธิ์การใช้งาน</span>
            <span className="text-sm font-medium">
              {user.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'สมาชิกทั่วไป'}
            </span>
          </div>
          <MinecraftTag
            color={user.role === 'ADMIN' ? 'gold' : 'aqua'}
            className="font-mc gap-1 text-[11px] tracking-wider"
          >
            {user.role}
          </MinecraftTag>
        </div>

        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          {showRegisterButton ? (
            <Button variant="outline" render={<Link to="/register" />}>
              <Gamepad2 />
              สมัครเข้าเซิร์ฟ
            </Button>
          ) : null}
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
  const { status: initialStatus, registration } = Route.useLoaderData()
  const status = useServerStatus(initialStatus)
  const { session } = Route.useRouteContext()
  const { user } = session

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Lobby wallpaper, dimmed behind the page content (same treatment as /signin). */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <img
          src="/wallpaper/smilekrub_lobby.png"
          alt=""
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background/95" />
      </div>

      <NavBar status={status} />

      <main className="relative mx-auto max-w-4xl px-6 pt-32 pb-24">
        <div className="mb-8 flex flex-col items-start gap-2">
          <Button
            variant="ghost"
            size="sm"
            render={<Link to="/" />}
            className="-ml-3 mb-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft data-icon="inline-start" />
            กลับหน้าหลัก
          </Button>
          <MinecraftTag className="font-mc w-fit text-[11px] tracking-wider text-primary">
            MY ACCOUNT
          </MinecraftTag>
          <h1 className="text-2xl font-semibold sm:text-3xl">บัญชีของฉัน</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[340px_1fr] lg:items-start">
          <ProfileHeroCard user={user} />

          {registration ? (
            <Tabs defaultValue="web" className="gap-3">
              <TabsList className="w-full p-1 group-data-horizontal/tabs:h-12">
                <TabsTrigger value="web" className={ACTIVE_TAB}>
                  <Globe data-icon="inline-start" />
                  ข้อมูลในเว็บ
                </TabsTrigger>
                <TabsTrigger value="game" className={ACTIVE_TAB}>
                  <Gamepad2 data-icon="inline-start" />
                  ข้อมูลในเกม
                </TabsTrigger>
              </TabsList>
              <TabsContent value="web">
                <ManageAccountCard user={user} showRegisterButton={false} />
              </TabsContent>
              <TabsContent value="game">
                <GameAccountCard registration={registration} />
              </TabsContent>
            </Tabs>
          ) : (
            <ManageAccountCard user={user} showRegisterButton />
          )}
        </div>
      </main>

      <div className="relative">
        <Footer />
      </div>
    </div>
  )
}
