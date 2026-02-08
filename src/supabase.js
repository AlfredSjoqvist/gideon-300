import { createClient } from '@supabase/supabase-js'

// 1. SCROLL UP on that page to find the "Project URL"
const supabaseUrl = 'db.plvsuzgfgdtquaeazvqg.supabase.co' 
const supabaseKey = 'sb_publishable_s6kvNOKumKhe0ER8Q1caVw_U2s_1ry3'

export const supabase = createClient(supabaseUrl, supabaseKey)