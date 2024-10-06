import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TelemetricDataModel } from './interfaces/telemetric-data';

@WebSocketGateway({
  cors: { origin: '*', methods: ['GET', 'POST'], credentials: true },
})
export class ProcessGateway {
  @WebSocketServer()
  server: Server;

  sendTelemetricData(data: TelemetricDataModel) {
    this.server.emit('telemetricData', data);
  }
}