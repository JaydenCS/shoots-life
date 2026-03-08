'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { fetchAllShots } from '@/lib/shots'
import { getSignedUrl } from '@/lib/shots'
import { Shot } from '@/types'

export interface ShotWithUrl extends Shot {
  signedUrl: string
  thumbUrl: string
}

export function useShots(userId: string, initialShots: Shot[] = []) {
  const [shots, setShots] = useState<Shot[]>(initialShots)
  const [shotUrls, setShotUrls] = useState<Record<string, { signedUrl: string; thumbUrl: string }>>({})
  const supabase = createClient()
  const urlCacheRef = useRef<Record<string, { signedUrl: string; thumbUrl: string; expiresAt: number }>>({})

  const loadSignedUrls = useCallback(async (shotsToLoad: Shot[]) => {
    const now = Date.now()
    const needsRefresh = shotsToLoad.filter(s => {
      const cached = urlCacheRef.current[s.date]
      return !cached || cached.expiresAt < now + 60_000 // refresh 1min before expiry
    })

    if (needsRefresh.length === 0) return

    const results = await Promise.all(
      needsRefresh.map(async (s) => {
        const [signedUrl, thumbUrl] = await Promise.all([
          getSignedUrl(supabase, s.photo_url),
          getSignedUrl(supabase, s.photo_url.replace('.jpg', '-thumb.jpg')).catch(() =>
            getSignedUrl(supabase, s.photo_url)
          ),
        ])
        return { date: s.date, signedUrl, thumbUrl, expiresAt: now + 3600_000 }
      })
    )

    results.forEach(r => {
      urlCacheRef.current[r.date] = r
    })

    setShotUrls(prev => {
      const next = { ...prev }
      results.forEach(r => { next[r.date] = { signedUrl: r.signedUrl, thumbUrl: r.thumbUrl } })
      return next
    })
  }, [supabase])

  useEffect(() => {
    // Fetch all shots from Supabase on mount
    fetchAllShots(supabase, userId).then(data => {
      setShots(data)
      loadSignedUrls(data)
    })
  }, [userId, loadSignedUrls, supabase])

  const addOrReplaceShot = useCallback((shot: Shot) => {
    setShots(prev => {
      const filtered = prev.filter(s => s.date !== shot.date)
      return [...filtered, shot].sort((a, b) => a.date.localeCompare(b.date))
    })
  }, [])

  const refreshUrls = useCallback((date: string) => {
    const shot = shots.find(s => s.date === date)
    if (shot) loadSignedUrls([shot])
  }, [shots, loadSignedUrls])

  const shotMap = shots.reduce<Record<string, Shot>>((acc, s) => {
    acc[s.date] = s
    return acc
  }, {})

  return { shots, shotMap, shotUrls, addOrReplaceShot, refreshUrls }
}
