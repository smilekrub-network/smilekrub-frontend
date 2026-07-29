import { Link, useRouteContext, useRouterState } from '@tanstack/react-router'
import {
  ChevronsUpDown,
  ExternalLink,
  Gamepad2,
  KeyRound,
  LayoutDashboard,
  Newspaper,
  Settings,
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserAvatar, UserMenuItems } from '#/components/site/user-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { DISCORD_URL } from '#/lib/site-content'
import type { ServerStatus } from '#/lib/server-status'

interface AdminNavItem {
  label: string
  icon: typeof LayoutDashboard
  to: string
  badge?: (status: ServerStatus) => string | null
}

const MANAGE_NAV: Array<AdminNavItem> = [
  { label: 'แดชบอร์ด', icon: LayoutDashboard, to: '/admin' },
  { label: 'ข่าวสาร', icon: Newspaper, to: '/admin/news' },
  {
    label: 'ผู้เล่น',
    icon: Gamepad2,
    to: '/admin/players',
    badge: (status) =>
      status.ok && status.online ? String(status.players.online) : null,
  },
  { label: 'สมิลคีย์', icon: KeyRound, to: '/admin/smilekeys' },
]

const SYSTEM_NAV: Array<AdminNavItem> = [
  { label: 'ตั้งค่าเซิร์ฟเวอร์', icon: Settings, to: '/admin/settings' },
]

function NavGroup({
  label,
  items,
  pathname,
  status,
}: {
  label: string
  items: Array<AdminNavItem>
  pathname: string
  status: ServerStatus
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const badge = item.badge?.(status)

          return (
            <SidebarMenuItem key={item.to}>
              <SidebarMenuButton
                isActive={pathname === item.to}
                tooltip={item.label}
                render={<Link to={item.to} />}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
              {badge ? <SidebarMenuBadge>{badge}</SidebarMenuBadge> : null}
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export function AdminSidebar({ status }: { status: ServerStatus }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  // /admin is guarded, so a session is always present here.
  const { session } = useRouteContext({ from: '/admin' })

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Smilekrub Admin" render={<Link to="/admin" />}>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-mc text-sm">SMILEKRUB NETWORK</span>
                <span className="truncate text-xs text-muted-foreground">
                  แผงควบคุมแอดมิน
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavGroup label="จัดการ" items={MANAGE_NAV} pathname={pathname} status={status} />
        <NavGroup label="ระบบ" items={SYSTEM_NAV} pathname={pathname} status={status} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton size="lg" tooltip="บัญชีแอดมิน">
                    <UserAvatar user={session.user} />
                    <div className="grid flex-1 text-left leading-tight">
                      <span className="truncate text-sm font-medium">{session.user.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {session.user.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent side="right" align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>ทางลัด</DropdownMenuLabel>
                  <DropdownMenuItem render={<Link to="/" />}>
                    <ExternalLink />
                    กลับสู่หน้าเว็บ
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<a href={DISCORD_URL} target="_blank" rel="noreferrer" />}>
                    <ExternalLink />
                    Discord ทีมงาน
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <UserMenuItems showAdminLink={false} />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
