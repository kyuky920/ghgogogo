import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)

export type Registration = {
  id: string
  visitor_name: string
  introducer_name: string | null
  school: string | null
  visit_path: string | null
  grade: number | null
  with_friend: boolean
  with_guardian: boolean
  created_at: string
}
