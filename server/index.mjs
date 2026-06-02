import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const isApiOnly = process.argv.includes("--api-only");
const port = Number(process.env.PORT || process.env.API_PORT || 8787);
const jsonLimitBytes = 24 * 1024;
const leadWindowMs = 10 * 60 * 1000;
const maxLeadsPerWindow = 5;
const requestLog = new Map();

loadLocalEnv(["N8N_WEBHOOK_URL", "LEAD_SOURCE_LABEL"]);

const server = createServer(async (request, response) => {
  try {
    if (request.method === "OPTIONS" && request.url?.startsWith("/api/")) {
      sendEmpty(response, 204);
      return;
    }

    if (request.url === "/api/health") {
      sendJson(response, 200, {
        ok: true,
        n8nConfigured: Boolean(process.env.N8N_WEBHOOK_URL),
      });
      return;
    }

    if (request.url === "/api/lead" && request.method === "POST") {
      await handleLead(request, response);
      return;
    }

    if (request.url?.startsWith("/api/")) {
      sendJson(response, 404, { ok: false, message: "Endpoint not found." });
      return;
    }

    if (isApiOnly) {
      sendJson(response, 404, { ok: false, message: "API server is running." });
      return;
    }

    serveStatic(request, response);
  } catch (error) {
    console.error("Server error:", error);
    sendJson(response, 500, { ok: false, message: "Server error." });
  }
});

server.listen(port, () => {
  const mode = isApiOnly ? "api-only" : "static+api";
  console.log(`MarineDocs lead server running on http://127.0.0.1:${port} (${mode})`);
});

async function handleLead(request, response) {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    sendJson(response, 429, {
      ok: false,
      message: "Слишком много заявок подряд. Попробуйте позже или свяжитесь напрямую.",
    });
    return;
  }

  let body;

  try {
    body = await readJsonBody(request);
  } catch (error) {
    sendJson(response, error.message === "Request body is too large." ? 413 : 400, {
      ok: false,
      message: error.message === "Request body is too large." ? "Заявка слишком большая." : "Некорректный формат заявки.",
    });
    return;
  }

  const normalized = normalizeLead(body);
  const validationError = validateLead(normalized);

  if (validationError) {
    sendJson(response, 400, { ok: false, message: validationError });
    return;
  }

  if (normalized.website) {
    sendJson(response, 200, { ok: true, message: "Заявка отправлена." });
    return;
  }

  if (!process.env.N8N_WEBHOOK_URL) {
    sendJson(response, 503, {
      ok: false,
      message: "Сервер приема заявок пока не настроен. Используйте email, телефон или мессенджер.",
      fallback: "email",
    });
    return;
  }

  const result = await sendN8nLead(normalized, request);

  if (!result.ok) {
    sendJson(response, 502, {
      ok: false,
      message: "Не удалось отправить заявку автоматически. Используйте email, телефон или мессенджер.",
      fallback: "email",
    });
    return;
  }

  sendJson(response, 200, {
    ok: true,
    message: "Заявка отправлена. Мы свяжемся с вами по указанному контакту.",
  });
}

function normalizeLead(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    name: cleanString(source.name, 80),
    company: cleanString(source.company, 120),
    phone: cleanString(source.phone, 60),
    messenger: cleanString(source.messenger, 80),
    email: cleanString(source.email, 120),
    vesselType: cleanString(source.vesselType, 120),
    taskType: cleanString(source.taskType, 120),
    comment: cleanString(source.comment, 1800),
    consent: source.consent === true,
    website: cleanString(source.website, 120),
  };
}

function validateLead(lead) {
  if (!lead.phone && !lead.messenger && !lead.email) {
    return "Укажите телефон, email или Telegram/WhatsApp для обратной связи.";
  }

  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return "Проверьте email: похоже, в нем ошибка.";
  }

  if (!lead.consent) {
    return "Нужно согласие на обработку персональных данных.";
  }

  if (!lead.taskType) {
    return "Выберите тип задачи.";
  }

  return "";
}

