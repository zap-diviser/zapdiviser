import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useRoutes } from "react-router-dom"

import routes from "~react-pages"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {useRoutes(routes)}
    </QueryClientProvider>
  )
}

export default App
