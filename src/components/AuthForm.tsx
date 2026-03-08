'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { createClient } from '@/lib/supabase/client'

type Mode = 'login' | 'signup' | 'forgot'

export default function AuthForm() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const supabase = createClient()

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    setMessage(null)
    setConfirm('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (mode === 'signup' && password !== confirm) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      setLoading(false)
      if (error) setError(error.message)
      else setMessage('Check your email for a password reset link.')
      return
    }

    const { error } =
      mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      window.location.href = '/calendar'
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoFocus
          className="w-full px-4 py-3 rounded-xl border border-ink/10 bg-white/60 font-sans text-ink text-sm placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-amber/40"
        />
        {mode !== 'forgot' && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-xl border border-ink/10 bg-white/60 font-sans text-ink text-sm placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-amber/40"
          />
        )}
        {mode === 'signup' && (
          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-xl border border-ink/10 bg-white/60 font-sans text-ink text-sm placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-amber/40"
          />
        )}

        {mode === 'login' && (
          <div className="flex justify-end -mt-1">
            <button
              type="button"
              onClick={() => switchMode('forgot')}
              className="font-sans text-ink/40 text-xs underline underline-offset-2 hover:text-ink transition-colors"
            >
              Forgot password?
            </button>
          </div>
        )}

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
          {message && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="font-sans text-green-600 text-xs"
            >
              {message}
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
          {loading ? '…' : mode === 'login' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
        </motion.button>
      </form>

      <p className="text-center font-sans text-ink/40 text-xs mt-6">
        {mode === 'forgot' ? (
          <>
            Remember it?{' '}
            <button onClick={() => switchMode('login')} className="text-ink underline underline-offset-2">
              Sign in
            </button>
          </>
        ) : mode === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <button onClick={() => switchMode('signup')} className="text-ink underline underline-offset-2">
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button onClick={() => switchMode('login')} className="text-ink underline underline-offset-2">
              Sign in
            </button>
          </>
        )}
      </p>
    </div>
  )
}
