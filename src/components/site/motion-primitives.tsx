import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

interface RevealProps extends React.ComponentProps<typeof motion.div> {
  delay?: number
}

export function Reveal({ delay = 0, ...props }: RevealProps) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
      {...props}
    />
  )
}

export function Stagger({ ...props }: React.ComponentProps<typeof motion.div>) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={reduced ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
      {...props}
    />
  )
}

export function StaggerItem({
  ...props
}: React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
      }}
      {...props}
    />
  )
}

export function AnimatedNumber({
  value,
  className,
}: {
  value: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(0)
  const current = useRef(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      current.current = value
      setDisplay(value)
      return
    }
    const controls = animate(current.current, value, {
      duration: 0.8,
      ease: 'easeOut',
      onUpdate: (v) => {
        current.current = v
        setDisplay(Math.round(v))
      },
    })
    return () => controls.stop()
  }, [value, inView, reduced])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {display}
    </span>
  )
}
