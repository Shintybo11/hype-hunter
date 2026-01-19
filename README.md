# 🔥 Hype Hunter

Automated system for discovering hyped limited-edition products and copping them at retail price.

## What It Does

1. **Discovers** upcoming hyped releases from release calendars (Sole Supplier, Hypebeast, Sneaker News)
2. **Monitors** UK retailer stock levels every 5 minutes (End, Size?, Pro:Direct, JD, Nike, LEGO, Smyths)
3. **Alerts** you instantly via Telegram the moment items restock
4. **Tracks** your inventory, profit/loss, and ROI

## The Goal

Cop limited edition sneakers, football boots, streetwear, and toys at RRP before they sell out.

## Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **AI:** Claude API for product extraction
- **Alerts:** Telegram Bot
- **Scraping:** Cheerio, Puppeteer

## Features

- 📅 Release calendar with upcoming drops
- 🔍 AI-powered product discovery from multiple sources
- 📊 Hype scoring algorithm (social signals, resale premium, scarcity)
- 🏪 Real-time stock monitoring across 15+ UK retailers
- 📱 Instant Telegram alerts with direct purchase links
- 📦 Inventory tracking with P&L analytics
- 📱 Mobile responsive design

## Categories

- Sneakers (Nike, Jordan, Adidas, New Balance)
- Football Boots (Pro:Direct, Lovell)
- Streetwear (Supreme, Palace, Stone Island)
- Toys & LEGO

## Status

🚧 **In Development** - Phase 2: Discovery Engine & Stock Monitoring

## Setup

1. Clone the repo
2. Copy `.env.example` to `.env.local` and fill in credentials
3. Run `npm install`
4. Run `npm run dev`

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

## License

Private - Personal Use
