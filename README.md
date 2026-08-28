# GODSHOP — 未來科技選物店

最炫的 3D 科技電商。A futuristic bilingual (中英混排) tech e-commerce experience with a full 3D frontend.

![stack](https://img.shields.io/badge/Next.js-16-black) ![3d](https://img.shields.io/badge/3D-React%20Three%20Fiber-22d3ee) ![db](https://img.shields.io/badge/DB-Prisma%20%2B%20SQLite-a78bfa)

## Features

- **3D 全端體驗** — 8 件程序化生成的 3C 產品 3D 模型(React Three Fiber + drei),零外部模型檔
- **首頁 Hero** — Bloom 後處理、粒子星場、漂浮產品艦隊、滑鼠視差
- **商品系統** — 分類篩選 / 排序 / 360° 互動 3D 檢視器 / 顏色變體 / 爆炸分解視圖
- **完整購物流程** — 購物車(zustand + localStorage)、模擬結帳、訂單建立與查詢
- **帳號系統** — 註冊 / 登入(bcryptjs + JWT httpOnly cookie)、`proxy.ts` 路由保護
- **後端 API** — Next.js Route Handlers + Prisma + SQLite,訂單金額伺服器端重算

## Quick Start

```bash
npm install
npx prisma migrate dev   # 建立 SQLite DB + 自動 seed 8 件商品
npm run dev              # http://localhost:3000
```

Production:

```bash
npm run build && npm start
```

## Scripts

| 指令 | 說明 |
| --- | --- |
| `npm run dev` | 開發伺服器(Turbopack) |
| `npm run build` / `npm start` | 正式建置 / 啟動 |
| `npx prisma migrate dev` | 套用 migration 並 seed |
| `npx prisma studio` | 資料庫 GUI |

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **3D**: three.js + @react-three/fiber + @react-three/drei + @react-three/postprocessing
- **Styling**: Tailwind CSS v4 + framer-motion + lucide-react
- **Auth**: jose (JWT) + bcryptjs,httpOnly cookie session
- **DB**: Prisma 6 + SQLite
- **State**: zustand (cart, persisted)

## Structure

```
app/
  page.tsx              # 首頁(3D Hero / Featured / Marquee / Perks / CTA)
  products/             # 商品列表 + [slug] 詳情(互動 3D 檢視器)
  cart/ checkout/       # 購物車 / 結帳 / 成功頁
  login/ register/      # 登入 / 註冊
  orders/               # 我的訂單
  api/                  # auth / products / orders Route Handlers
components/
  three/                # ProductModel(8 種程序化 3D 模型)、ProductCanvas、HeroScene
  products/ commerce/ home/
lib/                    # db / auth / products / store / types / format
prisma/                 # schema + seed
proxy.ts                # 路由保護(/orders、/checkout 需登入)
```

## Notes

- 付款為模擬流程,不串接真實金流。
- 首頁 Hero 如遇低階裝置效能問題,可用 `/?nopost=1` 關閉後處理特效。
- `.env` 需包含 `DATABASE_URL="file:./dev.db"` 與 `AUTH_SECRET`(本機開發任意字串即可)。

---

Shop the Future, Now. 未來科技,今日入手。
