'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'

export default function QueryExecutor() {
  const [query, setQuery] = useState('')
  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const executeQuery = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: queryResult, error } = await supabase.rpc('custom_sql_runner', {
        query_text: query
      })

      if (error) {
        setError(error.message)
        setData([])
        setColumns([])
        return
      }

      const parsed = queryResult.map(row => typeof row === 'string' ? JSON.parse(row) : row)
      setData(parsed)
      setColumns(Object.keys(parsed[0] || {}))
    } catch (err) {
      console.error("Error:", err)
      setError('Execution failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-10 gap-6" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)' }}>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-2">MetaMinds LMS</h1>
        <p className="text-md" style={{ color: 'var(--color-secondary)' }}>Books, Magazines and more</p>
      </motion.div>

      <motion.Card
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="shadow-md w-full max-w-5xl p-6 rounded-xl" style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-foreground)' }}>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Input
                className="border focus:ring-2 text-base"
                style={{ backgroundColor: 'white', color: 'var(--color-foreground)', borderColor: 'var(--color-border)' }}
                placeholder="Type a query..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') executeQuery()
                }}
              />
              <Button
                onClick={executeQuery}
                disabled={loading}
                className="text-white text-sm px-4 py-2 rounded-md"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {loading ? 'Running...' : 'Execute'}
              </Button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {data.length > 0 && (
              <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
                className="max-w-full overflow-x-auto border rounded-lg"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="inline-block min-w-fit">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columns.map((col) => (
                          <TableHead key={col} className="font-semibold text-sm" style={{ color: 'var(--color-foreground)' }}>{col}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((row, idx) => (
                        <TableRow key={idx}>
                          {columns.map((col) => (
                            <TableCell key={col}>{row[col]?.toString()}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </motion.Card>

      <motion.p
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }} 
      className="text-sm" style={{ color: 'var(--color-secondary)' }}>
        View the code on{' '}
        <a
          href="https://github.com/shivanshshrivas/EECS-447-Team-27"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          style={{ color: 'var(--color-primary)' }}
        >
          GitHub
        </a>
      </motion.p>
    </main>
  )
}