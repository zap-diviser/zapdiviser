import { Boom } from "@hapi/boom"
import NodeCache from "node-cache"
import makeWASocket, {
  AnyMessageContent,
  delay,
  DisconnectReason,
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
          const upsert = events["messages.upsert"]

          for (const msg of upsert.messages) {
            if (msg.key.remoteJid !== "status@broadcast") {
              if (msg.message?.audioMessage) {}
              let message = msg.message?.conversation
              if (!message) {
                message = msg.message?.extendedTextMessage?.text
              }
              this.client.sendMessage(
                message ?? "",
                `+${msg.key.remoteJid?.split("@")[0]}` ?? "",
                this.getSelfPhone(),
                msg.key.fromMe ?? false
              )
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
          console.log(events["chats.update"])
        }

        if (events["contacts.update"]) {
          for (const contact of events["contacts.update"]) {
            if (typeof contact.imgUrl !== "undefined") {
              const newUrl = contact.imgUrl === null
                ? null
                : await this.sock!.profilePictureUrl(contact.id!).catch(() => null)
              console.log(
                `contact ${contact.id} has a new profile pic: ${newUrl}`,
              )
            }
          }
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
     })
  }

  async sendAudio(url: string, phone: string) {
    await this.sendMediaMessageBase(url, (buffer) => ({ audio: buffer, mimetype: 'audio/mp3', ptt: true }), phone)
  }

  async sendVideo(url: string, phone: string) {
    await this.sendMediaMessageBase(url, (buffer) => ({ video: buffer }), phone)
  }

  async sendImage(url: string, phone: string) {
    await this.sendMediaMessageBase(url, (buffer) => ({ image: buffer }), phone)
  }

  async getMessage(key: WAMessageKey): Promise<WAMessageContent | undefined> {
    return proto.Message.fromObject({})
  }
}

export default Whatsapp
