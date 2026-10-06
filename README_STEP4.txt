STEP 4 — NETLIFY FRONTEND PACKAGE

Files:
- index.html
- netlify.toml
- netlify/functions/skm-api.js

IMPORTANT:
The Apps Script Web App URL is NOT hard-coded into index.html.
Set it in Netlify as the environment variable:
APPS_SCRIPT_URL = https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec

Netlify configuration:
1. Create/import a Netlify site.
2. Deploy this folder.
3. Go to Site configuration > Environment variables.
4. Add APPS_SCRIPT_URL with your Apps Script /exec URL.
5. Trigger a new deploy.

The browser calls:
  /.netlify/functions/skm-api

The Netlify Function then calls Apps Script.
