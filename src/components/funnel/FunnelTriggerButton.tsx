'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FunnelModal } from './FunnelModal'
import { FunnelId } from './types'
import { getFunnelConfig } from './configs'
import { cn } from '@/lib/utils'

interface FunnelTriggerButtonProps {
  funnelId: FunnelId
  children?: React.ReactNode
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  /** Override the default CTA text from funnel config */
  ctaText?: string
  /** Phone number for urgent CTA */
  phoneNumber?: string
  /** WhatsApp number for urgent CTA */
  whatsappNumber?: string
}

export function FunnelTriggerButton({
  funnelId,
  children,
  variant = 'default',
  size = 'lg',
  className,
  ctaText,
  phoneNumber,
  whatsappNumber,
}: FunnelTriggerButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const config = getFunnelConfig(funnelId)

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={cn(className)}
        onClick={() => setIsOpen(true)}
      >
        {children || ctaText || config.triggerCTA}
      </Button>
      <FunnelModal
        config={config}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        phoneNumber={phoneNumber}
        whatsappNumber={whatsappNumber}
      />
    </>
  )
}
