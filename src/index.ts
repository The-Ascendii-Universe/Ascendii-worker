export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    try {
      switch (pathname) {
        case "/create":
          if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
          return await createHandle(request, env);

        case "/submit":
          return await submitQuest(request, env);

        case "/items":
          return await getItems(request, env);

        default:
          // Check if it's a static asset request before 404ing
          return await serveStaticAssets(request, env);
      }
    } catch (e) {
      return new Response(`Internal Error: ${e instanceof Error ? e.message : 'Unknown'}`, { status: 500 });
    }
  },
};
