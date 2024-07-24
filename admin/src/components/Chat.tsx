import React, { createContext, useState } from "react";

const chatContext = createContext<{
  messages: string[];
  addMessage: (message: string) => void;
  onMessage: (message: string) => void;
}>({
  messages: [],
  addMessage: () => {},
  onMessage: () => {},
});

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const addMessage = (message: string) => {
    setMessages((messages) => [...messages, message]);
  };
  const onMessage = (message: string) => {
    addMessage(message);
  };

  return (
    <chatContext.Provider value={{ messages, addMessage, onMessage }}>
      {children}
    </chatContext.Provider>
  );
}

const Chat: React.FC = () => {
  const chat = useChat();

  const [message, setMessage] = useState("");

  const addMessage = (message: string) => {
    chat.addMessage(message);
    chat.messages.push(message);
    setMessage("");
  }

  return (
    <div>
      {chat.messages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
      <input
        type="text"
        value={message}
        onChange={(event) => setMessage(event.currentTarget.value)}
      />
      <button onClick={() => addMessage(message)}>Send</button>
    </div>
  );
}

export const useChat = () => React.useContext(chatContext);

export default Chat;
