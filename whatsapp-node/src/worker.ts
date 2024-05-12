import Message from "./message_types"
import redis from "./redis"
import { Worker as InternalWorker, type Job } from "bullmq"
import type Whatsapp from "./whatsapp"

export default class Worker {
  whatsapp: Whatsapp
  worker: InternalWorker

  constructor(whatsapp: Whatsapp) {
    this.whatsapp = whatsapp

    this.worker = new InternalWorker<Message>(
      `MessagesSender:${process.env.INSTANCE_ID}`,
      job => this[`handle_${job.name}`](job.data),
      { connection: redis }
    )

    this.worker.on("completed", this.completed)
    this.worker.on("failed", this.failed)
  }

  async completed(job: Job) {
    console.log(`${job.id} has completed!`)
  }

  async failed(job?: Job, err?: Error) {
    console.log(`${job?.id} has failed with ${err?.message}`)
  }

  async handle_sendMessage(text: string, to: string) {
    await this.whatsapp.sendMessageTyping({ text }, to)
  }

  async handle_sendFile(file: string, to: string, file_type: 'image' | 'document' | 'video' | 'audio') {
    switch (file_type) {
      case 'audio':
        await this.whatsapp.sendAudio(file, to)

        break

      case 'video':
        await this.whatsapp.sendVideo(file, to)

        break

      case 'image':
        await this.whatsapp.sendImage(file, to)

        break
    }
  }
}
