type MessageBase = {
  from?: string
  to: string
}

type TextMassage = MessageBase & {
  content: string
}

type FileMessage = MessageBase & {
  file: string
  file_type: 'image' | 'document' | 'video' | 'audio'
}

type Message = (TextMassage | FileMessage)

export default Message
