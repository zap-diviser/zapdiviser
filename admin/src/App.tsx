import Chat, { useChat } from "./components/Chat"
import Teste2 from "./components/Teste2"

function App() {
  const { messages } = useChat()

  console.log(messages)

  return (
    <div>
      <h1>Teste</h1>
      <Chat />
      <Teste2 />
    </div>
  )
}

export default App
