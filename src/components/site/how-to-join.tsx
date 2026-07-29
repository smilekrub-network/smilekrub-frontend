import { SectionHeading } from '#/components/site/section-heading'
import { Stagger, StaggerItem } from '#/components/site/motion-primitives'
import { CopyIpButton } from '#/components/site/copy-ip-button'
import { JOIN_STEPS } from '#/lib/site-content'

export function HowToJoin() {
  return (
    <section id="join" className="bg-card/40 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          label="HOW TO JOIN"
          title="วิธีเข้าเล่น"
          subtitle="4 ขั้นตอนง่าย ๆ ก็เข้ามาสนุกด้วยกันได้เลย"
        />
        <Stagger className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-4">
          {JOIN_STEPS.map((step, i) => (
            <StaggerItem key={step.title} className="relative flex flex-col items-center text-center">
              {i < JOIN_STEPS.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute top-6 left-[calc(50%+1.5rem)] hidden h-0.5 w-[calc(100%-3rem)] bg-border lg:block"
                />
              ) : null}
              <span
                className="relative z-10 flex size-12 shrink-0 items-center justify-center border-2 border-black/50 bg-grass-deep font-mc text-lg text-white shadow-[inset_-2px_-3px_#0006,inset_2px_2px_#ffffff20]"
                style={{ imageRendering: 'pixelated' }}
              >
                {i + 1}
              </span>
              <div className="mt-4 flex flex-col items-center gap-1.5">
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.body}</p>
                {i === 2 ? <CopyIpButton compact className="mt-1" /> : null}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
