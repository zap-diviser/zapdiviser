import redis from "./redis"
import Whatsapp from "./whatsapp"
import { Worker, Queue } from "bullmq"

const instanceId = process.env.INSTANCE_ID!

interface Message {
  from: string
  to: string
  content: string
}

async function main () {
  const queue = new Queue("FlowTriggers", { connection: redis })

  const whatsapp = new Whatsapp(instanceId)

  await whatsapp.startSock()

  await queue.add("Whatsapp", { event: "ready", instanceId })
  await redis.set(`whatsapp:${instanceId}:ready`, "true")

  const worker = new Worker<Message>(`MessagesSender:${instanceId}`, async job => {
    const { to, content } = job.data

    await whatsapp.sendMessageWTyping({ text: content }, to)
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
}

main()
