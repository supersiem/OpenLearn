/*
  _    _              _        _______   _   _   _   _ 
 | |  | |     /\     | |      |__   __| | | | | | | | |
 | |__| |    /  \    | |         | |    | | | | | | | |
 |  __  |   / /\ \   | |         | |    | | | | | | | |
 | |  | |  / ____ \  | |____     | |    |_| |_| |_| |_|
 |_|  |_| /_/    \_\ |______|    |_|    (_) (_) (_) (_)
*/

// POLARLEARN SERVER
// Dit bestand start PolarLearn zelf, wijzig niet tenzij je ECHT weet wat je doet!!!
import 'source-map-support/register';
import { createServer } from "http";
import { parse } from "url";
import next from "next";
import figlet from "figlet";
import gradient from "gradient-string";
import { serve } from "@hono/node-server";
import { honoApp, injectWebSocket } from "./hono-server";
import httpProxy from "http-proxy";
import { prisma } from "./utils/prisma";

console.log(
  gradient(["#38bdf8", "#e0f2fe"]).multiline(
    figlet.textSync("PolarLearn", {
      font: "Slant",
    })
  )
);

const port = parseInt(process.env.PORT || "3000", 10);
const honoPort = parseInt(process.env.HONO_PORT || "3001", 10);
const app = next({ dev: process.env.NODE_ENV !== "production", turbo: true });
const handle = app.getRequestHandler();

// Function to ensure TTL indexes exist for scheduledDeletion fields
async function ensureTTLIndexes() {
  try {
    console.log("🔍 | Checking TTL indexes...");

    // Collections that need TTL indexes on scheduledDeletion field
    const collections = [
      { name: 'User', field: 'scheduledDeletion' },
      { name: 'practice', field: 'scheduledDeletion' },
      { name: 'forum', field: 'scheduledDeletion' },
      { name: 'group', field: 'scheduledDeletion' },
      { name: 'map', field: 'scheduledDeletion' }
    ];

    for (const { name, field } of collections) {
      try {
        // Check if TTL index exists using Prisma's raw MongoDB commands
        const listIndexesResult = await prisma.$runCommandRaw({
          listIndexes: name
        });

        const indexes = (listIndexesResult as any).cursor?.firstBatch || [];

        const ttlIndexExists = indexes.some((index: any) =>
          index.key && index.key[field] === 1 && typeof index.expireAfterSeconds === 'number'
        );

        if (!ttlIndexExists) {
          // Create TTL index using Prisma's raw MongoDB commands
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

    console.log("✅ | TTL index setup complete");
  } catch (error) {
    console.error("❌ | Error setting up TTL indexes:", error);
  }
} app.prepare().then(async () => {
  // Ensure TTL indexes are set up
  await ensureTTLIndexes();

  // Create proxy server for WebSocket forwarding
  const proxy = httpProxy.createProxyServer({
    changeOrigin: true,
    ws: true,
    autoRewrite: true,
    xfwd: true,
  });

  // Start Next.js server with WebSocket forwarding
  const nextServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    if (req.url?.startsWith("/api/v1/ws")) {
      req.url = req.url.replace(/^\/api(\/v1)?\/ws/, "/ws");
      proxy.web(req, res, { target: `http://0.0.0.0:${honoPort}` });
    } else {
      handle(req, res, parsedUrl);
    }
  });

  // Handle WebSocket upgrades for /api/ws and /api/v1/ws
  nextServer.on("upgrade", (req, socket, head) => {
    if (req.url?.startsWith("/api/v1/ws")) {
      req.url = req.url.replace(/^\/api(\/v1)?\/ws/, "/ws");
      proxy.ws(req, socket, head, { target: `ws://0.0.0.0:${honoPort}` });
    } else {
      // Let Next.js handle all other upgrades (e.g. HMR)
      // Do nothing here; Next.js will handle it internally
    }
  });

  nextServer.listen(port, () => {
    console.log(`🟢 | Next.js OK: http://localhost:${port}`);
    console.log(
      `🔌 | WebSocket proxy: ws://localhost:${port}/api/ws -> ws://localhost:${honoPort}/ws`
    );
  });

  // Start Hono server with WebSocket support
  const honoServer = serve({
    fetch: honoApp.fetch,
    port: honoPort,
  });

  injectWebSocket(honoServer);

  console.log(`🔥 | Hono server OK: http://localhost:${honoPort}`);
  console.log(`🔌 | WebSocket beschikbaar op: ws://localhost:${honoPort}/ws`);
});
