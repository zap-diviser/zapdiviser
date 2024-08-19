import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useRoutes } from "react-router-dom"
import { Suspense } from "react"

import routes from "~react-pages"

const queryClient = new QueryClient()

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QueryClientProvider client={queryClient}>
        {useRoutes(routes)}
      </QueryClientProvider>
    </Suspense>
  )
}

export default App
