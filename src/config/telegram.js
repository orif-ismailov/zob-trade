const TelegramBot = require('node-telegram-bot-api');

let bot = null;

const initBot = () => {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.warn('Telegram bot token not configured');
    return null;
  }

  if (!bot) {
    bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
  }
  return bot;
};

const sendToChannel = async (message) => {
  const telegramBot = initBot();
  if (!telegramBot) {
    console.error('Telegram bot not initialized');
    return false;
  }

  const channelId = process.env.TELEGRAM_CHANNEL_ID;
  if (!channelId) {
    console.error('Telegram channel ID not configured');
    return false;
  }

  try {
    await telegramBot.sendMessage(channelId, message, { parse_mode: 'HTML' });
    return true;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
};

// Format date to DD-MM-YYYY, HH:MM
const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}-${month}-${year}, ${hours}:${minutes}`;
};

// Format RFQ submission for Telegram
const formatRFQMessage = (data) => {
  const timestamp = formatDate(new Date());

  return `
🛢 <b>New RFQ Request</b>

━━━━━━━━━━━━━━━━━━━━

🏢 <b>Company:</b> ${escapeHtml(data.company)}
👤 <b>Contact:</b> ${escapeHtml(data.contactPerson)}
📧 <b>Email:</b> ${escapeHtml(data.email)}
📱 <b>Phone:</b> ${escapeHtml(data.phone)}

━━━━━━━━━━━━━━━━━━━━

⛽ <b>Product:</b> ${escapeHtml(data.product)}
📦 <b>Volume:</b> ${escapeHtml(data.volume)}
📍 <b>Destination:</b> ${escapeHtml(data.destination)}
🚚 <b>Incoterms:</b> ${escapeHtml(data.incoterms)}

━━━━━━━━━━━━━━━━━━━━

💬 <b>Message:</b>
${escapeHtml(data.message || 'No additional message')}

━━━━━━━━━━━━━━━━━━━━

🌐 <b>ZOB TRADE LLC</b> | zobtrade.com
🕐 <i>${timestamp}</i>
`.trim();
};

const escapeHtml = (text) => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

module.exports = {
  initBot,
  sendToChannel,
  formatRFQMessage
};
