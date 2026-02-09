import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { format, addDays, subDays } from 'date-fns'
import { Moon, Sun, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import gideonLogo from './assets/gideon-logo.png' 

export default function GideonBlog() {
  const [darkMode, setDarkMode] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [darkMode])

  // Fetch Entry
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
      setCopied(false)
    }
    fetchEntry()
  }, [selectedDate])

  // Copy Logic
  const handleCopy = () => {
    if (!entry?.content) return
    navigator.clipboard.writeText(entry.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const timelineDates = [-2, -1, 0, 1, 2].map(d => addDays(selectedDate, d))

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* HEADER */}
      {/* Using relative positioning to allow absolute centering of the logo */}
      <header className="relative py-8 px-6 flex justify-between items-end max-w-4xl mx-auto w-full" style={{minHeight: '120px'}}>
        
        {/* --- LEFT: GIDEON TEXT (z-10 to stay on top) --- */}
        <div className="flex-1 flex justify-start z-10">
          <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tighter leading-none text-gray-900 dark:text-gray-100">
            Gideon
          </h1>
        </div>

        {/* --- CENTER: LOGO (Absolutely positioned dead center) --- */}
        {/* Increased size significantly for impact */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center pointer-events-none">
            <div className="w-36 h-36 md:w-44 md:h-44 flex-shrink-0 flex items-center justify-center">
              <img 
                src={gideonLogo} 
                alt="Gideon Logo" 
                className="w-full h-full object-contain dark:invert-0 drop-shadow-sm opacity-95" 
              />
            </div>
        </div>

        {/* --- RIGHT: DARK MODE TOGGLE (z-10 to stay on top) --- */}
        <div className="flex-1 flex justify-end z-10 pb-2">
          <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-sm">
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </header>

      {/* TIMELINE */}
      <div className="py-4 border-b border-black/5 dark:border-white/5 backdrop-blur-md sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4">
          <button onClick={() => setSelectedDate(subDays(selectedDate, 1))} className="p-2 hover:bg-black/5 rounded-full dark:hover:bg-white/10 transition-colors">
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
          <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="p-2 hover:bg-black/5 rounded-full dark:hover:bg-white/10 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-6 md:p-8">
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
                /* --- TYPOGRAPHY BASE --- */
                prose prose-lg dark:prose-invert max-w-none
                prose-headings:font-serif prose-headings:font-bold 
                
                /* --- HEADINGS --- */
                prose-h1:text-4xl prose-h1:mb-8 prose-h1:leading-tight
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:border-b prose-h2:pb-2 
                prose-h2:border-gray-200 dark:prose-h2:border-gray-800
                prose-h3:text-lg prose-h3:mt-8 prose-h3:uppercase prose-h3:tracking-widest 
                prose-h3:text-gray-500 dark:prose-h3:text-gray-400 font-sans
                prose-h4:text-xl prose-h4:text-gray-900 dark:prose-h4:text-gray-100 
                prose-h4:mt-8 prose-h4:mb-2 prose-h4:font-serif
                
                /* --- BODY & LINKS --- */
                prose-p:leading-relaxed prose-p:mb-6 prose-p:text-gray-800 dark:prose-p:text-gray-300
                prose-a:text-amber-700 dark:prose-a:text-amber-500 
                prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                
                /* --- LISTS & EXTRAS --- */
                prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                prose-li:my-2 prose-li:marker:text-gray-400
                prose-blockquote:border-l-amber-500 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-white/5 prose-blockquote:py-1 prose-blockquote:px-4
              ">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" {...props} />,
                    
                    // CUSTOM H1: Copy Button
                    h1: ({node, ...props}) => (
                      <div className="flex items-start justify-between group gap-4">
                        <h1 {...props} className="flex-1 m-0" />
                        <button 
                          onClick={handleCopy}
                          className="mt-2 p-2 rounded-lg bg-transparent hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-black dark:hover:text-white transition-all"
                          title="Copy Briefing"
                        >
                          {copied ? <Check size={20} className="text-green-600 dark:text-green-400" /> : <Copy size={20} />}
                        </button>
                      </div>
                    )
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