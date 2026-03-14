export default async (request: Request, env: Env) => {
    const url = new URL(request.url);

    // Handle the "Functional" buttons
    if (request.method === "POST") {
        if (url.pathname === "/waitlist" || url.pathname === "/contribute") {
            const body = await request.json();
            // Store the interaction in KV for later
            const timestamp = new Date().toISOString();
            await env.KV_BUCKET.put(`interest:${url.pathname}:${timestamp}`, JSON.stringify(body));
            
            return new Response(JSON.stringify({ message: "Recorded in the archives." }), {
                headers: { "Content-Type": "application/json" }
            });
        }
    }

    // Serve the Visual Mockup
    return new Response(htmlMockup, { headers: { "Content-Type": "text/html" } });
};

const htmlMockup = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hall of Monuments | Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: #0f172a; color: #e2e8f0; font-family: 'Georgia', serif; }
        .monument-card { border: 1px solid #334155; background: #1e293b; transition: transform 0.3s; }
        .monument-card:hover { transform: translateY(-5px); border-color: #94a3b8; }
        .gold-text { color: #fbbf24; }
        .locked { opacity: 0.5; cursor: not-allowed; }
    </style>
</head>
<body class="p-8">
    <header class="text-center mb-16">
        <h1 class="text-5xl font-bold gold-text mb-4">The Hall of Monuments</h1>
        <p class="text-slate-400 italic text-xl">"A record of greatness, etched in stone."</p>
    </header>

    <main class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <div class="monument-card p-6 rounded-lg border-t-4 border-t-blue-500">
            <h3 class="text-2xl font-bold mb-2">The Relic Room</h3>
            <p class="text-sm text-slate-400 mb-4">(Feature Mockup)</p>
            <div class="h-32 bg-slate-800 rounded mb-4 flex items-center justify-center border border-dashed border-slate-600">
                <span class="text-slate-500 italic">No artifacts discovered yet...</span>
            </div>
            <button class="w-full bg-slate-700 py-2 rounded locked">Explore (Locked)</button>
        </div>

        <div class="monument-card p-6 rounded-lg border-t-4 border-t-green-500">
            <h3 class="text-2xl font-bold mb-2">Scroll of Deeds</h3>
            <p class="text-sm text-slate-400 mb-4">(Feature Mockup)</p>
            <ul class="space-y-2 text-slate-500 text-sm italic">
                <li>• Slayed the First Dragon (Placeholder)</li>
                <li>• Reached Level 50 (Placeholder)</li>
            </ul>
            <button class="w-full mt-6 bg-slate-700 py-2 rounded locked">View Deeds (Locked)</button>
        </div>

        <div class="monument-card p-6 rounded-lg border-t-4 border-t-amber-500 shadow-2xl">
            <h3 class="text-2xl font-bold gold-text mb-2">Join the Founders</h3>
            <p class="text-sm text-slate-400 mb-6">Enter the Hall before the gates close.</p>
            
            <input type="email" id="email" placeholder="Enter your email" class="w-full p-2 mb-4 bg-slate-900 border border-slate-700 rounded text-white outline-none focus:border-amber-500">
            
            <div class="flex gap-2">
                <button onclick="submitAction('/waitlist')" class="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 rounded transition">Waitlist</button>
                <button onclick="submitAction('/contribute')" class="flex-1 border border-amber-600 text-amber-500 hover:bg-amber-600 hover:text-white font-bold py-2 rounded transition">Contribute</button>
            </div>
            <p id="status" class="mt-4 text-center text-sm font-bold text-green-400"></p>
        </div>

    </main>

    <script>
        async function submitAction(endpoint) {
            const email = document.getElementById('email').value;
            const status = document.getElementById('status');
            if(!email) return alert('Please enter an email.');

            status.innerText = "Sending to the scrolls...";
            
            try {
                const res = await fetch(endpoint, {
                    method: 'POST',
                    body: JSON.stringify({ email, timestamp: Date.now() })
                });
                const data = await res.json();
                status.innerText = "Success! " + data.message;
                document.getElementById('email').value = "";
            } catch (err) {
                status.innerText = "The courier failed. Try again.";
            }
        }
    </script>
</body>
</html>
`;
