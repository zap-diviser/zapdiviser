import Whatsapp from "./whatsapp"
import Client from "./client"
import Worker from "./worker"

const whatsapp = new Whatsapp(process.env.INSTANCE_ID!, new Client())
new Worker(whatsapp)

await whatsapp.startSock()
