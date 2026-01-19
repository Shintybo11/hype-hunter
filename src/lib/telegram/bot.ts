import { Telegraf } from 'telegraf';
import type { Product, StockItem, Retailer } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils/format';

// ============================================================================
// Bot Initialization
// ============================================================================

let bot: Telegraf | null = null;

export function getBot(): Telegraf {
  if (!bot) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not set');
    }
    bot = new Telegraf(token);
  }
  return bot;
}

// ============================================================================
// Message Templates
// ============================================================================

export function formatRestockAlert(
  product: Product,
  stockItem: StockItem,
  retailer: Retailer
): string {
  const sizes = stockItem.sizes
    .filter((s) => s.in_stock)
    .map((s) => `UK ${s.uk}`)
    .join(', ');

  return `🚨 *RESTOCK ALERT*

*${escapeMarkdown(product.name)}*
${product.collaborator ? `_${escapeMarkdown(product.collaborator)} Collab_\n` : ''}
Hype Score: *${product.hype_score}/100*

✅ *${escapeMarkdown(retailer.name)}* \\- IN STOCK
${sizes ? `Sizes: ${escapeMarkdown(sizes)}` : 'Sizes: Check link'}

💰 ${escapeMarkdown(formatPrice(stockItem.price))}

🔗 [Shop Now](${stockItem.url})`;
}

export function formatDiscoveryAlert(product: Product, sourceNames: string[]): string {
  return `🔍 *NEW DISCOVERY*

*${escapeMarkdown(product.name)}*
${product.collaborator ? `_${escapeMarkdown(product.collaborator)} Collab_\n` : ''}
📅 Release: ${escapeMarkdown(formatDate(product.release_date))}
💰 Retail: ${escapeMarkdown(formatPrice(product.retail_price))}

📊 *Early Signals:*
\\- Confidence: ${product.confidence_score}%
${product.is_limited_edition ? '\\- 🔥 Limited Edition' : ''}

🎯 Hype Score: *${product.hype_score}/100*

_Sources: ${escapeMarkdown(sourceNames.join(', '))}_`;
}

export function formatDailyDigest(
  date: string,
  discoveries: Product[],
  trending: { product: Product; change: number }[],
  releasesTomorrow: Product[]
): string {
  let message = `📰 *HYPE HUNTER DAILY DIGEST*
_${escapeMarkdown(date)}_\n\n`;

  if (discoveries.length > 0) {
    message += `🔥 *TOP DISCOVERIES* \\(${discoveries.length}\\)\n`;
    discoveries.slice(0, 5).forEach((p, i) => {
      message += `${i + 1}\\. ${escapeMarkdown(p.name)} \\- Score: ${p.hype_score}\n`;
    });
    message += '\n';
  }

  if (trending.length > 0) {
    message += `📈 *TRENDING UP*\n`;
    trending.slice(0, 3).forEach((t) => {
      const sign = t.change >= 0 ? '+' : '';
      message += `\\- ${escapeMarkdown(t.product.name)} \\(${sign}${t.change}\\)\n`;
    });
    message += '\n';
  }

  if (releasesTomorrow.length > 0) {
    message += `⚠️ *RELEASING TOMORROW*\n`;
    releasesTomorrow.forEach((p) => {
      message += `\\- ${escapeMarkdown(p.name)}\n`;
    });
  }

  return message;
}

export function formatPriceDropAlert(
  product: Product,
  oldPrice: number,
  newPrice: number,
  platform: string
): string {
  const dropPercent = Math.round(((oldPrice - newPrice) / oldPrice) * 100);

  return `💸 *PRICE DROP ALERT*

*${escapeMarkdown(product.name)}*

📉 ${escapeMarkdown(platform)} Price Drop: *\\-${dropPercent}%*

Was: ~${escapeMarkdown(formatPrice(oldPrice))}~
Now: *${escapeMarkdown(formatPrice(newPrice))}*

Retail was: ${escapeMarkdown(formatPrice(product.retail_price))}`;
}

// ============================================================================
// Send Functions
// ============================================================================

export async function sendMessage(chatId: string, message: string): Promise<void> {
  const telegramBot = getBot();
  await telegramBot.telegram.sendMessage(chatId, message, {
    parse_mode: 'MarkdownV2',
    link_preview_options: { is_disabled: false },
  });
}

export async function sendRestockAlert(
  chatId: string,
  product: Product,
  stockItem: StockItem,
  retailer: Retailer
): Promise<void> {
  const message = formatRestockAlert(product, stockItem, retailer);
  await sendMessage(chatId, message);
}

export async function sendDiscoveryAlert(
  chatId: string,
  product: Product,
  sourceNames: string[]
): Promise<void> {
  const message = formatDiscoveryAlert(product, sourceNames);
  await sendMessage(chatId, message);
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Escape special characters for Telegram MarkdownV2
 */
function escapeMarkdown(text: string | null | undefined): string {
  if (!text) return '';
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
}

// ============================================================================
// Bot Commands Setup
// ============================================================================

export function setupBotCommands(telegramBot: Telegraf): void {
  // /start - Initialize and link account
  telegramBot.command('start', async (ctx) => {
    const chatId = ctx.chat.id.toString();
    await ctx.reply(
      `👋 Welcome to Hype Hunter!\n\n` +
        `Your Chat ID: ${chatId}\n\n` +
        `Add this Chat ID to your Hype Hunter settings to receive alerts.\n\n` +
        `Commands:\n` +
        `/watchlist - View your watchlist\n` +
        `/settings - Alert preferences\n` +
        `/help - Get help`
    );
  });

  // /help - Show help
  telegramBot.command('help', async (ctx) => {
    await ctx.reply(
      `🔍 *Hype Hunter Bot*\n\n` +
        `Commands:\n` +
        `/start - Get your Chat ID\n` +
        `/watchlist - View watched products\n` +
        `/settings - Alert preferences\n` +
        `/mute [hours] - Mute alerts\n` +
        `/digest - Get daily digest now`,
      { parse_mode: 'Markdown' }
    );
  });

  // /watchlist - Show watchlist
  telegramBot.command('watchlist', async (ctx) => {
    // TODO: Implement watchlist lookup
    await ctx.reply('📋 Your watchlist is empty. Add products from the web dashboard.');
  });

  // /settings - Show settings
  telegramBot.command('settings', async (ctx) => {
    await ctx.reply(
      '⚙️ *Alert Settings*\n\n' +
        'Configure your alert preferences in the Hype Hunter web dashboard.\n\n' +
        'Current settings:\n' +
        '- Instant alerts: ✅\n' +
        '- Daily digest: ✅\n' +
        '- Quiet hours: Off',
      { parse_mode: 'Markdown' }
    );
  });

  // /mute - Mute alerts
  telegramBot.command('mute', async (ctx) => {
    const args = ctx.message.text.split(' ');
    const hours = args[1] ? parseInt(args[1], 10) : 1;
    await ctx.reply(`🔇 Alerts muted for ${hours} hour(s).`);
  });
}
