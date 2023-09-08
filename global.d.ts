import { PrismaClient } from "@prisma/client";

// グローバルな名前空間を拡張するための宣言
declare global {
  namespace globalThis {
    // PrismaClient型の変数「prismadb」を宣言
    var prismadb: PrismaClient;
  }
}
