import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-xl font-bold">404</h1>
      <p>お探しのページはありません。</p>
      <Link
        href="/"
        className="rounded bg-white px-4 py-2 text-black hover:bg-gray-200"
      >
        トップへ戻る
      </Link>
    </div>
  );
}
