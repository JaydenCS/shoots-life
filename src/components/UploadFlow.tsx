'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useUpload } from '@/hooks/useUpload'
import { Shot } from '@/types'
import haptics from '@/lib/haptics'

interface UploadFlowProps {
  userId: string
  hasToday: boolean
  onSuccess: (shot: Shot) => void
}

export default function UploadFlow({ userId, hasToday, onSuccess }: UploadFlowProps) {
  const { state, error, inputRef, openPicker, onInputChange } = useUpload(userId, (shot) => {
    haptics.success()
    onSuccess(shot)
  })

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onInputChange}
      />

      <div className="fixed bottom-8 right-6 z-40 flex flex-col items-end gap-2">
        <AnimatePresence>
          {state === 'done' && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="bg-ink/90 text-paper text-xs font-sans px-3 py-1.5 rounded-full"
            >
              Saved.
            </motion.div>
          )}
          {state === 'error' && error && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-500/90 text-white text-xs font-sans px-3 py-1.5 rounded-full"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={openPicker}
          disabled={state === 'uploading'}
          className={`
            w-14 h-14 rounded-full flex items-center justify-center shadow-lg
            disabled:opacity-40
            ${hasToday ? 'bg-ink/70' : 'bg-amber'}
          `}
          whileTap={{ scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          onTapStart={() => haptics.nudge()}
          aria-label={hasToday ? "Replace today's shot" : "Add today's shot"}
        >
          {state === 'uploading' ? (
            <div className="w-5 h-5 border-2 border-paper/40 border-t-paper rounded-full animate-spin" />
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {hasToday ? (
                <>
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </>
              ) : (
                <>
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </>
              )}
            </svg>
          )}
        </motion.button>
      </div>
    </>
  )
}
