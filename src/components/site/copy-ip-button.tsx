import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { motion } from 'motion/react'

import { toast } from '@/components/ui/toast'
import { SERVER_IP } from '#/lib/site-content'
import { cn } from '@/lib/utils'

export function CopyIpButton({
  compact = false,
  className,
}: {
  compact?: boolean
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SERVER_IP)
      setCopied(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2000)
      toast.add({
        title: 'คัดลอกแล้ว!',
        description: SERVER_IP,
        type: 'success',
      })
    } catch {
      toast.add({
        title: 'คัดลอกไม่สำเร็จ',
        description: `กรุณาคัดลอกด้วยตนเอง: ${SERVER_IP}`,
        type: 'error',
      })
    }
  }

  return (
    <motion.button
      type="button"
      onClick={copy}
      whileTap={{ scale: 0.96 }}
      className={cn(
        'group inline-flex cursor-pointer items-center gap-2.5 border-2 border-black/70 bg-[#1a1a1a]/95 font-mc text-white shadow-[inset_-2px_-3px_#0008,inset_2px_2px_#ffffff1a] transition-colors hover:border-primary/60',
        compact ? 'px-3 py-1.5 text-xs' : 'px-6 py-3.5 text-base sm:text-lg',
        className,
      )}
      style={{ imageRendering: 'pixelated' }}
      aria-label={`คัดลอก IP เซิร์ฟเวอร์ ${SERVER_IP}`}
    >
      <span className="select-all">{SERVER_IP}</span>
      {copied ? (
        <Check className={cn('text-primary', compact ? 'size-3.5' : 'size-5')} />
      ) : (
        <Copy
          className={cn(
            'text-white/50 transition-colors group-hover:text-primary',
            compact ? 'size-3.5' : 'size-5',
          )}
        />
      )}
    </motion.button>
  )
}
