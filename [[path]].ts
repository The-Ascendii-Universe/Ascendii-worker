interface Env {
    D1_BUCKET: D1Bucket;
    KV_BUCKET: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);

    // This is the "Wheel" that handles the data
    if (request.method === "POST") {
        try {
            const body: any = await request.json();
            const timestamp = new Date().toISOString();
            
            // Save the email to your KV storage
            await env.KV_BUCKET.put(`signup:${url.pathname}:${timestamp}`, body.email);
            
            return new Response(JSON.stringify({ message: "Recorded in the archives." }), {
                headers: { "Content-Type": "application/json" }
            });
        } catch (err) {
            return new Response("Error processing request", { status: 500 });
        }
    }

    // If it's just a regular visit, let Cloudflare serve the index.html we just made
    return next(); 
};
