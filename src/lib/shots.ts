import { Shot } from '@/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function fetchShots(
  supabase: SupabaseClient,
  userId: string,
  year: number,
  month: number
): Promise<Shot[]> {
  const start = `${year}-${String(month).padStart(2, '0')}-01`
  const end = `${year}-${String(month).padStart(2, '0')}-31`

  const { data, error } = await supabase
    .from('shots')
    .select('id, user_id, photo_url, date, created_at')
    .eq('user_id', userId)
    .gte('date', start)
    .lte('date', end)
    .order('date', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function fetchAllShots(
  supabase: SupabaseClient,
  userId: string
): Promise<Shot[]> {
  const { data, error } = await supabase
    .from('shots')
    .select('id, user_id, photo_url, date, created_at')
    .eq('user_id', userId)
    .order('date', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function upsertShot(
  supabase: SupabaseClient,
  userId: string,
  date: string,
  photoUrl: string
): Promise<Shot> {
  const { data, error } = await supabase
    .from('shots')
    .upsert(
      { user_id: userId, date, photo_url: photoUrl },
      { onConflict: 'user_id,date' }
    )
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteShot(
  supabase: SupabaseClient,
  userId: string,
  date: string
): Promise<void> {
  const { error } = await supabase
    .from('shots')
    .delete()
    .eq('user_id', userId)
    .eq('date', date)

  if (error) throw error
}

export async function getSignedUrl(
  supabase: SupabaseClient,
  path: string,
  expiresIn = 3600
): Promise<string> {
  const { data, error } = await supabase.storage
    .from('shots')
    .createSignedUrl(path, expiresIn)

  if (error) throw error
  return data.signedUrl
}

// Upload a file blob to storage and return the storage path
export async function uploadPhoto(
  supabase: SupabaseClient,
  userId: string,
  date: string,
  blob: Blob,
  suffix = ''
): Promise<string> {
  const path = `${userId}/${date}${suffix}.jpg`

  const { error } = await supabase.storage
    .from('shots')
    .upload(path, blob, { contentType: 'image/jpeg', upsert: true })

  if (error) throw error
  return path
}
