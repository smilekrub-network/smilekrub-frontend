import { Outlet, createFileRoute, redirect, useRouterState } from '@tanstack/react-router'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AdminSidebar } from '#/components/site/admin-sidebar'
import { ServerStatusChip } from '#/components/site/server-status-chip'
import { getServerStatus } from '#/lib/server-status'
import { useServerStatus } from '#/lib/use-server-status'

export const Route = createFileRoute('/admin')({
  // Guarding the layout route covers every /admin/* child.
  beforeLoad: ({ context, location }) => {
    if (!context.session) {
      throw redirect({ to: '/signin', search: { redirect: location.href } })
    }
    if (context.session.user.role !== 'ADMIN') {
      throw redirect({ to: '/' })
    }
    return { session: context.session }
  },
  component: AdminLayout,
  loader: () => getServerStatus(),
  head: () => ({
    meta: [{ title: 'Smilekrub Network | แอดมิน' }],
  }),
})

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'แดชบอร์ด',
  '/admin/news': 'ข่าวสาร',
  '/admin/players': 'ผู้เล่น',
  '/admin/smilekeys': 'สมิลคีย์',
  '/admin/settings': 'ตั้งค่าเซิร์ฟเวอร์',
}

function AdminLayout() {
  const status = useServerStatus(Route.useLoaderData())
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <SidebarProvider>
      <AdminSidebar status={status} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/50 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden sm:block">แอดมิน</BreadcrumbItem>
              <BreadcrumbSeparator className="hidden sm:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{PAGE_TITLES[pathname] ?? 'แอดมิน'}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <ServerStatusChip status={status} className="ml-auto" />
        </header>

        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
