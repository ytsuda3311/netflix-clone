import { NextPageContext } from "next";
import { getSession } from "next-auth/react";

import Billboard from "@/components/Billboard";
import InfoModal from "@/components/InfoModal";
import MovieList from "@/components/MovieList";
import Navbar from "@/components/Navbar";

import useFavorites from "@/hooks/useFavorites";
import useInfoModal from "@/hooks/useInfoModal";
import useMovieList from "@/hooks/useMovieList";

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

export default function Home() {
  const { data: movies = [] } = useMovieList();
  const { data: favorites = [] } = useFavorites();
  const { isOpen, closeModal } = useInfoModal();

  return (
    <>
      <InfoModal visible={isOpen} onClose={closeModal} />
      <Navbar />
      <Billboard />
      <div className="pb-40">
        <MovieList title="Trending Now" data={movies} />
        <MovieList title="My List" data={favorites} />
      </div>
    </>
  );
}
