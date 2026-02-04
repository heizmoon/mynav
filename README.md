# My Nexus - Personal Navigation Dashboard

A dynamic, cyberpunk-themed personal navigation site built with Next.js.
Supports local data persistence, icon auto-fetching, and configuration backup.

## Features
- **Dynamic Links**: Add, Edit, Delete links directly in the browser.
- **Privacy First**: Data is stored in your browser's (LocalStorage). No database required.
- **Data Backup**: Export/Import your configuration to a JSON file.
- **Instant Icons**: Auto-fetches favicons and stores them as Base64 for zero-latency loading.
- **Search**: Integrated Google/Bing search and in-page filtering.

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

## Deployment

### Vercel (Recommended)
1. Fork or push this repository to GitHub.
2. Import project into Vercel.
3. It will auto-detect Next.js.
4. Deploy!

### Docker / ClawCloudRun
```bash
# Build image
docker build -t mynav .

# Run container
docker run -p 3000:3000 mynav
```
