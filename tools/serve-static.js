#!/usr/bin/env node
"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");

const root = path.resolve(__dirname, "..");
const args = process.argv.slice(2);

function readArg(name, fallback) {
  const inline = args.find((arg) => arg.startsWith(`--${name}=`));
  if (inline) return inline.slice(name.length + 3);

  const index = args.indexOf(`--${name}`);
  if (index !== -1 && args[index + 1]) return args[index + 1];

  return fallback;
}

const host = readArg("host", process.env.HOST || "127.0.0.1");
const requestedPort = Number(readArg("port", process.env.PORT || "8080"));
const maxPort = requestedPort + 9;

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".webp", "image/webp"],
  [".ico", "image/x-icon"],
]);

function send(res, statusCode, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(statusCode, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function resolveRequestPath(req) {
  const url = new URL(req.url, `http://${req.headers.host || `${host}:${requestedPort}`}`);
  const pathname = decodeURIComponent(url.pathname);
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const filePath = path.resolve(root, relativePath);
  const relativeToRoot = path.relative(root, filePath);

  if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
    return null;
  }

  return filePath;
}

function createServer() {
  return http.createServer((req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      send(res, 405, "Method not allowed");
      return;
    }

    const filePath = resolveRequestPath(req);
    if (!filePath) {
      send(res, 403, "Forbidden");
      return;
    }

    fs.stat(filePath, (statError, stats) => {
      if (statError) {
        send(res, 404, "Not found");
        return;
      }

      const target = stats.isDirectory() ? path.join(filePath, "index.html") : filePath;
      fs.readFile(target, (readError, content) => {
        if (readError) {
          send(res, 404, "Not found");
          return;
        }

        const contentType = mimeTypes.get(path.extname(target).toLowerCase()) || "application/octet-stream";
        res.writeHead(200, {
          "Content-Type": contentType,
          "Cache-Control": "no-store",
        });

        if (req.method === "HEAD") {
          res.end();
          return;
        }

        res.end(content);
      });
    });
  });
}

function listen(port) {
  const server = createServer();

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && port < maxPort) {
      listen(port + 1);
      return;
    }

    console.error(error.message);
    process.exit(1);
  });

  server.listen(port, host, () => {
    console.log(`Gravesmoke Road is running at http://${host}:${port}/`);
    console.log("Press Ctrl+C to stop the server.");
  });
}

listen(requestedPort);