function cleanString(value, maxLength) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

async function sendN8nLead(lead, request) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createLeadPayload(lead, request)),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error("n8n webhook failed:", response.status, response.statusText);
    }

    return { ok: response.ok };
  } catch (error) {
    console.error("n8n webhook failed:", error.message);
    return { ok: false };
  } finally {
    clearTimeout(timeout);
  }
}

function createLeadPayload(lead, request) {
  return {
    source: process.env.LEAD_SOURCE_LABEL || "MarineDocs Engineering",
    receivedAt: new Date().toISOString(),
    pageUrl: getRequestOrigin(request),
    name: lead.name,
    company: lead.company,
    phone: lead.phone,
    messenger: lead.messenger,
    email: lead.email,
    vesselType: lead.vesselType,
    taskType: lead.taskType,
    comment: lead.comment,
    consent: lead.consent,
    website: lead.website,
  };
}

function getRequestOrigin(request) {
  const protocol = getFirstHeaderValue(request.headers["x-forwarded-proto"]) || "https";
  const host = getFirstHeaderValue(request.headers["x-forwarded-host"]) || getFirstHeaderValue(request.headers.host) || "";
  return host ? `${protocol}://${host}` : "";
}

function getFirstHeaderValue(value) {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let body = "";

    request.on("data", (chunk) => {
      size += chunk.length;

      if (size > jsonLimitBytes) {
        reject(new Error("Request body is too large."));
        request.destroy();
        return;
      }

      body += chunk;
    });

    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON."));
      }
    });

    request.on("error", reject);
  });
}

function isRateLimited(ip) {
  const now = Date.now();
  const current = requestLog.get(ip) || [];
  const fresh = current.filter((timestamp) => now - timestamp < leadWindowMs);
  fresh.push(now);
  requestLog.set(ip, fresh);
  return fresh.length > maxLeadsPerWindow;
}

function getClientIp(request) {
  const forwardedFor = request.headers["x-forwarded-for"];
  const value = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
  return value?.split(",")[0]?.trim() || request.socket.remoteAddress || "unknown";
}

function serveStatic(request, response) {
  if (!existsSync(distDir)) {
    sendJson(response, 503, { ok: false, message: "Run npm.cmd run build before npm.cmd run start." });
    return;
  }

  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(url.pathname);
  const safePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  let filePath = path.resolve(distDir, safePath);

  if (!isInsideDir(filePath, distDir)) {
    sendEmpty(response, 403);
    return;
  }

  if (!existsSync(filePath)) {
    filePath = path.join(distDir, "index.html");
  }

  const stats = statSync(filePath);

  if (stats.isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  response.writeHead(200, {
    "Content-Type": getContentType(filePath),
    "Cache-Control": filePath.endsWith("index.html") ? "no-cache" : "public, max-age=31536000, immutable",
  });
  createReadStream(filePath).pipe(response);
}

function getContentType(filePath) {
  const extension = path.extname(filePath);
  const types = {
    ".css": "text/css; charset=utf-8",
    ".gif": "image/gif",
    ".html": "text/html; charset=utf-8",
    ".ico": "image/x-icon",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
  };

  return types[extension] || "application/octet-stream";
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "http://localhost:5173",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(JSON.stringify(payload));
}

function sendEmpty(response, statusCode) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "http://localhost:5173",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end();
}

function isInsideDir(filePath, parentDir) {
  return filePath === parentDir || filePath.startsWith(`${parentDir}${path.sep}`);
}

function loadLocalEnv(keys) {
  const envPath = path.join(rootDir, ".env");

  if (!existsSync(envPath)) {
    return;
  }

  const allowed = new Set(keys);
  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");

    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();

    if (!allowed.has(key) || process.env[key]) {
      continue;
    }

    const rawValue = trimmed.slice(separator + 1).trim();
    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}
