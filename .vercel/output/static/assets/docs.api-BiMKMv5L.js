import{u as e}from"./utils-DE3IZn_Q.js";import{t}from"./link-BP0a1hUK.js";import{t as n}from"./button-Dvo9zKpq.js";import{n as r}from"./brand-mark-B7B4u1rq.js";var i=e();function a({children:e}){return(0,i.jsx)(`pre`,{className:`overflow-x-auto rounded-lg border border-border bg-surface p-4 font-mono text-xs leading-relaxed text-fg`,children:e})}function o(){return(0,i.jsxs)(`div`,{className:`min-h-dvh bg-bg text-fg`,children:[(0,i.jsxs)(`header`,{className:`mx-auto flex max-w-3xl items-center justify-between px-4 py-6`,children:[(0,i.jsx)(t,{to:`/`,children:(0,i.jsx)(r,{})}),(0,i.jsx)(n,{asChild:!0,variant:`outline`,size:`sm`,children:(0,i.jsx)(t,{to:`/app/api-keys`,children:`Manage keys`})})]}),(0,i.jsxs)(`article`,{className:`mx-auto max-w-3xl space-y-8 px-4 pb-20`,children:[(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`p`,{className:`text-xs uppercase tracking-[0.18em] text-brand`,children:`Public API`}),(0,i.jsx)(`h1`,{className:`mt-2 font-display text-4xl tracking-tight`,children:`Query Nexora from your tools`}),(0,i.jsx)(`p`,{className:`mt-3 text-muted`,children:`Authenticate with a workspace API key. Keys are hashed at rest. Every request is isolated to the issuing organization.`})]}),(0,i.jsxs)(`section`,{className:`space-y-3`,children:[(0,i.jsx)(`h2`,{className:`text-lg font-medium`,children:`Authentication`}),(0,i.jsx)(`p`,{className:`text-sm text-muted`,children:`Send the raw key in the Authorization header. Never log it.`}),(0,i.jsx)(a,{children:`Authorization: Bearer nex_live_…`})]}),(0,i.jsxs)(`section`,{className:`space-y-3`,children:[(0,i.jsx)(`h2`,{className:`text-lg font-medium`,children:`List knowledge bases`}),(0,i.jsx)(a,{children:`GET /api/v1/knowledge-bases`}),(0,i.jsx)(a,{children:`{
  "knowledge_bases": [
    { "id": "kb_…", "name": "Customer Support", "description": "…" }
  ]
}`})]}),(0,i.jsxs)(`section`,{className:`space-y-3`,children:[(0,i.jsx)(`h2`,{className:`text-lg font-medium`,children:`Ask a question`}),(0,i.jsx)(a,{children:`POST /api/v1/assistant/query
Content-Type: application/json

{
  "knowledge_base_id": "kb_123",
  "question": "What is our refund policy?"
}`}),(0,i.jsx)(a,{children:`{
  "answer": "Customers can request a refund within 30 days.",
  "sources": [
    {
      "document": "refund-policy.md",
      "knowledge_base": "Customer Support",
      "excerpt": "Enterprise customers may request a refund…"
    }
  ]
}`})]}),(0,i.jsxs)(`section`,{className:`space-y-3`,children:[(0,i.jsx)(`h2`,{className:`text-lg font-medium`,children:`Errors`}),(0,i.jsxs)(`ul`,{className:`list-disc space-y-1 pl-5 text-sm text-muted`,children:[(0,i.jsx)(`li`,{children:`401 — missing, invalid, or revoked key`}),(0,i.jsx)(`li`,{children:`400 — question too short`}),(0,i.jsx)(`li`,{children:`429 — plan request limit`}),(0,i.jsx)(`li`,{children:`503 — model unavailable`})]})]})]})]})}export{o as component};