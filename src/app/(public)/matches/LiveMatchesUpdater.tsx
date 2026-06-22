'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { pusherClient } from '@/lib/pusher-client'

export function LiveMatchesUpdater() {
  const router = useRouter()

  useEffect(() => {
    const channel = pusherClient.subscribe('global')
    
    channel.bind('match-updated', () => {
      // Refresh the page data when any match is updated
      router.refresh()
    })

    return () => {
      pusherClient.unsubscribe('global')
    }
  }, [router])

  return null
}
