import Pusher from 'pusher';
import configuration from './config';

const config = configuration();

const pusher = new Pusher({
  appId: 'zapdiviser',
  key: config.VITE_SOKETI_APP_KEY,
  secret: config.SOKETI_APP_SECRET,
  useTLS: false,
  host: config.NODE_ENV === 'production' ? 'soketi' : 'localhost',
  cluster: 'us2',
  port: '6001',
});

export default pusher;
