import Whatsapp from "./whatsapp/index"
import Client from "./client"
import Worker from "./worker"

const client = new Client()

const whatsapp = new Whatsapp(process.env.INSTANCE_ID!, client)
whatsapp.startSock()

new Worker(whatsapp)

process.on("uncaughtException", async (err) => {
  await client.sendError(err.message)
  process.exit(1)
})

process.on("unhandledRejection", async (err) => {
  await client.sendError(String(err))
  process.exit(1)
})

process.on("SIGINT", async () => {
  await client.sendError("SIGINT")
  process.exit(0)
})

process.on("SIGTERM", async () => {
  await client.sendError("SIGTERM")
  process.exit(0)
})

process.on("exit", async () => {
  await client.sendError("exit")
  process.exit(0)
})
