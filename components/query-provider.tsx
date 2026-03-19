'use client'

import { QueryClient, QueryClientProvider, MutationCache, QueryCache } from '@tanstack/react-query'
import { useState } from 'react'
import { ApiError } from '@/lib/utils'

async function tryRefresh(): Promise<boolean> {
  const res = await fetch('/api/auth/refresh', { method: 'POST' })
  return res.ok
}

function makeQueryClient() {
  const onUnauthorized = async (error: unknown, retry: () => void) => {
    if (!(error instanceof ApiError) || error.status !== 401) return
    const refreshed = await tryRefresh()
    if (refreshed) {
      retry()
    } else {
      window.location.href = '/login'
    }
  }

  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        onUnauthorized(error, () => query.fetch())
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _vars, _ctx, mutation) => {
        onUnauthorized(error, () => mutation.execute(_vars))
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  })
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
