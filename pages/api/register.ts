import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";

import prismadb from "@/libs/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // もしHTTPメソッドがPOSTでなければ、405エラーを返す
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    // リクエストボディからemail, name, passwordを取得
    const { email, name, password } = req.body;

    // 既存のユーザーを検索(emailなのは重複がないため)
    const existingUser = await prismadb.user.findUnique({
      where: {
        email,
      },
    });

    // もし既に同じメールアドレスのユーザーが存在する場合、422エラーを返す
    if (existingUser) {
      return res.status(422).json({ error: "Email taken" });
    }

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 12);

    // 新しいユーザーを作成
    const user = await prismadb.user.create({
      data: {
        email,
        name,
        hashedPassword,
        image: "",
        emailVerified: new Date(), // 現在の日時を設定
      },
    });

    // 成功した場合、新しいユーザー情報を返す
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    // エラーが発生した場合、400エラーを返す
    return res.status(400).end();
  }
}
