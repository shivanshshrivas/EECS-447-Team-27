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
      setError('Execution failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-zinc-900 text-white shadow-lg w-full max-w-4xl p-6">
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
          <Input
            className="bg-input text-foreground"
            placeholder="Type a query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') executeQuery()
            }}
            />
            <Button onClick={executeQuery} disabled={loading}>
              {loading ? 'Running...' : 'Execute'}
            </Button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {data.length > 0 && (
            <div className="overflow-auto rounded-md border border-zinc-700">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((col) => (
                      <TableHead key={col} className="text-white">{col}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, idx) => (
                    <TableRow key={idx}>
                      {columns.map((col) => (
                        <TableCell key={col} className="text-white">{row[col]?.toString()}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
