import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import { ChatProvider } from "./components/Chat.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChatProvider>
      <App />
    </ChatProvider>
  </React.StrictMode>,
)
