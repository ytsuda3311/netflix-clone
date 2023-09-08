import { NextApiRequest, NextApiResponse } from "next";

import prismadb from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GETメソッド以外は405エラーを返す
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    // サーバーサイド認証を実行
    await serverAuth(req, res);

    // データベース内の映画数を取得
    const movieCount = await prismadb.movie.count();

    // ランダムなインデックスを計算
    const randomIndex = Math.floor(Math.random() * movieCount);

    // ランダムな映画を１つ取得
    const randomMovies = await prismadb.movie.findMany({
      take: 1,
      skip: randomIndex,
    });

    // ランダムな映画情報を JSON 形式で返す
    return res.status(200).json(randomMovies[0]);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
