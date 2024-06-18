import { Boom } from "@hapi/boom"
import NodeCache from "node-cache"
import makeWASocket, {
  AnyMessageContent,
  delay,
  DisconnectReason,
  downloadMediaMessage,
  fetchLatestBaileysVersion,
  getAggregateVotesInPollMessage,
  makeCacheableSignalKeyStore,
  proto,
  WAMessageContent,
  WAMessageKey
} from "@whiskeysockets/baileys"
import MAIN_LOGGER from "@whiskeysockets/baileys/lib/Utils/logger"
import { useRedisAuthState } from "./auth"
import { Client } from "minio"
import { Readable } from "stream"
import ServerClient from "../client"

function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = []
    stream.on("data", (chunk) => {
      chunks.push(chunk)
    })
    stream.on("end", () => {
      resolve(Buffer.concat(chunks))
    })
    stream.on("error", reject)
  })
}

const minio = new Client({
  endPoint: "minio",
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
})

class Whatsapp {
  instanceId: string
  sock: ReturnType<typeof makeWASocket>
  logger = MAIN_LOGGER.child({})
  msgRetryCounterCache = new NodeCache()
  hasStarted = false
  client: ServerClient

  constructor(instanceId: string, client: ServerClient) {
    this.client = client
    this.instanceId = instanceId

    this.logger.level = "trace"
  }

