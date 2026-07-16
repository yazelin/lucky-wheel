// 用法: NODE_PATH=$(npm root -g) node verify/check.cjs <url>
// 桌機:5 名→抽(fast)→winner 屬名單且自動移除剩 4;FB 清洗樣本;手機無橫捲
const { chromium, devices } = require('playwright');

// 2026-07 真實 FB 複製格式(名字已匿名化):
// 名字 → 內容(1~N 行) → 時間 → 回覆 → [發送訊息] → 分享 → [已編輯]
const FB_SAMPLE = [
  '留言',
  '書籍小幫手', '  · ', '好讚!', '2小時', '回覆', '分享',
  '測試甲', '可以做假裝自己很受歡迎的截圖了 嗚嗚嗚', '51分鐘', '回覆', '發送訊息', '分享',
  '測試乙', '似乎想到了什麼 😎', '1小時', '回覆', '發送訊息', '分享',
  '站長本人',
  'LINE 對話製造機(免費免註冊):https://example.com/line-chat-maker/',
  'Github :https://github.com/example/line-chat-maker…… 查看更多',
  '2小時', '回覆', '分享', '已編輯',
  '測試丙', '超棒!!', '未提供相片說明。', '1小時', '回覆', '發送訊息', '分享',
  '測試丁', '有趣😆', '1小時', '回覆', '發送訊息', '分享',
  '測試戊', '展示用很棒',
].join('\n');
const FB_EXPECT = ['書籍小幫手', '測試甲', '測試乙', '站長本人', '測試丙', '測試丁', '測試戊'];
const PLAIN_SAMPLE = ['王小明', '陳大文', '讚', '3天', '林美麗'].join('\n');
const PLAIN_EXPECT = ['王小明', '陳大文', '林美麗'];

(async () => {
  const url = process.argv[2] || 'http://localhost:8002/';
  const opts = process.env.PW_CHANNEL === 'none' ? {} : { channel: 'chrome' };
  const browser = await chromium.launch(opts);

  const page = await (await browser.newContext({ viewport: { width: 1280, height: 950 } })).newPage();
  await page.goto(url + (url.includes('?') ? '&' : '?') + 'fast=1', { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });

  // FB 清洗:真實結構樣本
  await page.click('#fbclean summary');
  await page.fill('#fbraw', FB_SAMPLE);
  await page.click('#clean');
  const cleaned = (await page.inputValue('#names')).split('\n').filter(Boolean);
  const cleanOk = JSON.stringify(cleaned) === JSON.stringify(FB_EXPECT);

  // 後備模式:乾淨名單只濾雜訊
  await page.fill('#fbraw', PLAIN_SAMPLE);
  await page.click('#clean');
  const plain = (await page.inputValue('#names')).split('\n').filter(Boolean);
  const plainOk = JSON.stringify(plain) === JSON.stringify(PLAIN_EXPECT);

  // 抽獎
  await page.fill('#names', '甲\n乙\n丙\n丁\n戊');
  await page.click('#spin');
  await page.waitForSelector('dialog[open]', { timeout: 10000 });
  const winner = await page.textContent('#winname');
  const winnerOk = ['甲', '乙', '丙', '丁', '戊'].includes(winner.trim());
  await page.click('#closedlg');
  const left = (await page.inputValue('#names')).split('\n').filter(Boolean).length;
  const winnersCount = await page.locator('#winners li').count();

  // 手機
  const m = await (await browser.newContext({ ...devices['iPhone 13'] })).newPage();
  await m.goto(url, { waitUntil: 'networkidle' });
  const hscroll = await m.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);

  console.log(JSON.stringify({ cleanOk, cleaned, plainOk, winner: winner.trim(), winnerOk, left, winnersCount, hscroll }));
  await browser.close();
  if (!cleanOk || !plainOk || !winnerOk || left !== 4 || winnersCount !== 1 || hscroll) process.exit(1);
})().catch((e) => { console.error(e.message); process.exit(1); });
