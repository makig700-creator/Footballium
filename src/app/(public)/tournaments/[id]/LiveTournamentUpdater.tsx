'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { pusherClient } from '@/lib/pusher-client'

export function LiveTournamentUpdater({ tournamentId }: { tournamentId: string }) {
  const router = useRouter()

  useEffect(() => {
    // Listen for specific tournament standings updates
    const tournamentChannel = pusherClient.subscribe(`tournament-${tournamentId}`)
    tournamentChannel.bind('standings-updated', () => {
      router.refresh()
    })

    // Listen for global match updates to keep live matches on this page updated
    const globalChannel = pusherClient.subscribe('global')
    globalChannel.bind('match-updated', () => {
      router.refresh()
    })

    return () => {
      pusherClient.unsubscribe(`tournament-${tournamentId}`)
      pusherClient.unsubscribe('global')
    }
  }, [tournamentId, router])

  return null
}
