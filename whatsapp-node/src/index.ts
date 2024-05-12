import Whatsapp from "./whatsapp"
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
