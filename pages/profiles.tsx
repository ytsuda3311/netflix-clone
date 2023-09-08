import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

import useCurrentUser from "@/hooks/useCurrentUser";

// サーバーサイドのレンダリング時に実行される関数
export async function getServerSideProps(context: NextPageContext) {
  // セッション情報を取得
  const session = await getSession(context);

  // セッションが存在しない場合、認証ページへリダイレクトする
  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false, // リダイレクトは一時的なものとする
      },
    };
  }

  // セッションが存在する場合は、propsとして空のオブジェクトを返す
  return {
    props: {},
  };
}

const Profiles = () => {
  const router = useRouter();
  // useCurrentUserフックを使ってユーザー情報を取得
  const { data: user } = useCurrentUser();

  return (
    <div className="flex items-center h-full justify-center">
      <div className=" flex flex-col">
        <h1 className="text-3xl md:text-6xl text-white text-center">
          Who is watching?
        </h1>
        <div className="flex items-center justify-center gap-8 mt-10">
          <div onClick={() => router.push("/")}>
            <div className="group flex-row w-44 mx-auto">
              <div
                className="
                  w-44
                  h-44
                  rounded-md
                  flex
                  items-center
                  justify-center
                  border-2
                  border-transparent
                  group-hover:cursor-pointer
                  group-hover:border-white
                  overflow-hidden
                "
              >
                <img src="/images/default-blue.png" alt="Profile" />
              </div>
              <div
                className="
                  mt-4
                  text-gray-400
                  text-2xl
                  text-center
                  group-hover:text-white
                "
              >
                {user?.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profiles;
