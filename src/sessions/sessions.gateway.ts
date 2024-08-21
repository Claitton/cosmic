import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsSessionCommand } from './types';
import { SessionsService } from './sessions.service';
import { PrismaService } from 'src/prisma.service';

@WebSocketGateway({
  cors: {
    origin: "*"
  }
})
export class SessionsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger("session.gateway");

  constructor(
    private readonly sessionsService: SessionsService,
    private readonly prismaService: PrismaService
  ) { }

  @SubscribeMessage("session-input")
  async handleMessage(client: Socket, payload: WsSessionCommand) {
    const { command, sessionId } = payload;
    console.log(command, sessionId)
    const output = await this.sessionsService.sendCommand(command, sessionId);
    this.server.emit("session-output", output, client.id);
  }

  @SubscribeMessage("xterm-input")
  async shellMessage(client: Socket, payload: any) {
    console.log(payload)
    const sshClient = await this.sessionsService.shell(payload.sessionId);
    sshClient.shell({}, {}, (err, stream) => {
      client.on("xterm-input", data => {
        console.log("input", data); 
        stream.write(data)
      });
      stream.on("data", data => {
        console.log("output", data.toString("utf-8"))
        client.emit("xterm-output", data.toString("utf-8"))
      })
    })
    console.log("depois do shell")
    // shell((err, stream) => {
    //   // client.on('xterm-input', (data) => {
    //   //   console.log("xterm-input", data)
    //   //   stream.write(data);
    //   // });
    //   // stream.on('data', (data) => {
    //   //   console.log("xterm-output", data)
    //   //   client.emit('xterm-output', data.toString('utf-8'));
    //   // });
    // })


    return "hello world"
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
