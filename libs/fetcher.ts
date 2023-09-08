import axios from "axios";

// axiosを使用して指定されたURLからデータを取得するfetcher関数
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default fetcher;
