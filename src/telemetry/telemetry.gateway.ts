import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TelemetryDataModel } from './interfaces/telemetry-data';

@WebSocketGateway({
  cors: { origin: '*', methods: ['GET', 'POST'], credentials: true },
})
export class TelemetryGateway {
  @WebSocketServer()
  server: Server;

  emitTelemetryData(data: TelemetryDataModel) {
    const numberOfClients = this.server.sockets.sockets.size;
    if (numberOfClients > 0) {
      this.server.emit('telemetryData', data);
    }
  }
}