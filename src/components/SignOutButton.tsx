'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { createClient } from '@/lib/supabase/client'

export default function SignOutButton() {
  const [confirm, setConfirm] = useState(false)
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="relative flex items-center">
      <AnimatePresence mode="wait">
        {confirm ? (
          <motion.div
            key="confirm"
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          >
            <button
              onClick={() => setConfirm(false)}
              className="font-sans text-xs text-ink/40"
            >
              Cancel
            </button>
            <button
              onClick={handleSignOut}
              className="font-sans text-xs text-red-400"
            >
              Sign out
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="trigger"
            onClick={() => setConfirm(true)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-ink/30 hover:text-ink/60 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Sign out"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
