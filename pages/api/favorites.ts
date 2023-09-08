// favorites.tsは、GETメソッドに対応しており、お気に入り映画のリストを取得する

import { NextApiRequest, NextApiResponse } from "next";

import prismadb from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // HTTPメソッドがGETでない場合、エラーを返して終了
    if (req.method !== "GET") {
      return res.status(405).end();
    }

    // サーバー認証を実行し、認証されたユーザー情報を取得
    const { currentUser } = await serverAuth(req, res);

    // データベースから、ユーザーのお気に入り映画を取得
    const favoriteMovies = await prismadb.movie.findMany({
      where: {
        id: {
          in: currentUser?.favoriteIds, // currentUserオブジェクトからお気に入り映画のIDリストを取得
        },
      },
    });

    // 取得したお気に入り映画をJSON形式でクライアントに返す
    return res.status(200).json(favoriteMovies);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
