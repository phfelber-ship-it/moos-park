<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Deploy-Workflow

Nicht mehr automatisch auf `main` pushen (das deployt sofort live auf die
Produktions-Domain). Änderungen auf einem eigenen Branch fertig machen und per
Vercel-Preview-Deployment gemeinsam mit dem Nutzer testen; das Mergen nach
`main`/Live-Schalten passiert erst nach expliziter Absprache mit ihm.
