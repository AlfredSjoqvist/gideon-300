import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { format, addDays, subDays } from 'date-fns'
import { Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


export default function GideonBlog() {
  const [darkMode, setDarkMode] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [darkMode])

  useEffect(() => {
    async function fetchEntry() {
      setLoading(true)
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      
      const { data, error } = await supabase
        .from('blog_entries')
        .select('*')
        .eq('entry_date', dateStr)
        .maybeSingle()

      if (error) console.error("Error:", error)
      setEntry(data) 
      setLoading(false)
    }
    fetchEntry()
  }, [selectedDate])

  const timelineDates = [-2, -1, 0, 1, 2].map(d => addDays(selectedDate, d))

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* HEADER */}
      <header className="p-6 flex justify-between items-center max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center">
             <span className="text-white dark:text-black font-serif font-bold text-xl">G</span>
          </div>
          <h1 className="text-2xl font-serif font-bold tracking-tight">Gideon</h1>
        </div>
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* TIMELINE */}
      <div className="py-4 border-b border-black/5 dark:border-white/5 backdrop-blur-md sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4">
          <button onClick={() => setSelectedDate(subDays(selectedDate, 1))} className="p-2 hover:bg-black/5 rounded-full dark:hover:bg-white/10">
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2 justify-center w-full">
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

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-3xl mx-auto w-full p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDate.toString()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 opacity-50 space-y-4">
                <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"/>
                <p className="text-xs tracking-widest uppercase">Decrypting Intelligence...</p>
              </div>
            ) : entry ? (
              <article className="
                /* Typography & Layout */
                prose prose-lg dark:prose-invert max-w-none
                prose-headings:font-serif prose-headings:font-bold 
                
                /* Headings */
                prose-h1:text-4xl prose-h1:mb-8 
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:border-b prose-h2:pb-2 prose-h2:border-gray-200 dark:prose-h2:border-gray-800
                prose-h3:text-xl prose-h3:mt-8 prose-h3:uppercase prose-h3:tracking-wide prose-h3:text-gray-500
                prose-h4:text-lg prose-h4:text-blue-600 dark:prose-h4:text-blue-400 prose-h4:mt-6
                
                /* Body Text */
                prose-p:leading-relaxed prose-p:mb-6
                
                /* Links */
                prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                
                /* Lists (The Gemini Style) */
                prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                prose-li:my-2 prose-li:marker:text-gray-400
              ">
                {/* RENDER MARKDOWN HERE */}
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Optional: Custom overrides if you want specific behavior
                    a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" {...props} />
                  }}
                >
                  {entry.content}
                </ReactMarkdown>
              </article>
            ) : (
              <div className="text-center py-32 opacity-40 italic">
                <p>No intelligence briefing found for {format(selectedDate, 'MMMM do')}.</p>
                <span className="text-3xl mt-4 block">∅</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}