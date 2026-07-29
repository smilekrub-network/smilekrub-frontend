import { Separator } from '@/components/ui/separator'
import { CopyIpButton } from '#/components/site/copy-ip-button'
import { NAV_LINKS, SOCIAL_LINKS } from '#/lib/site-content'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/60 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-start">
          <div className="flex max-w-sm flex-col gap-3">
            <img
              src="/smilekrub_logo_white.png"
              alt="Smilekrub"
              className="h-8 w-fit"
            />
            <p className="text-sm text-muted-foreground">
              ชุมชนคนรัก Minecraft ของ Smilekrub
            </p>
            <CopyIpButton compact className="mt-1" />
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Smilekrub — Not affiliated with
            Mojang or Microsoft.
          </p>
          <div className="flex items-center gap-4 text-muted-foreground">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="transition-colors hover:text-foreground"
              >
                <social.icon className="size-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
