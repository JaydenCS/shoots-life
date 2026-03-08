import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { fetchAllShots } from '@/lib/shots'
import CalendarGrid from '@/components/CalendarGrid'
import SignOutButton from '@/components/SignOutButton'

// The calendar starts from the month the user signed up, or Jan of current year
const START_YEAR = new Date().getFullYear()
const START_MONTH = 1

export default async function CalendarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const shots = await fetchAllShots(supabase, user.id)

  return (
    <main className="min-h-dvh">
      {/* Header */}
      <div className="sticky top-0 z-20 px-4 pt-safe-top">
        <div className="flex items-center justify-between py-4">
          <h1 className="font-serif text-xl text-ink">shoots.life</h1>
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs text-ink/30">
              {shots.length} {shots.length === 1 ? 'shot' : 'shots'}
            </span>
            <SignOutButton />
          </div>
        </div>
      </div>

      {/* Calendar */}
      <Suspense>
        <CalendarGrid
          userId={user.id}
          initialShots={shots}
          startYear={START_YEAR}
          startMonth={START_MONTH}
        />
      </Suspense>

      {/* Bottom padding for FAB */}
      <div className="h-32" />
    </main>
  )
}
