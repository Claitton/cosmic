import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Client } from 'ssh2';
import { Session } from './types';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SessionsService {

    private sessions: Session[] = [];
    private logger: Logger = new Logger("session.service");

    constructor(private readonly prismaService: PrismaService) {}

    async create({
        host,
        port,
        username,
        password
    }: {
        host: string;
        port: number;
        username: string;
        password: string;
    }) {
        const sessionAlreadyExist = await this.prismaService.session.findFirst({
            where: {
                host,
                port,
            }
        });

        if (sessionAlreadyExist) {
            return {
                message: "This host already exist.",
            }
        };

        const id = randomUUID();
        const _session = {
            id, 
            host,
            port,
            username,
            password,
            running: true
        };

        const session = await this.prismaService.session.create({ data: _session });

        return {
            message: "Session has been created.",
            session
        };
    }

    async connect(sessionId: string) {
        const client = new Client();
        const { host, port, username, password } = await this.prismaService.session.findUnique({ where: { id: sessionId }});

        client.connect({
            host,
            port,
            username,
            password
        });

        client.on("connect", () => this.logger.log("Ssh conectado."));
        // client.on("close", () => this.setSessionsIsNotRunning(sessionId));
        
        const response = await new Promise((resolve, reject) => {
            client.on("ready", async () => {
                
                this.sessions.push({
                    id: sessionId,
                    host,
                    port,
                    // running: true
                    client
                });
                this.logger.log("Ssh ready.");
                resolve(true); 
            });

            client.on("error", () => {
                this.logger.error("Ssh error.");
                reject(false);
            });
        });
    }

    async sendCommand(command: string, sessionId: string) {
        let session: Session | null = this.sessions.filter(session => session.id === sessionId)[0] ?? null;

        if (!session) {
            await this.connect(sessionId);
            session = this.sessions.filter(session => session.id === sessionId)[0];
        }

        const output = await new Promise((resolve, reject) => {
            session.client.exec(command, (err, channel) => {
                if (err) reject(err);

                let output = "";

                channel.on("data", (message: string) => output += `${message}\n`);
                channel.on("exit", () => resolve(output));

            });
        });

        return output;
    }

    async list() {
        const sessions = (await this.prismaService.session.findMany()).map(({ host, port, id, running }) => ({ id, host, port, running }));
        return sessions;
    }

    // listRunning() {
    //     return this.sessions
    //         .filter(session => session.running)
    //         .map(({ host }) => ({ host }));
    // }

    // setSessionsIsNotRunning(sessionId: string) {
    //     for (let i = 0; i < this.sessions.length; i++) {
    //         if (this.sessions[i].id === sessionId) {
    //             // this.sessions[i].running = false;

    //             break;
    //         }
    //     }

    //     return;
    // }
}
