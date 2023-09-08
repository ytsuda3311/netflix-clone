import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import prismadb from "@/libs/prismadb";

import { authOptions } from "@/pages/api/auth/[...nextauth]";

// サーバーサイドの認証関数を定義
const serverAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  // セッション情報を取得
  const session = await getServerSession(req, res, authOptions);

  // セッションにユーザーのメールがない場合はエラーをスロー
  if (!session?.user?.email) {
    throw new Error("Not signed in");
  }

  // データベースからユーザー情報を取得
  const currentUser = await prismadb.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  // ユーザーが存在しない場合はエラーをスロー
  if (!currentUser) {
    throw new Error("Not signed in");
  }

  // 現在のユーザー情報を返す
  return { currentUser };
};

export default serverAuth;
