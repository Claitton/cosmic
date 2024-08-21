import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Client } from 'ssh2';
import { Session } from './types';

@Injectable()
export class SessionsService {

    private sessions: Session[] = [];
    private logger: Logger = new Logger("session.service");

    async connect({
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
        const id = randomUUID();
        const c = new Client();
        c.connect({
            host,
            port,
            username,
            password
        });

        c.on("connect", () => this.logger.log("Ssh conectado."));
        c.on("close", () => this.setSessionsIsNotRunning(id));
        
        const response = await new Promise((resolve, reject) => {
            c.on("ready", () => {
                this.logger.log("Ssh ready.");
                this.sessions.push({
                    host,
                    port,
                    client: c,
                    id,
                    running: true
                });
                resolve(true);
            });

            c.on("error", () => {
                this.logger.error("Ssh error.");
                reject(false);
            });
        });

        return {
            response
        }
    }

    async sendCommand(command: string, sessionId: string) {
        let session: Session | null = this.sessions[0];

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

    list() {
        const sessions = this.sessions.map(({ id, host, port }) => ({ id, host, port }));
        return sessions;
    }

    listRunning() {
        return this.sessions
            .filter(session => session.running)
            .map(({ host }) => ({ host }));
    }

    setSessionsIsNotRunning(sessionId: string) {
        for (let i = 0; i < this.sessions.length; i++) {
            if (this.sessions[i].id === sessionId) {
                this.sessions[i].running = false;

                break;
            }
        }

        return;
    }
}
