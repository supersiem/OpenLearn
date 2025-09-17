import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { serve } from "@hono/node-server";
import { honoApp, injectWebSocket } from "./hono-server";
import httpProxy from "http-proxy";
import { prisma } from "./utils/prisma";

const port = parseInt(process.env.PORT || "3000", 10);
const honoPort = parseInt(process.env.HONO_PORT || "3001", 10);
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev, turbopack: true });
const handle = app.getRequestHandler();

async function ensureTTLIndexes() {
  const collections = [
    { name: 'User', field: 'scheduledDeletion' },
    { name: 'practice', field: 'scheduledDeletion' },
    { name: 'forum', field: 'scheduledDeletion' },
    { name: 'group', field: 'scheduledDeletion' },
    { name: 'map', field: 'scheduledDeletion' }
  ];

  for (const { name, field } of collections) {
    try {
      const listIndexesResult = await prisma.$runCommandRaw({
        listIndexes: name
      });

      const indexes = (listIndexesResult as any).cursor?.firstBatch || [];

      const ttlIndexExists = indexes.some((index: any) =>
        index.key && index.key[field] === 1 && typeof index.expireAfterSeconds === 'number'
      );

      if (!ttlIndexExists) {
        await prisma.$runCommandRaw({
          createIndexes: name,
          indexes: [
            {
              key: { [field]: 1 },
              name: `${field}_ttl`,
              expireAfterSeconds: 0
            }
          ]
        });
        console.log(`✅ | Created TTL index for ${name}.${field}`);
      }
    } catch (error) {
      console.error(`❌ | Failed to create TTL index for ${name}.${field}:`, error);
    }
  }
}

app.prepare().then(async () => {
  await ensureTTLIndexes();
  const proxy = httpProxy.createProxyServer({
    changeOrigin: true,
    ws: true,
  });

  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);

    if (req.url === "/api/v1/ws") {
      req.url = "/ws";
      proxy.web(req, res, { target: `http://localhost:${honoPort}` });
    } else {
      handle(req, res, parsedUrl);
    }
  });

  server.on("upgrade", (req, socket, head) => {
    if (req.url === "/api/v1/ws") {
      req.url = "/ws";
      proxy.ws(req, socket, head, { target: `ws://localhost:${honoPort}` });
    }
  });

  server.listen(port, () => {
    console.log(`🟢 | Server running on http://localhost:${port}`);
  });

  const honoServer = serve({
    fetch: honoApp.fetch,
    port: honoPort,
  });

  injectWebSocket(honoServer);

  console.log(`🔥 | Hono server running on http://localhost:${honoPort}`);
});