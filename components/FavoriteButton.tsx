import React, { useCallback, useMemo } from "react";

import axios from "axios";
import { AiOutlinePlus, AiOutlineCheck } from "react-icons/ai";

import useCurrentUser from "@/hooks/useCurrentUser";
import useFavorites from "@/hooks/useFavorites";

interface FavoriteButtonProps {
  movieId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId }) => {
  // useFavoritesフックを使用して、お気に入り映画リストの更新関数(mutateFavorites)を取得
  const { mutate: mutateFavorites } = useFavorites();
  // useCurrentUserフックを使用して、現在のユーザー情報(currentUser)およびその更新関数(mutate)を取得
  const { data: currentUser, mutate } = useCurrentUser();

  // 映画がお気に入りかどうかを確認
  const isFavorite = useMemo(() => {
    // ユーザーのお気に入りリストを取得し、映画IDが含まれているかを確認
    const list = currentUser?.favoriteIds || [];

    return list.includes(movieId);
  }, [currentUser, movieId]);

  // お気に入り状態を切り替える関数を定義
  const toggleFavorites = useCallback(async () => {
    let response;

    // 映画がお気に入りの場合、削除リクエストを送信し、それ以外の場合は追加リクエストを送信
    if (isFavorite) {
      response = await axios.delete("/api/favorite", { data: { movieId } });
    } else {
      response = await axios.post("/api/favorite", { movieId });
    }

    // サーバーからのレスポンスから更新されたお気に入りリストを取得
    const updatedFavoriteIds = response?.data?.favoriteIds;

    // ユーザー情報を更新し、お気に入りリストを更新されたものに設定
    mutate({
      // スプレッド構文を使用して currentUser オブジェクトのコピーを作成し、そのコピーの favoriteIds プロパティを updatedFavoriteIds に上書きする
      ...currentUser,
      favoriteIds: updatedFavoriteIds,
    });

    // お気に入りリストを再読み込み（更新）する
    mutateFavorites();
  }, [movieId, isFavorite, currentUser, mutate, mutateFavorites]);

  // Icon変数を設定し、お気に入りアイコンを選択
  const Icon = isFavorite ? AiOutlineCheck : AiOutlinePlus;

  return (
    <div
      onClick={toggleFavorites}
      className="
        cursor-pointer
        group/item
        w-6
        h-6
        lg:w-10
        lg:h-10
        border-white
        border-2
        rounded-full
        flex
        justify-center
        items-center
        transition
        hover:border-neutral-300
      "
    >
      <Icon className="text-white" size={25} />
    </div>
  );
};

export default FavoriteButton;
