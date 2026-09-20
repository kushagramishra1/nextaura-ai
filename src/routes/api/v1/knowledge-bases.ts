import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { authenticateApiKey, corsHeaders } from "@/lib/nexora/api-auth";

export const Route = createFileRoute("/api/v1/knowledge-bases")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: corsHeaders() }),
      GET: async ({ request }) => {
        const headers = corsHeaders();
        const principal = await authenticateApiKey(request.headers.get("authorization"));
        if (!principal) {
          return Response.json(
            { error: "Invalid or revoked API key" },
            { status: 401, headers },
          );
        }
        const sql = await getSql();
        const rows = await sql<{ id: string; name: string; description: string }>`
          select id, name, description from knowledge_bases
          where org_id = ${principal.orgId}
          order by created_at asc
        `;
        return Response.json({ knowledge_bases: rows }, { headers });
      },
    },
  },
});
