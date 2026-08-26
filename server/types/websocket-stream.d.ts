import type { Duplex } from "node:stream";

declare module "websocket-stream" {
  function websocketStream(
    target: unknown,
    options?: { objectMode?: boolean; server?: unknown },
  ): Duplex;
  export = websocketStream;
}
