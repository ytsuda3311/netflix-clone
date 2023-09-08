import { NextApiRequest, NextApiResponse } from "next";

import prismadb from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // リクエストのHTTPメソッドがGETでない場合、405 エラーを返す
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    // サーバーサイド認証を実行
    await serverAuth(req, res);

    // リクエストのクエリパラメータからmovieIdを取得
    // 例えば、リクエストURLが https://example.com/api/movies/hogehoge であれば、movieId には hogehoge が代入される
    const { movieId } = req.query;

    // movieIdが文字列でない場合、無効なIDとしてエラーをスロー
    if (typeof movieId !== "string") {
      throw new Error("Invalid ID");
    }

    // 空文字列の場合、無効なIDとしてエラーをスロー
    if (!movieId) {
      throw new Error("Invalid ID");
    }

    // prismadbを使用して、指定されたmovieIdに対応する映画情報をデータベースから取得
    const movie = await prismadb.movie.findUnique({
      where: {
        id: movieId,
      },
    });

    // 映画情報が存在しない場合、無効なIDとしてエラーをスロー
    if (!movie) {
      throw new Error("Invalid ID");
    }

    // 成功した場合、映画情報をJSON形式で返す
    return res.status(200).json(movie);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
