import { useState } from 'react'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { CheckCircle2, KeyRound, Loader2, Search, ShieldCheck } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Footer } from '#/components/site/footer'
import { NavBar } from '#/components/site/nav-bar'
import { MinecraftTag } from '#/components/ui/minecraft-menu'
import { getServerStatus } from '#/lib/server-status'
import { fetchMyRegistration } from '#/lib/session'
import { useServerStatus } from '#/lib/use-server-status'
import { lookupMinecraft, submitRegistration } from '#/lib/register-api'
import type { MojangLookup, PlayerRegistration } from '#/lib/register-api'

const PIXEL_SHADOW = 'shadow-[4px_4px_0_0_rgba(0,0,0,0.35)] dark:shadow-[4px_4px_0_0_rgba(0,0,0,0.6)]'

export const Route = createFileRoute('/register')({
  beforeLoad: ({ context, location }) => {
    if (!context.session) {
      throw redirect({ to: '/signin', search: { redirect: location.href } })
    }
  },
  component: Register,
  loader: async () => ({
    status: await getServerStatus(),
    registration: await fetchMyRegistration(),
  }),
  head: () => ({
    meta: [{ title: 'Smilekrub Network | สมัครเข้าเซิร์ฟ' }],
  }),
})

function mcAvatarUrl(uuid: string) {
  return `https://mc-heads.net/avatar/${uuid}/100`
}

