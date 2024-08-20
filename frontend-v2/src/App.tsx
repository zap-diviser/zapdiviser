import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRoutes } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { initFlowbite } from "flowbite";
import routes from "~react-pages";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    initFlowbite();
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QueryClientProvider client={queryClient}>
        {useRoutes(routes)}
      </QueryClientProvider>
    </Suspense>
  );
}

export default App;
