import { Client } from "ssh2";

type Session = {
    id: string;
    host: string;
    port: number;
    client: Client;
    // running: boolean;
}

type WsSessionCommand = {
    command: string;
    sessionId: string;
}
