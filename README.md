# 抽獎轉盤 lucky-wheel

台灣小編的抽獎轉盤:貼上名單、或直接貼 FB 留言串一鍵洗名單,全螢幕轉盤抽獎,中獎名單一鍵複製。

**線上使用:https://yazelin.github.io/lucky-wheel/**

免費、免註冊、無廣告、零追蹤——名單只存在你的瀏覽器。

## 為什麼不用 Wheel of Names 就好

| | Wheel of Names | 這個轉盤 |
|--|--|--|
| FB 留言抽獎 | 要自己整理名單 | 留言區整坨貼上,一鍵洗出名字(去讚/回覆/時間戳/重複) |
| 廣告 | 有橫幅廣告 | 無 |
| 中獎名單 | Results 藏側欄 | 專屬面板,一鍵複製去公告 |
| 名單隱私 | 可存它的雲端 | 只存你的瀏覽器(localStorage) |
| 公平性 | 未說明 | 中獎者由 crypto.getRandomValues 決定,轉盤只是演出;指針落點經 12/12 對齊驗證 |
| 介面 | 英文為主 | 繁體中文 |

## 功能

- 名單:一行一名、去重、洗牌、計數;自動保存
- FB 留言清洗:依 FB 複製格式的結構解析(每則=名字→內容→時間→回覆→分享),以「分享」為斷點抓名字,雜訊詞、時間戳、多行內容與附圖說明全濾掉;洗完可手動修
- 抽獎:crypto 亂數選人 → 轉盤 6 圈演出 → 中獎彈窗 + 彩帶;「中獎後自動移除」可關
- 中獎名單:依序記錄、一鍵複製、清空
- 全螢幕模式(直播開獎用)
- 深淺色主題、手機可用

## 開發

零框架、零依賴、單檔 index.html:

```bash
python3 -m http.server 8002   # 開 http://localhost:8002/
NODE_PATH=$(npm root -g) node verify/check.cjs http://localhost:8002/   # 功能+RWD 驗證
```

測試鉤子:網址加 `?fast=1` 會把轉動時間縮到 0.3 秒(驗證腳本用)。

## 更多工具

這是[行銷工具箱](https://yazelin.github.io/marketing-toolbox/)的自製工具之一——免費、免註冊、開瀏覽器就能用的行銷小工具書籤站。

## 關於作者

林亞澤(Yaze Lin)——工業自動化 SI 轉 AI 應用。

- Blog:https://yazelin.github.io/
- Facebook:https://www.facebook.com/yaze.lin.gm
- Buy Me a Coffee:https://buymeacoffee.com/yazelin

## License

MIT © 2026 林亞澤 (Yaze Lin)
