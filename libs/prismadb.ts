import { PrismaClient } from "@prisma/client";

// グローバルなprismadb変数が既に存在すればその値を、存在しなければ新しいPrismaClientインスタンスを作成
const client = global.prismadb || new PrismaClient();
if (process.env.NODE_ENV === "production") global.prismadb = client;

export default client;
