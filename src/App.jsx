import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { format, addDays, subDays } from 'date-fns'
import { Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react'

export default function GideonBlog() {
  const [darkMode, setDarkMode] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date()) // Defaults to today
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(false)

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [darkMode])

  // Fetch Data when date changes
  useEffect(() => {
    async function fetchEntry() {
      setLoading(true)
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      
      console.log(`📅 Fetching for: ${dateStr}`)

      const { data, error } = await supabase
        .from('blog_entries')
        .select('*')
        .eq('entry_date', dateStr)
        .maybeSingle()

      if (error) console.error("❌ Supabase Error:", error)
      
      setEntry(data) 
      setLoading(false)
    }
    fetchEntry()
  }, [selectedDate])

  // Timeline Logic
  const timelineDates = [-2, -1, 0, 1, 2].map(d => addDays(selectedDate, d))

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* --- HEADER --- */}
      <header className="p-6 flex justify-between items-center max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black dark:bg-white rounded-full overflow-hidden flex items-center justify-center">
             {/* Simple Logo Placeholder */}
             <span className="text-white dark:text-black font-serif font-bold text-xl">G</span>
          </div>
          <h1 className="text-2xl font-serif font-bold tracking-tight">Gideon</h1>
        </div>
        
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* --- TIMELINE INTERFACE --- */}
      <div className="py-4 border-b border-black/5 dark:border-white/5 backdrop-blur-md sticky top-0 z-10 bg-white/80 dark:bg-[#111]/80">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4">
          <button onClick={() => setSelectedDate(subDays(selectedDate, 1))} className="p-2 hover:bg-black/5 rounded-full dark:hover:bg-white/10">
            <ChevronLeft size={18} />
          </button>

          <div className="flex gap-2 overflow-hidden justify-center w-full">
            {timelineDates.map((date, i) => {
              const isSelected = i === 2 
              return (
                <motion.button
                  key={date.toString()}
                  layout
                  onClick={() => setSelectedDate(date)}
                  className={`
                    flex flex-col items-center justify-center w-14 h-16 rounded-xl transition-all
                    ${isSelected ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg scale-110' : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-40'}
                  `}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider">{format(date, 'EEE')}</span>
                  <span className="text-xl font-serif">{format(date, 'd')}</span>
                </motion.button>
              )
            })}
          </div>

          <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="p-2 hover:bg-black/5 rounded-full dark:hover:bg-white/10">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 max-w-2xl mx-auto w-full p-8 font-serif">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDate.toString()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-50 space-y-4">
                <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"/>
                <p className="text-sm tracking-widest uppercase">Decryping Intelligence...</p>
              </div>
            ) : entry ? (
              <article className="
                prose prose-lg dark:prose-invert max-w-none 
                prose-headings:font-serif prose-headings:font-bold 
                prose-h1:text-4xl prose-h1:mb-8 
                prose-h2:text-2xl prose-h2:text-claude-accent prose-h2:border-b prose-h2:pb-2 prose-h2:mt-12
                prose-h3:text-xl prose-h3:text-gray-800 dark:prose-h3:text-gray-200 prose-h3:mt-8 prose-h3:uppercase prose-h3:tracking-wide
                prose-h4:text-lg prose-h4:text-blue-600 dark:prose-h4:text-blue-400 prose-h4:mt-6
                prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline 
                prose-li:marker:text-gray-400
              ">
                <div dangerouslySetInnerHTML={{ __html: entry.content }} />
              </article>
            ) : (
              <div className="text-center py-20 opacity-40 italic">
                <p>No intelligence briefing found for {format(selectedDate, 'MMMM do')}.</p>
                <span className="text-2xl mt-4 block">∅</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}