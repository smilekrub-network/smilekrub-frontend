import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import { Toaster } from '@/components/ui/toast'
import { TooltipProvider } from '@/components/ui/tooltip'
import { fetchSession } from '#/lib/session'
import type { AuthSession } from '#/lib/auth-client'

import appCss from '../styles.css?url'

export interface RouterContext {
  session: AuthSession | null
}

export const Route = createRootRouteWithContext<RouterContext>()({
  // Resolved once per navigation and inherited by every child route, so guards
  // can read `context.session` synchronously.
  beforeLoad: async () => ({ session: await fetchSession() }),
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Smilekrub Network',
      },
      {
        name: 'description',
        content:
          'Smilekrub เซิร์ฟเวอร์ Minecraft สุดอบอุ่น เล่นเลยที่ alpha.sk-mc.net — สร้าง สำรวจ และยิ้มไปด้วยกัน',
      },
      {
        name: 'theme-color',
        content: '#101711',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground antialiased">
        <TooltipProvider>
          <Toaster>
            {children}
            <TanStackDevtools
              config={{
                position: 'bottom-right',
              }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
              ]}
            />
          </Toaster>
        </TooltipProvider>
        <Scripts />
      </body>
    </html>
  )
}
