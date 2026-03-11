export default {
  async fetch(request: Request, env: any) {

    const url = new URL(request.url)

    // Create Handle
    if (request.method === "POST" && url.pathname === "/create-handle") {
      return createHandle(request, env)
    }

    // Submit Quest
    if (request.method === "POST" && url.pathname === "/submit-quest") {
      return submitQuest(request, env)
    }

    // Get Marketplace Items
    if (request.method === "GET" && url.pathname === "/items") {
      return getItems(env)
    }

    return new Response("Not Found", { status: 404 })
  }
}
async function createHandle(request: Request, env: any) {

  const data = await request.json()
  const handle = data.handle
  const userId = crypto.randomUUID()

  await env.ascendii_kv.put(`handle:${handle}`, userId)

  return Response.json({
    success: true,
    handle,
    userId
  })
}
interface Env {
    ascendii_db: any;
    ascendii_kv: any;
}

export default { fetch: (request: Request, env: Env) => {
    return new Response('Ascendii Worker is Live!');
}};
