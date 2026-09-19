import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Send, Bot, User, Loader2, Info, ArrowRight, Zap, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { DemoDataLabel } from '@/components/shared/DemoBanner'
import { copilotService } from '@/services/copilotService'
import { toast } from '@/hooks/useToast'
import type { CopilotMessage } from '@/types'

const SUGGESTED_QUERIES = [
  'Show critical unresolved issues',
  'How many potholes are there?',
  'Which ward has the most reports?',
  "Summarize today's incidents",
  'Find duplicate reports',
  'What are the oldest unresolved issues?',
  'Show water issues this week',
  'Which department has the highest workload?',
]

export function AICopilotPage() {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `## CivicAI Copilot — Operational Intelligence

I can help you analyze civic infrastructure data across all wards and departments.

**Ask me things like:**
- *"Show critical unresolved issues"*
- *"Which ward has the most reports?"*
- *"Summarize today's incidents"*
- *"Find duplicate reports"*
- *"What are the oldest unresolved issues?"*

I search through civic issue records and provide answers with referenced sources.

> **Note:** Currently running in demo mode. Responses are generated from synthetic demo data. In production, this queries live database records via a RAG pipeline (embedding → vector search → LLM response).`,
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | undefined>()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (query: string) => {
    if (!query.trim() || loading) return

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    }

    const loadingMsg: CopilotMessage = {
      id: `loading-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isLoading: true,
    }

    setMessages((prev) => [...prev, userMsg, loadingMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await copilotService.sendMessage(query, conversationId)
      setConversationId(res.conversationId)

      const assistantMsg: CopilotMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: res.content,
        sources: res.sources,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => prev.filter((m) => !m.isLoading).concat(assistantMsg))
    } catch {
      setMessages((prev) => prev.filter((m) => !m.isLoading))
      toast({ title: 'Copilot error', description: 'Failed to get response', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const resetConversation = () => {
    setMessages((prev) => prev.slice(0, 1))
    setConversationId(undefined)
  }

  // Render markdown-like formatting
  const renderContent = (content: string) => {
    const lines = content.split('\n')
    return lines.map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="text-base font-bold text-gray-900 mt-2 mb-1">{line.slice(3)}</h2>
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-gray-800">{line.slice(2, -2)}</p>
      if (line.startsWith('> ')) return <blockquote key={i} className="border-l-3 border-blue-300 pl-3 text-gray-500 text-sm italic my-1">{line.slice(2)}</blockquote>
      if (line.startsWith('• ') || line.startsWith('- ')) return <li key={i} className="ml-4 text-gray-700 text-sm">{line.slice(2)}</li>
      if (line.startsWith('*')) return <li key={i} className="ml-4 text-gray-600 text-sm italic">{line.slice(1).replace(/\*/g, '').trim()}</li>
      if (line === '') return <br key={i} />

      // Bold text inline
      const boldParts = line.split(/\*\*(.*?)\*\*/g)
      if (boldParts.length > 1) {
        return (
          <p key={i} className="text-sm text-gray-700 leading-relaxed">
            {boldParts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
          </p>
        )
      }
      return <p key={i} className="text-sm text-gray-700 leading-relaxed">{line}</p>
    })
  }

  return (
    <div className="flex flex-col h-screen p-6 max-w-5xl mx-auto gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            AI Civic Copilot
          </h1>
          <p className="text-gray-500 text-sm flex items-center gap-2 mt-0.5">
            RAG-powered infrastructure intelligence <DemoDataLabel />
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={resetConversation}>
            <RotateCcw className="h-3.5 w-3.5" /> New Chat
          </Button>
        </div>
      </div>

      {/* RAG info banner */}
      <div className="flex items-start gap-2 bg-purple-50 border border-purple-100 rounded-lg p-3 text-xs text-purple-700 flex-shrink-0">
        <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <span>
          <strong>RAG Pipeline:</strong> Your query → embeddings → vector search (ChromaDB/pgvector) → relevant civic records → LLM synthesis → answer with sources.
          In demo mode, responses are generated from the in-memory demo dataset without real vector search.
        </span>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Chat area */}
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'assistant'
                      ? 'bg-gradient-to-br from-blue-600 to-purple-600'
                      : 'bg-gray-200'
                  }`}>
                    {msg.role === 'assistant'
                      ? <Bot className="h-4 w-4 text-white" />
                      : <User className="h-4 w-4 text-gray-600" />
                    }
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-white border shadow-sm rounded-tl-sm'
                  }`}>
                    {msg.isLoading ? (
                      <div className="flex items-center gap-2 py-1">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        <span className="text-sm text-gray-500">Searching civic records...</span>
                      </div>
                    ) : msg.role === 'user' ? (
                      <p className="text-sm text-white">{msg.content}</p>
                    ) : (
                      <div className="space-y-1">
                        {renderContent(msg.content)}

                        {/* Sources */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 mb-1.5">
                              Sources ({msg.sources.length} records)
                            </p>
                            <div className="space-y-1">
                              {msg.sources.map((s) => (
                                <Link
                                  key={s.issueId}
                                  to={`/admin/issues/${s.issueId}`}
                                  className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  <ArrowRight className="h-3 w-3 flex-shrink-0" />
                                  <span className="font-mono">{s.issueNumber}</span>
                                  <span className="text-gray-500 truncate">— {s.snippet}</span>
                                  <span className="ml-auto text-gray-400 flex-shrink-0">
                                    {(s.relevance * 100).toFixed(0)}% match
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex gap-2 flex-shrink-0">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about civic issues, wards, departments, trends..."
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !input.trim()} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send
            </Button>
          </form>
        </div>

        {/* Suggestions sidebar */}
        <div className="w-56 flex-shrink-0 space-y-3 hidden lg:block">
          <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            Suggested Queries
          </h3>
          <div className="space-y-2">
            {SUGGESTED_QUERIES.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                disabled={loading}
                className="w-full text-left text-xs p-2.5 rounded-lg border bg-white hover:bg-blue-50 hover:border-blue-200 transition-colors text-gray-600 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
