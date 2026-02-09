import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { format, addDays, subDays } from 'date-fns'
import { Moon, Sun, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
      
      {/* --- TIMELINE / TOP BAR --- */}
      <div className="py-4 border-b border-black/5 dark:border-white/5 backdrop-blur-md bg-white/80 dark:bg-gray-900/80">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-[1fr_auto_1fr] items-center">
          
          {/* 1. LEFT SPACER */}
          <div className="hidden md:block" /> 

          {/* 2. CENTER: NAVIGATION CLUSTER */}
          <div className="flex items-center gap-2 md:gap-4 justify-center col-span-2 md:col-span-1">
            <button onClick={() => setSelectedDate(subDays(selectedDate, 1))} className="p-2 hover:bg-black/5 rounded-full dark:hover:bg-white/10 transition-colors text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white">
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex gap-2">
              {timelineDates.map((date, i) => {
                const isSelected = i === 2 
                return (
                  <button
                    key={date.toString()}
                    onClick={() => setSelectedDate(date)}
                    className="relative flex flex-col items-center justify-center w-12 h-14 md:w-14 md:h-16 rounded-xl transition-all"
                  >
                    {/* --- SMOOTH SLIDING BACKGROUND --- 
                       We conditionally render this div only for the selected item.
                       'layoutId' performs the magic: it animates the box from the 
                       previous button to this one automatically.
                    */}
                    {isSelected && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-black dark:bg-white rounded-xl shadow-md"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    {/* TEXT CONTENT (Must be z-10 to sit on top of the black box) */}
                    <span className={`relative z-10 text-[10px] uppercase font-bold tracking-wider ${isSelected ? 'text-white dark:text-black' : 'text-gray-500 dark:text-gray-400'}`}>
                      {format(date, 'EEE')}
                    </span>
                    <span className={`relative z-10 text-base md:text-xl font-serif ${isSelected ? 'text-white dark:text-black' : 'text-gray-900 dark:text-gray-100'}`}>
                      {format(date, 'd')}
                    </span>
                  </button>
                )
              })}
            </div>

            <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="p-2 hover:bg-black/5 rounded-full dark:hover:bg-white/10 transition-colors text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* 3. RIGHT: DARK MODE TOGGLE */}
          <div className="flex justify-end col-start-3 row-start-1 md:row-auto">
            <button 
                onClick={() => setDarkMode(!darkMode)} 
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDate.toString()}
            initial={{ opacity: 0, filter: 'blur(5px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(5px)' }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="min-h-[50vh]"
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 opacity-50 space-y-4">
                <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"/>
                <p className="text-xs tracking-widest uppercase">Decrypting Intelligence...</p>
              </div>
            ) : entry ? (
              <article className="
                prose prose-sm md:prose-lg dark:prose-invert max-w-none
                prose-headings:font-serif prose-headings:font-bold 
                
                prose-h1:text-2xl md:prose-h1:text-4xl 
                prose-h1:tracking-tight
                prose-h1:mb-4 prose-h1:leading-tight
                
                prose-h2:text-lg md:prose-h2:text-2xl 
                prose-h2:mt-8 prose-h2:border-b prose-h2:pb-2 
                prose-h2:border-gray-200 dark:prose-h2:border-gray-800
                
                prose-h3:text-xs md:prose-h3:text-lg 
                prose-h3:mt-6 prose-h3:uppercase prose-h3:tracking-widest 
                prose-h3:text-gray-500 dark:prose-h3:text-gray-400 font-sans
                
                prose-h4:text-base md:prose-h4:text-xl 
                prose-h4:text-gray-900 dark:prose-h4:text-gray-100 
                prose-h4:mt-6 prose-h4:mb-2 prose-h4:font-serif
                
                prose-p:text-sm md:prose-p:text-lg
                prose-p:leading-relaxed prose-p:mb-3 md:prose-p:mb-6 
                prose-p:text-gray-800 dark:prose-p:text-gray-300
                
                prose-a:text-amber-700 dark:prose-a:text-amber-500 
                prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                
                prose-ul:my-3 md:prose-ul:my-6 prose-ul:list-disc prose-ul:pl-4 md:prose-ul:pl-6
                prose-li:my-1 md:prose-li:my-2 prose-li:marker:text-gray-400
                
                prose-blockquote:border-l-amber-500 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-white/5 prose-blockquote:py-1 prose-blockquote:px-4
              ">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" {...props} />,
                    
                    h1: ({node, ...props}) => (
                      <div className="flex items-start justify-between group gap-4">
                        <h1 {...props} className="flex-1 m-0" />
                        <button 
                          onClick={handleCopy}
                          className="mt-1 p-2 rounded-lg bg-transparent hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-black dark:hover:text-white transition-all"
                          title="Copy Briefing"
                        >
                          {copied ? <Check size={18} className="text-green-600 dark:text-green-400" /> : <Copy size={18} />}
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