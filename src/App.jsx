import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { format, addDays, subDays } from 'date-fns'
import { Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react'

console.log('=== APP.JSX DEBUG ===')
console.log('supabase import value:', supabase)
console.log('supabase type:', typeof supabase)
console.log('supabase is null:', supabase === null)
console.log('supabase is undefined:', supabase === undefined)
if (supabase) {
  console.log('supabase.from exists:', typeof supabase.from)
  console.log('supabase keys:', Object.keys(supabase).join(', '))
}
console.log('=====================')

export default function GideonBlog() {
  const [darkMode, setDarkMode] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
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
      
      const { data, error } = await supabase
        .from('blog_entries')
        .select('*')
        .eq('date', dateStr)
        .maybeSingle() // Use maybeSingle to avoid errors on empty days

      setEntry(data) 
      setLoading(false)
    }
    fetchEntry()
  }, [selectedDate])

  // Timeline Logic
  const timelineDates = [-2, -1, 0, 1, 2].map(d => addDays(selectedDate, d))

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-claude-accent selection:text-white">
      
      {/* --- HEADER --- */}
      <header className="p-6 flex justify-between items-center max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden border-2 border-gray-400 dark:border-gray-600">
             <img src="https://via.placeholder.com/150" alt="Gideon Logo" className="opacity-50" />
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
      <div className="py-4 border-b border-black/5 dark:border-white/5 backdrop-blur-sm sticky top-0 z-10">
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
                    ${isSelected ? 'bg-claude-text text-claude-bg shadow-lg scale-110' : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-50'}
                    ${darkMode && isSelected ? 'bg-claude-darkText text-claude-darkBg' : ''}
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
              <div className="flex justify-center py-20 opacity-50">Thinking...</div>
            ) : entry ? (
              <article className="prose dark:prose-invert lg:prose-xl">
                {/* We render content directly from Markdown/HTML stored in DB */}
                <div dangerouslySetInnerHTML={{ __html: entry.content }} />
              </article>
            ) : (
              <div className="text-center py-20 opacity-40 italic">
                <p>No entry found for {format(selectedDate, 'MMMM do')}.</p>
                <span className="text-2xl mt-4 block">∅</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}