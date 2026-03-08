export interface Shot {
  id: string
  user_id: string
  photo_url: string // Storage path: "{userId}/{date}.jpg"
  date: string // "YYYY-MM-DD"
  created_at: string
}

export interface CalendarDay {
  date: string // "YYYY-MM-DD"
  isCurrentMonth: boolean
  isToday: boolean
  shot?: Shot
}