function formatRegisteredDate(iso: string) {
  return new Date(iso).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const LOOKUP_ERROR: Record<string, string> = {
  MC_ACCOUNT_NOT_FOUND: 'ไม่พบไอดีนี้ใน Minecraft: Java Edition กรุณาตรวจสอบชื่ออีกครั้ง',
}

const SUBMIT_ERROR: Record<string, string> = {
  MC_ACCOUNT_NOT_FOUND: 'ไม่พบไอดีนี้ใน Minecraft: Java Edition กรุณาตรวจสอบชื่ออีกครั้ง',
  MC_ACCOUNT_ALREADY_LINKED: 'ไอดีนี้ถูกลงทะเบียนไปแล้วโดยบัญชีอื่น',
  INVALID_SMILEKEY: 'สมิลคีย์ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง',
  SMILEKEY_ALREADY_USED: 'สมิลคีย์นี้ถูกใช้ไปแล้ว',
  ALREADY_REGISTERED: 'คุณลงทะเบียนไปแล้ว',
}

function AlreadyRegisteredCard({ registration }: { registration: PlayerRegistration }) {
  return (
    <Card className={cn('overflow-hidden border-2 border-black/40 p-0 dark:border-black/60', PIXEL_SHADOW)}>
      <div className="relative h-20 bg-gradient-to-br from-primary/50 via-primary/15 to-transparent" />
      <CardContent className="-mt-10 flex flex-col items-center gap-3 pb-8 text-center">
        <div className="rounded-full border-2 border-black/50 bg-card p-1 shadow-[2px_2px_0_0_rgba(0,0,0,0.4)] dark:border-black/70">
          <Avatar className="size-20">
            <AvatarImage src={mcAvatarUrl(registration.minecraftUuid)} alt="" />
            <AvatarFallback>{registration.minecraftUsername.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <MinecraftTag color="green" className="gap-1">
            <CheckCircle2 className="size-3.5" />
            ลงทะเบียนแล้ว
          </MinecraftTag>
          <span className="text-xl font-semibold">{registration.minecraftUsername}</span>
          <span className="text-sm text-muted-foreground">
            สมัครเมื่อ {formatRegisteredDate(registration.createdAt)}
          </span>
        </div>
        <Button variant="outline" render={<Link to="/profile" />} className="mt-2">
          กลับไปหน้าบัญชีของฉัน
        </Button>
      </CardContent>
    </Card>
  )
}

type LookupState =
  | { step: 'idle' }
  | { step: 'loading' }
  | { step: 'error'; message: string }
  | { step: 'found'; account: MojangLookup }

function RegisterForm() {
  const [username, setUsername] = useState('')
  const [lookup, setLookup] = useState<LookupState>({ step: 'idle' })
  const [smileKey, setSmileKey] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<PlayerRegistration | null>(null)

  const confirmed = lookup.step === 'found' ? lookup.account : null

  const onLookup = async () => {
    if (!username.trim()) return
    setLookup({ step: 'loading' })
    const res = await lookupMinecraft(username.trim())
    if (!res.ok) {
      setLookup({ step: 'error', message: LOOKUP_ERROR[res.code ?? ''] ?? 'ไม่สามารถตรวจสอบไอดีได้ กรุณาลองใหม่' })
      return
    }
    setLookup({ step: 'found', account: res.data })
  }

  const onChangeAccount = () => {
    setLookup({ step: 'idle' })
    setSubmitError(null)
  }

  const onSubmit = async () => {
    if (!confirmed || !smileKey.trim()) return
    setSubmitting(true)
    setSubmitError(null)
    const res = await submitRegistration({ minecraftUsername: confirmed.username, smileKey: smileKey.trim() })
    setSubmitting(false)
    if (!res.ok) {
      setSubmitError(SUBMIT_ERROR[res.code ?? ''] ?? 'สมัครไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
      return
    }
    setResult(res.data)
  }

  if (result) {
    return <AlreadyRegisteredCard registration={result} />
  }

  return (
    <Card className={cn('border-2 border-black/40 dark:border-black/60', PIXEL_SHADOW)}>
      <CardHeader>
        <CardTitle>สมัครเข้าเซิร์ฟเวอร์</CardTitle>
        <CardDescription>กรอกไอดี Minecraft และสมิลคีย์เพื่อลงทะเบียนเข้าเล่น</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <Field>
          <FieldLabel htmlFor="mc-username">ชื่อผู้เล่นใน Minecraft</FieldLabel>
          <div className="flex gap-2">
            <Input
              id="mc-username"
              placeholder="เช่น Notch"
              value={username}
              disabled={!!confirmed}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !confirmed && onLookup()}
              aria-invalid={lookup.step === 'error'}
            />
            {!confirmed ? (
              <Button
                type="button"
                variant="outline"
                disabled={lookup.step === 'loading' || !username.trim()}
                onClick={onLookup}
              >
                {lookup.step === 'loading' ? <Loader2 className="animate-spin" /> : <Search />}
                ตรวจสอบ
              </Button>
            ) : (
              <Button type="button" variant="ghost" onClick={onChangeAccount}>
                เปลี่ยนไอดี
              </Button>
            )}
          </div>
          {lookup.step === 'error' ? <FieldError>{lookup.message}</FieldError> : null}
          <FieldDescription>รองรับเฉพาะ Minecraft: Java Edition</FieldDescription>
        </Field>

        {confirmed ? (
          <div className="flex items-center gap-3 rounded-xl border-2 border-black/20 bg-muted/50 px-4 py-3 dark:border-black/50">
            <Avatar className="size-10">
              <AvatarImage src={mcAvatarUrl(confirmed.uuid)} alt="" />
              <AvatarFallback>{confirmed.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{confirmed.username}</span>
              <span className="font-mono text-xs text-muted-foreground">{confirmed.uuid}</span>
            </div>
            <MinecraftTag color="aqua" className="ml-auto gap-1">
              <ShieldCheck className="size-3.5" />
              พบไอดีนี้
            </MinecraftTag>
          </div>
        ) : null}

        <Field>
          <FieldLabel htmlFor="smile-key">สมิลคีย์</FieldLabel>
          <div className="flex gap-2">
            <Input
              id="smile-key"
              placeholder="SMLK-XXXX-XXXX"
              value={smileKey}
              disabled={!confirmed}
              onChange={(e) => setSmileKey(e.target.value.toUpperCase())}
              className="font-mono uppercase"
              aria-invalid={!!submitError}
            />
          </div>
          {submitError ? <FieldError>{submitError}</FieldError> : null}
          <FieldDescription>ขอสมิลคีย์ได้จากทีมงานหรือช่องทางประกาศของเซิร์ฟเวอร์</FieldDescription>
        </Field>

        <Button
          type="button"
          size="lg"
          disabled={!confirmed || !smileKey.trim() || submitting}
          onClick={onSubmit}
        >
          {submitting ? <Loader2 className="animate-spin" /> : <KeyRound />}
          ยืนยันการสมัคร
        </Button>
      </CardContent>
    </Card>
  )
}

function Register() {
  const data = Route.useLoaderData()
  const status = useServerStatus(data.status)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar status={status} />

      <main className="mx-auto max-w-lg px-6 pt-32 pb-24">
        <div className="mb-8 flex flex-col gap-2">
          <MinecraftTag className="font-mc w-fit text-[11px] tracking-wider text-primary">
            JOIN THE SERVER
          </MinecraftTag>
          <h1 className="text-2xl font-semibold sm:text-3xl">สมัครเข้าเซิร์ฟ</h1>
        </div>

        {data.registration ? (
          <AlreadyRegisteredCard registration={data.registration} />
        ) : (
          <RegisterForm />
        )}
      </main>

      <Footer />
    </div>
  )
}
