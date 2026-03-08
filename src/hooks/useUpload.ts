'use client'

import { useCallback, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadPhoto, upsertShot } from '@/lib/shots'
import { todayStr } from '@/lib/dates'
import { Shot } from '@/types'

type UploadState = 'idle' | 'selecting' | 'uploading' | 'done' | 'error'

const MAX_DIMENSION = 2048
const THUMB_DIMENSION = 400
const JPEG_QUALITY = 0.85

async function compressImage(file: File, maxDim: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height / width) * maxDim)
          width = maxDim
        } else {
          width = Math.round((width / height) * maxDim)
          height = maxDim
        }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(blob => {
        if (blob) resolve(blob)
        else reject(new Error('Canvas toBlob failed'))
      }, 'image/jpeg', JPEG_QUALITY)
    }
    img.onerror = reject
    img.src = url
  })
}

export function useUpload(userId: string, onSuccess: (shot: Shot) => void) {
  const [state, setState] = useState<UploadState>('idle')
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const supabase = createClient()

  const openPicker = useCallback(() => {
    inputRef.current?.click()
    setState('selecting')
  }, [])

  const handleFile = useCallback(async (file: File) => {
    if (!file) return
    setState('uploading')
    setError(null)

    try {
      const date = todayStr()
      const [fullBlob, thumbBlob] = await Promise.all([
        compressImage(file, MAX_DIMENSION),
        compressImage(file, THUMB_DIMENSION),
      ])

      const [photoUrl] = await Promise.all([
        uploadPhoto(supabase, userId, date, fullBlob),
        uploadPhoto(supabase, userId, date, thumbBlob, '-thumb'),
      ])

      const shot = await upsertShot(supabase, userId, date, photoUrl)
      onSuccess(shot)
      setState('done')

      // Reset to idle after confirmation animation plays
      setTimeout(() => setState('idle'), 2500)
    } catch (err) {
      console.error(err)
      setError('Upload failed. Try again.')
      setState('error')
    }
  }, [supabase, userId, onSuccess])

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    // Reset input so the same file can be re-selected
    e.target.value = ''
  }, [handleFile])

  return { state, error, inputRef, openPicker, onInputChange }
}
