import { MinecraftTag } from '#/components/ui/minecraft-menu'
import { Reveal } from '#/components/site/motion-primitives'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  label: string
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeading({
  label,
  title,
  subtitle,
  className,
}: SectionHeadingProps) {
  return (
    <Reveal className={cn('mb-12 flex flex-col items-center gap-3 text-center', className)}>
      <MinecraftTag className="font-mc text-[11px] tracking-wider text-primary">
        {label}
      </MinecraftTag>
      <h2 className="text-3xl font-bold text-foreground sm:text-4xl">{title}</h2>
      {subtitle ? (
        <p className="max-w-xl text-muted-foreground">{subtitle}</p>
      ) : null}
    </Reveal>
  )
}
