// favorite.tsは、POSTとDELETEメソッドに対応しており、お気に入り映画の追加および削除をする

import { without } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";

import prismadb from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

// APIルートのハンドラー関数をエクスポート
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // HTTPメソッドがPOSTの場合
    if (req.method === "POST") {
      // サーバー認証関数を呼び出し、認証済みのユーザー情報を取得
      const { currentUser } = await serverAuth(req, res);

      // リクエストボディからmovieIdを取得
      const { movieId } = req.body;

      // movieIdを使用してデータベースから映画を検索
      const existingMovie = await prismadb.movie.findUnique({
        where: {
          id: movieId,
        },
      });

      // 映画が存在しない場合はエラーをスロー
      if (!existingMovie) {
        throw new Error("Invalid ID");
      }

      // ユーザーのお気に入りリストを更新
      const user = await prismadb.user.update({
        where: {
          email: currentUser.email || "",
        },
        data: {
          favoriteIds: {
            push: movieId, // お気に入りリストにmovieIdを追加
          },
        },
      });

      // 更新されたユーザー情報をJSON形式でクライアントに返す
      return res.status(200).json(user);
    }

    // HTTPメソッドがDELETEの場合
    if (req.method === "DELETE") {
      // サーバー認証関数を呼び出し、認証済みのユーザー情報を取得
      const { currentUser } = await serverAuth(req, res);

      // リクエストボディからmovieIdを取得
      const { movieId } = req.body;

      // movieIdを使用してデータベースから映画を検索
      const existingMovie = await prismadb.movie.findUnique({
        where: {
          id: movieId,
        },
      });

      // 映画が存在しない場合はエラーをスロー
      if (!existingMovie) {
        throw new Error("Invalid ID");
      }

      // ユーザーのお気に入りリストから指定したmovieIdを削除
      const updatedFavoriteIds = without(currentUser.favoriteIds, movieId);

      // ユーザーのお気に入りリストを更新
      const updatedUser = await prismadb.user.update({
        where: {
          email: currentUser.email || "",
        },
        data: {
          favoriteIds: updatedFavoriteIds,
        },
      });

      // 更新されたユーザー情報をJSON形式でクライアントに返す
      return res.status(200).json(updatedUser);
    }

    // POSTまたはDELETE以外のHTTPメソッドが使用された場合は405エラーを返す
    return res.status(405).end();
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
