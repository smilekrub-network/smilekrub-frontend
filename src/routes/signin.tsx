import { createFileRoute, Link, redirect } from '@tanstack/react-router'

import { SignInForm } from '#/components/site/sign-in-form'

/** Only same-site paths are accepted, so `?redirect=` cannot bounce off-site. */
function safeRedirect(value: unknown): string | undefined {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
    ? value
    : undefined
}

export const Route = createFileRoute('/signin')({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => {
    const target = safeRedirect(search.redirect)
    return target ? { redirect: target } : {}
  },
  beforeLoad: ({ context, search }) => {
    if (context.session) {
      throw redirect({ href: search.redirect ?? '/' })
    }
  },
  component: SignIn,
  head: () => ({
    meta: [{ title: 'Smilekrub Network | เข้าสู่ระบบ' }],
  }),
})

function SignIn() {
  const { redirect: redirectTo } = Route.useSearch()

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden p-10 lg:flex">
        <img
          src="/wallpaper/smilekrub_lobby.png"
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/85 to-primary/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />

        <Link to="/" className="relative flex items-center gap-2">
          <img src="/smilekrub_logo_white.png" alt="Smilekrub" className="h-8 w-auto" />
        </Link>

        <div className="relative flex flex-col gap-2">
          <h1 className="font-mc text-4xl text-white drop-shadow-lg">SMILEKRUB NETWORK</h1>
          <p className="text-lg text-white/80">เข้าสู่ระบบเพื่อจัดการบัญชีของคุณ</p>
        </div>

        <p className="relative text-xs text-white/50">
          &copy; {new Date().getFullYear()} Smilekrub Network — Not affiliated with Mojang or Microsoft.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-8 bg-background px-6 py-16">
        <Link to="/" className="flex items-center gap-2 lg:hidden">
          <img src="/smilekrub_logo_white.png" alt="Smilekrub" className="h-8 w-auto" />
        </Link>

        <div className="flex w-full max-w-sm flex-col items-center gap-8 rounded-2xl border border-border bg-card p-8 shadow-lg">
          <div className="flex flex-col items-center gap-3 text-center">
            <img src="/smilekrub_logo.png" alt="" aria-hidden className="size-14" />
            <h2 className="text-2xl font-semibold text-foreground">เข้าสู่ระบบ</h2>
            <p className="text-sm text-muted-foreground">
              เข้าสู่ระบบด้วยบัญชี Google เพื่อสมัครสมาชิกคอมมูนิตี้ Smilekrub
            </p>
          </div>
          <SignInForm redirectTo={redirectTo} />
        </div>
      </div>
    </div>
  )
}
