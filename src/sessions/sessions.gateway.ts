import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsSessionCommand } from './types';
import { SessionsService } from './sessions.service';

@WebSocketGateway({ 
  cors: { 
    origin: "*" 
  } 
})
export class SessionsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger("session.gateway");

  constructor(private readonly sessionsService: SessionsService) {}

  @SubscribeMessage("session-input")
  async handleMessage(client: Socket, payload: WsSessionCommand) {
    const { command, sessionId} = payload;
    const output = await this.sessionsService.sendCommand(command, sessionId);

    this.server.emit("session-output", output, client.id);
  }

  handleConnection(client: Socket) {
    this.logger.log("Cliente conectado: " + client.id);
  };

  handleDisconnect(client: Socket) {
    this.logger.log("Cliente desconectado: " + client.id);
  };

  afterInit(server: Server) {
    this.logger.log("Servidor Websocket Iniciado.");
  }
}
