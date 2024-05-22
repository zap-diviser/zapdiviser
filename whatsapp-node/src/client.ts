import { Queue } from "bullmq"
import redis from "./redis"

const instanceId = process.env.INSTANCE_ID!

class Client {
  queue: Queue

  constructor() {
    this.queue = new Queue("FlowTriggers", { connection: redis })
    this.queue.add("Whatsapp", { event: "ready", instanceId })
    redis.set(`whatsapp:${instanceId}:ready`, "true")
  }

  async sendError(error: string) {
    await this.queue.add("error", { instanceId, data: { error } })
  }

  async sendMessage({ text, to, from, name, fromMe }: { text: string, to: string, from?: string, name: string | null, fromMe: boolean }) {
    await this.queue.add("message", { instanceId, data: { from, to, content: text, name, fromMe } })
  }

  async sendFile(file: string, to: string, file_type: 'image' | 'document' | 'video' | 'audio', from) {
    await this.queue.add("file", { instanceId, data: { from, to, file, file_type } })
  }

  async sendQrCode(qr: string) {
    await this.queue.add("qr", { instanceId, data: qr })
  }

  async onConnecting() {
    await this.queue.add("connecting", { instanceId })
  }

  async onConnected(phone: string) {
    await this.queue.add("connected", { instanceId, data: { phone } })
  }

  async onBanned(phone: string) {
    await this.queue.add("banned", { instanceId, data: { phone } })
  }

  async onDisconnected(phone: string) {
    await this.queue.add("disconnected", { instanceId, data: { phone } })
  }

  async onStop(phone: string) {
    await this.queue.add("stopped", { instanceId, data: { phone } })
  }

  async onLogout(phone: string) {
    await this.queue.add("logout", { instanceId, data: { phone } })
  }

  async lastInteraction(phone: string, lastInteraction: number) {
    await this.queue.add("chat-last-interaction", { instanceId, data: { phone, lastInteraction } })
  }
}

export default Client
