import { Server } from 'http';
import websocket from 'websocket';

import { TimelineSubscriber } from '../../controllers/notes';
import { toAPINote } from '../api/entities/note';

export default function(httpServer: Server) {
  const server = new websocket.server({
    httpServer: httpServer,
  });

  server.on('request', req => {
    const query = req.resourceURL.query;
    if (query === null || typeof query === 'string') {
      req.reject(500);
      return;
    }

    const { channel } = query;

    const channels = ['timeline'];

    if (typeof channel !== 'string' || !channels.includes(channel)) {
      req.reject(400);
      return;
    }

    const connection = req.accept();

    switch (channel) {
      case 'timeline': {
        const event = new TimelineSubscriber(event => connection.send(JSON.stringify(toAPINote(event))));

        connection.on('close', () => {
          event.remove();
        });

        break;
      }
    }
  });
}
