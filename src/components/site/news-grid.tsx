import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { MinecraftTag } from '#/components/ui/minecraft-menu'
import { SectionHeading } from '#/components/site/section-heading'
import { Reveal } from '#/components/site/motion-primitives'
import { cn } from '@/lib/utils'
import type { NewsListItem } from '#/lib/news-api'

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function NewsGrid({ items }: { items: Array<NewsListItem> }) {
  const featured = items.slice(0, 3)

  if (featured.length === 0) return null

  return (
    <section id="news" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="NEWS"
          title="ข่าวสารและอัปเดต"
          subtitle="ติดตามประกาศและกิจกรรมล่าสุดจากทีมงาน"
        />

        <div className="flex flex-col">
          {featured.map((item, i) => (
            <Reveal
              key={item.id}
              delay={i * 0.08}
              className={cn('py-12', i > 0 && 'border-t border-border')}
            >
              <Link
                to="/news/$slug"
                params={{ slug: item.slug }}
                className={cn(
                  'group relative flex flex-col gap-6 transition-transform duration-300 hover:-translate-y-1 lg:items-center lg:gap-10',
                  i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row',
                )}
              >
                <div className="relative aspect-video w-full overflow-hidden border-2 border-black/40 bg-gradient-to-br from-emerald-800 to-emerald-950 transition-shadow duration-300 group-hover:shadow-[0_0_0_3px_var(--color-primary)] lg:w-1/2">
                  {item.coverImageUrl ? (
                    <img
                      src={item.coverImageUrl}
                      alt=""
                      aria-hidden
                      className="absolute inset-0 size-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <MinecraftTag className="absolute bottom-3 left-3 font-mc text-[10px] tracking-wider">
                    {item.category}
                  </MinecraftTag>
                  {i === 0 ? (
                    <MinecraftTag className="absolute top-3 right-3 !bg-primary font-mc text-[10px] tracking-wider !text-primary-foreground animate-pulse-dot">
                      NEW
                    </MinecraftTag>
                  ) : null}
                </div>

                <div className="flex flex-col gap-3 lg:w-1/2">
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 shrink-0 bg-primary" aria-hidden />
                    <p className="text-xs text-muted-foreground">{formatDate(item.publishedAt)}</p>
                  </div>
                  <h3
                    className={cn(
                      'font-mc leading-tight text-foreground transition-colors group-hover:text-primary',
                      i === 0 ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl',
                    )}
                  >
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.subtitle || item.excerpt}</p>
                  <span className="mt-2 inline-flex w-fit items-center gap-2 border-2 border-primary/40 px-4 py-2 font-mc text-[11px] tracking-wide text-primary transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                    อ่านต่อ
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-4 flex justify-center">
          <Link
            to="/news"
            className="group inline-flex items-center gap-2 border-2 border-border px-6 py-3 font-mc text-xs tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            ดูข่าวทั้งหมด
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
