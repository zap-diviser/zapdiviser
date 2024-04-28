import redis from "./redis"
import Whatsapp from "./whatsapp"
import { Worker, Queue } from "bullmq"
import { handleRpc, isJsonRpcRequest } from "typed-rpc/server"

const instanceId = process.env.INSTANCE_ID!

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

const queue = new Queue("FlowTriggers", { connection: redis })

const whatsapp = new Whatsapp(instanceId)

await whatsapp.startSock()

class Service {
  static async sendMessage(text: string, to: string) {
    await whatsapp.sendMessageTyping({ text }, to)
  }

  static async sendFile(file: string, to: string, file_type: 'image' | 'document' | 'video' | 'audio') {
    switch (file_type) {
      case 'audio':
        await whatsapp.sendAudio(file, to)

        break

      case 'video':
        await whatsapp.sendVideo(file, to)

        break

      case 'image':
        await whatsapp.sendImage(file, to)

        break
    }
  }
}

await queue.add("Whatsapp", { event: "ready", instanceId })
await redis.set(`whatsapp:${instanceId}:ready`, "true")

const worker = new Worker<Message>(`MessagesSender:${instanceId}`, async job => {
  if (isJsonRpcRequest(job.data)) {
    await handleRpc(job.data, new Service())
  }
}, { connection: redis })

worker.on("completed", job => {
  console.log(`${job.id} has completed!`)
})

worker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`)
})

whatsapp.onNewMessage(async msg => {
  await queue.add("Whatsapp", { event: "message", instanceId, data: { from: msg.key.remoteJid, content: msg.message?.conversation! } })
})

whatsapp.onQrCode(async qr => {
  await queue.add("Whatsapp", { event: "qr", instanceId, data: qr })
})

whatsapp.onConnecting(async () => {
  await queue.add("Whatsapp", { event: "connecting", instanceId })
})

whatsapp.onConnected(async () => {
  await queue.add("Whatsapp", { event: "connected", instanceId, data: { phone: whatsapp.getSelfPhone() } })
})

whatsapp.onBanned(async () => {
  await queue.add("Whatsapp", { event: "banned", instanceId, data: { phone: whatsapp.getSelfPhone() } })
})

whatsapp.onDisconnected(async () => {
  await queue.add("Whatsapp", { event: "disconnected", instanceId, data: { phone: whatsapp.getSelfPhone() } })
})

whatsapp.onStop(async () => {
  await queue.add("Whatsapp", { event: "stopped", instanceId, data: { phone: whatsapp.getSelfPhone() } })
})

whatsapp.onLogout(async () => {
  await queue.add("Whatsapp", { event: "logout", instanceId, data: { phone: whatsapp.getSelfPhone() } })
})
