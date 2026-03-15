export const onRequest = async (context) => {
  const { request, env } = context;

  try {
    if (request.method === "POST") {
      const data = await request.json();
      
      // THIS MUST MATCH YOUR SCREENSHOT NAME: ascendii_kv
      await env.Ascendii_kv.put(`user_${Date.now()}`, data.email);

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (err) {
    // This catches the exception so it doesn't crash the whole site
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500 
    });
  }

  return context.next();
};
