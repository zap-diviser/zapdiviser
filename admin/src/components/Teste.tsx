import { useChat } from "./Chat"

const Teste = () => {
  const chat = useChat()

  return (
    <div>
      <h1>Teste</h1>
      <div>
        {chat.messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
    </div>
  )
}

export default Teste
