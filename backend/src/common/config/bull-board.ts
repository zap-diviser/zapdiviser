import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import Queue from 'bull';
import { config } from 'dotenv';
config();

export default function configBullBoard(app: any) {
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/queues');

  const queue = new Queue('flow-event-queue', {
    redis: process.env.REDIS_URL,
  });
  //add login and password

  createBullBoard({
    queues: [new BullAdapter(queue)],
    serverAdapter,
  });

  app.use(
    '/queues',
    (req: any, res: any, next: () => void) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Basic ')) {
          res.statusCode = 401;
          res.header('WWW-Authenticate', 'Basic realm="Restricted"');
          res.send('Unauthorized');
          return;
        }

        const credentials = Buffer.from(authHeader.split(' ')[1], 'base64')
          .toString()
          .split(':');
        const username = credentials[0];
        const password = credentials[1];

        // Replace this with your own authentication logic
        const isValid =
          username === process.env.QUEUES_LOGIN &&
          password === process.env.QUEUES_PASSWORD;
        if (!isValid) {
          res.statusCode = 401;
          res.send('Unauthorized');
          return;
        }

        next();
      } catch (e) {
        console.log('Tentativa de acesso ao bullboard sem credenciais');
      }
    },
    serverAdapter.getRouter(),
  );
}
