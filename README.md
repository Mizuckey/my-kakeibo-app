# my-kakeibo-app
React と Supabase を使った家計簿アプリです。  
学習・練習を目的として開発しています。

---
## 🚀 起動方法
### 1. 必要な環境
- Node.js 18+
- npm または yarn
### 2. 環境変数の設定
`.env` ファイルをプロジェクト直下に作成し、以下を記入してください。
```
VITE_SUPABASE_URL=（SupabaseのURL）
VITE_SUPABASE_ANON_KEY=（Anonキー）
```
### 3. パッケージのインストール
```
npm install
```
### 4. 開発サーバーの起動
```
npm run dev
```
---
## 📂 ファイル構成
.
├── README.md                # プロジェクト説明書
├── app/                     # Next.js App Router のページやレイアウト
├── eslint.config.mjs        # ESLint 設定
├── lib/                      # ユーティリティやSupabaseクライアントなど
├── next-env.d.ts            # Next.jsの型定義（自動生成）
├── next.config.ts           # Next.js の設定
├── node_modules/            # npmパッケージ
├── package-lock.json
├── package.json
├── postcss.config.mjs       # PostCSS設定
├── public/                  # 画像やfaviconなどの静的ファイル
├── src/                     # コンポーネントやhooksなどのソースコード
    ├── app
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components
    │   ├── calendar
    │   │   └── MonthSwitcher.tsx
    │   ├── charts
    │   │   └── CategoryPieChart.tsx
    │   ├── expense
    │   │   ├── AddExpenseForm.tsx
    │   │   ├── AmountCalculator.tsx
    │   │   ├── ExpenseItem.tsx
    │   │   └── ExpenseList.tsx
    │   └── ui
    │       └── Modal.tsx
    ├── hooks
    │   └── useExpenses.ts
    ├── lib
    │   ├── expenses.ts
    │   ├── holidays.ts
    │   └── supabaseClient.ts
    └── types
        └── expense.ts
└── tsconfig.json            # TypeScript設定

