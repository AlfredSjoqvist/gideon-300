import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://plvsuzgfgdtquaeazvqg.supabase.co'
const supabaseKey = 'sb_publishable_s6kvNOKumKhe0ER8Q1caVw_U2s_1ry3'

console.log('=== SUPABASE.JS DEBUG ===')
console.log('URL:', JSON.stringify(supabaseUrl))
console.log('URL type:', typeof supabaseUrl)
console.log('URL length:', supabaseUrl.length)
console.log('Starts with https:', supabaseUrl.startsWith('https://'))
console.log('Key first 30 chars:', supabaseKey.substring(0, 30))
console.log('Key length:', supabaseKey.length)
console.log('=========================')

let supabase
try {
  supabase = createClient(supabaseUrl, supabaseKey)
  console.log('Supabase client created successfully')
} catch (e) {
  console.error('Supabase client creation FAILED:', e.message)
  console.error('Full error:', e)
}

export { supabase }