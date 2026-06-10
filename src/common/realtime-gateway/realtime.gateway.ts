import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "node:http";
import { verify } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../../config";
import { ICacheProvider } from "../cache/cache.interface";
import { redisCacheProvider } from "../cache/redis/init";

export class RealtimeGateway {
  private readonly _io: Server;
  private readonly cacheProvider: ICacheProvider;

  constructor(server: HttpServer) {
    this.cacheProvider = redisCacheProvider;
    this._io = new Server(server, { cors: { origin: "*" } });
  }

  public establishConnection() {
    this._io.use((socket: Socket, next: any) => {
      try {
        socket.data = verify(socket.handshake.auth.token, ACCESS_TOKEN_SECRET);
        next();
      } catch (error) {
        next(error);
      }
    });

    this._io.on("connection", async (socket: Socket) => {
      console.log("New Connection: ", socket.id);
      let socketIdsLoginUser = `socketIds:${socket.data.sub}`;
      await this.cacheProvider.addToSet(socketIdsLoginUser, socket.id);
      const socketIds = await this.cacheProvider.getAllFromSet(socketIdsLoginUser);
      console.log(`user with email ${socket.data.email} `, socketIds);

      socket.on("disconnect", async () => {
        await this.cacheProvider.rmSet(socketIdsLoginUser, socket.id);
        console.log("Disconnected: ", socket.id);
      });
    });
  }

  public get io(): Server {
    return this._io;
  }
}