  async startSock() {
    const { state, saveCreds, clearData } = await useRedisAuthState(this.instanceId)
    const { version, isLatest } = await fetchLatestBaileysVersion()
    console.log(`using WA v${version.join(".")}, isLatest: ${isLatest}`)

    this.sock = makeWASocket({
      version,
      logger: this.logger,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, this.logger)
      },
      msgRetryCounterCache: this.msgRetryCounterCache,
      generateHighQualityLinkPreview: true,
      syncFullHistory: true,
      browser: ["Zapdivizer", "Zapdivizer", "1.0.0"],
    })

    this.sock.ev.process(
      async (events) => {
        if (events["connection.update"]) {
          const update = events["connection.update"]
          const { connection, lastDisconnect, qr } = update

          if (qr) {
            this.client.sendQrCode(qr)
          }

          if (connection === "close") {
            if ([403, DisconnectReason.forbidden].includes((lastDisconnect?.error as Boom)?.output?.statusCode)) {
              await clearData()
              this.client.onBanned(this.getSelfPhone())
            } else {
              if ([401, DisconnectReason.loggedOut].includes((lastDisconnect?.error as Boom)?.output?.statusCode)) {
                await clearData()
                this.client.onLogout(this.getSelfPhone())
              } else {
                this.client.onDisconnected(this.getSelfPhone())
              }
              this.startSock()
            }
          } else if (connection === "connecting") {
            this.client.onConnecting()
          } else if (connection === "open") {
            this.client.onConnected(this.getSelfPhone())
          }
        }

        if (events["creds.update"]) {
          await saveCreds()
        }

        if (events["labels.association"]) {
          console.log(events["labels.association"])
        }

        if (events["labels.edit"]) {
          console.log(events["labels.edit"])
        }

        if (events.call) {
          console.log("recv call event", events.call)
        }

        if (events["messaging-history.set"]) {
          const { chats, contacts, messages, isLatest } = events["messaging-history.set"]
          console.log(`recv ${chats.length} chats, ${contacts.length} contacts, ${messages.length} msgs (is latest: ${isLatest})`)
        }

        if (events["messages.upsert"]) {
          for (const msg of events["messages.upsert"].messages) {
            if (
              msg.key.remoteJid !== "status@broadcast"
              && !msg.key.participant
              && !msg.message?.productMessage
            ) {
              let content: any

              if (msg.message?.audioMessage || msg.message?.imageMessage || msg.message?.videoMessage) {
                const url = `received/${msg.key.remoteJid}/${new Date().toString()}`
                await minio.putObject(
                  "zapdiviser",
                  url,
                  await downloadMediaMessage(msg, "stream", {}, { logger: this.logger, reuploadRequest: this.sock.updateMediaMessage })
                )

                content = {
                  type: "file",
                  file: url,
                  file_type: msg.message?.audioMessage ? "audio" : msg.message?.imageMessage ? "image" : "video"
                }
              } else if (msg.message?.conversation || msg.message?.extendedTextMessage) {
                content = { type: "text", content: msg.message?.conversation || msg.message?.extendedTextMessage?.text }
              }

              if (content) {
                this.client.sendMessage({
                  content,
                  to: `+${msg.key.remoteJid?.split("@")[0]}`,
                  name: msg.key.fromMe ? null : msg.pushName ?? `+${msg.key.remoteJid?.split("@")[0]}`,
                  fromMe: msg.key.fromMe ?? false,
                  from: msg.key.fromMe ? this.getSelfPhone() : `+${msg.key.remoteJid?.split("@")[0]}`
                })
              }
            }
          }
        }

        if (events["messages.update"]) {
          for (const { key, update } of events["messages.update"]) {
            if (update.pollUpdates) {
              const pollCreation = await this.getMessage(key)
              if (pollCreation) {
                console.log(
                  "got poll update, aggregation: ",
                  getAggregateVotesInPollMessage({
                    message: pollCreation,
                    pollUpdates: update.pollUpdates,
                  })
                )
              }
            }
          }
        }

        if (events["message-receipt.update"]) {
          console.log(events["message-receipt.update"])
        }

        if (events["messages.reaction"]) {
          console.log(events["messages.reaction"])
        }

        if (events["presence.update"]) {
          console.log(events["presence.update"])
        }

        if (events["chats.update"]) {
          for (const { id, conversationTimestamp } of events["chats.update"]) {
            if (id && conversationTimestamp) {
              this.client.lastInteraction(`+${id.split("@")[0]}`, conversationTimestamp)
            }
          }
        }

        if (events["chats.upsert"]) {
          console.log("chats upsert ", events["chats.update"])
        }

        if (events["chats.delete"]) {
          console.log("chats deleted ", events["chats.delete"])
        }
      }
    )

    return this.sock
  }

  getSelfPhone() {
    return "+" + this.sock.user?.id?.split(":")[0]
  }

  async sendMessageTyping(msg: AnyMessageContent, phone: string) {
    const result = await this.sock.onWhatsApp(phone).catch(() => null)

    const text = (msg as { text: string }).text ?? (msg as { caption: string }).caption ?? ""

    if (result === null || result.length === 0 || !result[0].jid) {
      return
    }

    const jid = result[0].jid

    await this.sock.presenceSubscribe(jid)
    await delay(100 * Math.random())

    await this.sock.sendPresenceUpdate("composing", jid)
    await delay(text.length * 10 * Math.random())

    await this.sock.sendPresenceUpdate("paused", jid)

    await this.sock.sendMessage(jid, msg)
  }

  private async sendMessageBase(msg: AnyMessageContent, phone: string) {
    const result = await this.sock.onWhatsApp(phone).catch(() => null)

    if (result === null || result.length === 0 || !result[0].jid) {
      return
    }

    const jid = result[0].jid

    await this.sock.sendMessage(jid, msg)
  }

  private async sendMediaMessageBase(url: string, msg: (buffer: Buffer) => AnyMessageContent, phone: string) {
    // @ts-ignore
    minio.getObject("zapdiviser", url, async (err, stream) => {
      if (err) {
        return console.log(err)
      }

      const buffer = await streamToBuffer(stream)

      await this.sendMessageBase(msg(buffer), phone)
      await minio.removeObject("zapdiviser", url)
    })
  }

  async sendAudio(url: string, phone: string) {
    await this.sendMediaMessageBase(url, (buffer) => ({ audio: buffer, mimetype: 'audio/mp4', ptt: true }), phone)
  }

  async sendVideo(url: string, phone: string) {
    await this.sendMediaMessageBase(url, (buffer) => ({ video: buffer }), phone)
  }

  async sendImage(url: string, phone: string) {
    await this.sendMediaMessageBase(url, (buffer) => ({ image: buffer }), phone)
  }

  async sendDocument(url: string, phone: string) {
    await this.sendMediaMessageBase(url, (buffer) => ({ document: buffer, fileName: "test.pdf", mimetype: "application/pdf" }), phone)
  }

  async getMessage(key: WAMessageKey): Promise<WAMessageContent | undefined> {
    return proto.Message.fromObject({})
  }
}

export default Whatsapp
