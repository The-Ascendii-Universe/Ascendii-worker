// src/index.ts
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
return await getAssetFromKV(
  { request, waitUntil: ctx.waitUntil.bind(ctx) },
  {
    ASSET_NAMESPACE: env.__STATIC_CONTENT, // ← add this line
    mapRequestToAsset: (req: Request) => {
      const parsed = new URL(req.url);
      if (!parsed.pathname.includes('.') && !parsed.pathname.startsWith('/api')) {
        return new Request(`${parsed.origin}/index.html`, { ...req });
      }
      return req;
    },
  }
interface Env {
  ascendii_db: D1Database;
  ascendii_kv: KVNamespace;
  // ASSETS is auto-bound when using [site] in wrangler.toml
}

async function createHandle(request: Request, env: Env): Promise<Response> {
  try {
    const data = await request.json<{ handle: string }>();
    const handle = data.handle?.trim();
    if (!handle || handle.length < 3) {
      return Response.json({ success: false, error: "Invalid handle" }, { status: 400 });
    }

    const userId = crypto.randomUUID();
    await env.ascendii_kv.put(`handle:${handle}`, userId, { expirationTtl: 60 * 60 * 24 * 365 }); // 1 year example

    return Response.json({ success: true, handle, userId });
  } catch (err) {
    return Response.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }
}

// Stub for missing functions (implement as needed)
async function submitQuest(request: Request, env: Env): Promise<Response> {
  // TODO: Parse body, save to D1, update reputation/NFT progress, etc.
  return Response.json({ success: false, message: "Quest submission not implemented yet" }, { status: 501 });
}

async function getItems(env: Env): Promise<Response> {
  // TODO: Query D1 or KV for marketplace items
  return Response.json({ items: [], message: "Marketplace items coming soon" });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // API Routes (priority over static files)
    if (request.method === "POST" && url.pathname === "/create-handle") {
      return createHandle(request, env);
    }
    if (request.method === "POST" && url.pathname === "/submit-quest") {
      return submitQuest(request, env);
    }
    if (request.method === "GET" && url.pathname === "/items") {
      return getItems(env);
    }

    // Serve React static assets (uploaded to KV via [site] in wrangler.toml)
    try {
      return await getAssetFromKV(
        { request, waitUntil: ctx.waitUntil.bind(ctx) },
        {
          mapRequestToAsset: (req: Request) => {
            const parsed = new URL(req.url);
            // SPA support: serve index.html for non-file paths (React Router handles /profile etc.)
            if (!parsed.pathname.includes('.') && !parsed.pathname.startsWith('/api')) {
              return new Request(`${parsed.origin}/index.html`, { ...req });
            }
            return req;
          },
        }
      );
    } catch (e) {
      console.error(e);
      return new Response('Asset not found', { status: 404 });
    }
  },
};
