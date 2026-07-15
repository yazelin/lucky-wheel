// 用法: NODE_PATH=$(npm root -g) node verify/check.cjs <url>
// 桌機:5 名→抽(fast)→winner 屬名單且自動移除剩 4;FB 清洗樣本;手機無橫捲
const { chromium, devices } = require('playwright');

const FB_SAMPLE = [
  '王小明', '王小明', '超想要這個!抽我抽我', '讚', '回覆', '3天',
  '陳大文', '陳大文', '+1', '讚', '回覆', '5小時', '2',
  '林美麗', '林美麗', '這個工具也太實用了吧,已分享給同事', '讚', '回覆', '1週', '頭號粉絲',
  '張志豪', '張志豪', '求中獎', '讚', '回覆', '剛剛', '查看更多',
].join('\n');

(async () => {
  const url = process.argv[2] || 'http://localhost:8002/';
  const opts = process.env.PW_CHANNEL === 'none' ? {} : { channel: 'chrome' };
  const browser = await chromium.launch(opts);

  const page = await (await browser.newContext({ viewport: { width: 1280, height: 950 } })).newPage();
  await page.goto(url + (url.includes('?') ? '&' : '?') + 'fast=1', { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });

  // FB 清洗
  await page.click('#fbclean summary');
  await page.fill('#fbraw', FB_SAMPLE);
  await page.click('#clean');
  const cleaned = (await page.inputValue('#names')).split('\n').filter(Boolean);
  const cleanOk = JSON.stringify(cleaned) === JSON.stringify(['王小明', '陳大文', '林美麗', '張志豪']);

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

  console.log(JSON.stringify({ cleanOk, cleaned, winner: winner.trim(), winnerOk, left, winnersCount, hscroll }));
  await browser.close();
  if (!cleanOk || !winnerOk || left !== 4 || winnersCount !== 1 || hscroll) process.exit(1);
})().catch((e) => { console.error(e.message); process.exit(1); });
