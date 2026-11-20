import { createServer } from "node:http";

const webOrigin = process.env.METRICS_WEB_ORIGIN ?? "http://127.0.0.1:3000";
const port = Number(process.env.METRICS_API_STUB_PORT ?? 59999);

const server = createServer((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", webOrigin);
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Requested-With");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  response.setHeader("Vary", "Origin");

  if (request.method === "OPTIONS") {
    response.writeHead(204).end();
    return;
  }

  response.writeHead(401, { "Content-Type": "application/json" });
  response.end(
    JSON.stringify({
      success: false,
      message: "No local test session is configured.",
      error: { code: "UNAUTHORIZED" },
    }),
  );
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write(`Local metrics API stub listening on 127.0.0.1:${port}\n`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
