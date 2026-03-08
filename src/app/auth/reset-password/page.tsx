'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) setError(error.message)
    else setDone(true)
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col gap-10">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-ink mb-2">shoots.life</h1>
          <p className="font-sans text-ink/40 text-sm">Set a new password</p>
        </div>

        {done ? (
          <div className="flex flex-col gap-4 text-center">
            <p className="font-sans text-green-600 text-sm">Password updated. You can now sign in.</p>
            <a
              href="/login"
              className="w-full py-3 rounded-xl bg-ink text-paper font-sans text-sm tracking-wide text-center"
            >
              Go to sign in
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-ink/10 bg-white/60 font-sans text-ink text-sm placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-amber/40"
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border border-ink/10 bg-white/60 font-sans text-ink text-sm placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-amber/40"
            />

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-sans text-red-500 text-xs"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-ink text-paper font-sans text-sm tracking-wide disabled:opacity-40"
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {loading ? '…' : 'Update password'}
            </motion.button>
          </form>
        )}
      </div>
    </main>
  )
}
