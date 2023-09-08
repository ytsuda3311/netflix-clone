import useSWR from "swr";

import fetcher from "@/libs/fetcher";

const useCurrentUser = () => {
  // useSWR フックを使用してデータの取得とキャッシュを管理する
  // 参考: "https://swr.vercel.app/ja/docs/data-fetching"
  const { data, error, isLoading, mutate } = useSWR("/api/current", fetcher);

  // 取得したデータ、エラー、読み込み中の状態、データを再取得するための mutate 関数を返す
  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useCurrentUser;
