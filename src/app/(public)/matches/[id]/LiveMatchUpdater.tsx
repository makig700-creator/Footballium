'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { pusherClient } from '@/lib/pusher-client'

export function LiveMatchUpdater({ matchId }: { matchId: string }) {
  const router = useRouter()

  useEffect(() => {
    const channel = pusherClient.subscribe(`match-${matchId}`)
    
    channel.bind('match-updated', () => {
      // Whenever the match is updated by the referee, we ask Next.js to refresh the page data
      // This will silently fetch the latest match state (score, minute, events) from the server
      router.refresh()
    })

    return () => {
      pusherClient.unsubscribe(`match-${matchId}`)
    }
  }, [matchId, router])

  return null
}
