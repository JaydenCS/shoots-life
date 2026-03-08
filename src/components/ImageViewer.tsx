'use client'

import { motion, AnimatePresence } from 'motion/react'
import { Shot } from '@/types'
import { formatDisplayDate } from '@/lib/dates'
import haptics from '@/lib/haptics'

interface ImageViewerProps {
  shot: Shot | null
  signedUrl: string | null
  onClose: () => void
}

export default function ImageViewer({ shot, signedUrl, onClose }: ImageViewerProps) {
  function handleClose() {
    haptics.nudge()
    onClose()
  }

  return (
    <AnimatePresence>
      {shot && signedUrl && (
        <motion.div
          key={shot.date}
          className="fixed inset-0 z-50 bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Photo */}
          <img
            src={signedUrl}
            alt={formatDisplayDate(shot.date)}
            className="absolute inset-0 w-full h-full object-contain"
          />

          {/* Close button — top right, always visible */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center"
            aria-label="Close"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="1" y1="1" x2="12" y2="12" />
              <line x1="12" y1="1" x2="1" y2="12" />
            </svg>
          </button>

          {/* Date — bottom center */}
          <div className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-none">
            <span className="font-serif text-white/60 text-sm tracking-wide">
              {formatDisplayDate(shot.date)}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
