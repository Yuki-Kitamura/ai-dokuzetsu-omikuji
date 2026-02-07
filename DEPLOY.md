# ローカル開発 → GitHub push → Vercel デプロイ

## 1. ローカル開発

```bash
# 依存関係（初回 or package.json 変更後）
npm install

# 開発サーバー起動（http://localhost:3000）
npm run dev

# テスト実行
npm test

# 本番ビルド確認
npm run build
```

- `.env.local` に `OPENAI_API_KEY` と `OPENAI_MODEL` を設定すること。

## 2. GitHub に push

```bash
git init
git add .
git commit -m "Initial commit: AI毒舌おみくじ"
git branch -M main
git remote add origin https://github.com/<あなたのユーザー名>/ai-dokuzetsu-omikuji.git
git push -u origin main
```

- リポジトリは GitHub で先に作成しておく。
- 検証用に `dev` ブランチも push する場合:
  - `git checkout -b dev && git push -u origin dev`

## 3. Vercel デプロイ

1. [Vercel](https://vercel.com) にログインし、**Add New Project** で GitHub リポジトリをインポート。
2. **Environment Variables** で以下を設定:
   - `OPENAI_API_KEY`: あなたの OpenAI API キー
   - `OPENAI_MODEL`: `gpt-4o-mini`（または使いたいモデル）
3. **Deploy** を実行。

### 設定ポイント

- **Production Branch**: `main`（本番）にしておく。
- **Preview**: プルリクや `dev` など別ブランチ用のプレビューURLが自動で発行される。
- 環境変数は Production / Preview / Development で必要に応じて分けて設定可能。

## 4. デプロイ前の確認コマンド一覧

```bash
npm install
npm run lint
npm test
npm run build
```

すべて成功してから `git push` すると安心です。
