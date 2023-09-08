import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/serverAuth";

// APIハンドラー関数の定義
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GETメソッド以外のリクエストは405エラーを返す
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    // サーバーサイド認証を実行し、現在のユーザー情報を取得
    const { currentUser } = await serverAuth(req, res);

    // 現在のユーザー情報をJSON形式で返す
    return res.status(200).json(currentUser);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
