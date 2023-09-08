// zustandを使用することで、Reactコンポーネント間でこのモーダルの状態を共有できる
import { create } from "zustand";

export interface ModalStoreInterface {
  movieId?: string; //選択された映画のID（省略可能）
  isOpen: boolean; // モーダルが開いているかどうかを示すフラグ
  openModal: (movieId: string) => void; // モーダルを開くための関数
  closeModal: () => void; // モーダルを閉じるための関数
}

const useInfoModal = create<ModalStoreInterface>((set) => ({
  movieId: undefined, // 初期状態では選択された映画のIDは未指定
  isOpen: false, // 初期状態ではモーダルは閉じる
  openModal: (movieId: string) => set({ isOpen: true, movieId }), // モーダルを開く関数
  closeModal: () => set({ isOpen: false, movieId: undefined }), // モーダルを閉じる関数
}));

export default useInfoModal;
