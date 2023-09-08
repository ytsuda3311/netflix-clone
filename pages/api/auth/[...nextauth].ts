import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import NextAuth, { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import prismadb from "@/libs/prismadb";

export const authOptions: AuthOptions = {
  // 認証プロバイダーの設定
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      id: "credentials", // プロバイダーのID
      name: "Credentials", // プロバイダーの名前
      credentials: {
        email: {
          label: "Email", // ユーザーのemail
          type: "text",
        },
        password: {
          label: "Password", // パスワードの表示名
          type: "password",
        },
      },
      // ユーザー認証
      async authorize(credentials) {
        // 提供されたemailとpasswordの存在を確認(例: credentials?.emailがnullまたはundefinedの場合、!によりtrueになる)
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        // データベースからユーザーを検索
        const user = await prismadb.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        // ユーザーが存在しないかhashedPasswordが存在しない場合エラー
        if (!user || !user.hashedPassword) {
          throw new Error("Email does not exist");
        }

        // パスワードの比較を行い、正しくない場合エラー
        const isCorrectPassword = await compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Incorrect password");
        }

        return user; // ユーザーオブジェクトを返す（認証成功）
      },
    }),
  ],
  // サインインページのURLを指定
  pages: {
    signIn: "/auth",
  },
  // デバッグログを開発環境でのみ有効にする
  debug: process.env.NODE_ENV === "development",
  adapter: PrismaAdapter(prismadb),
  // セッションの設定（JWTストラテジーを使用）
  session: {
    strategy: "jwt",
  },
  // JWTのシークレットキーを設定
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  // セッションクッキーの暗号化に使用するシークレットを設定
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
