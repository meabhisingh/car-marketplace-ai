import { create } from "zustand";

type InitialState = {
  images: string[];
  setImages: (images: string[]) => void;
  addImage: (image: string) => void;
  removeImage: (image: string) => void;
  clearImages: () => void;
};

export const useImages = create<InitialState>((set) => ({
  images: [],
  setImages: (images) => set({ images }),

  addImage: (image) => set((state) => ({ images: [...state.images, image] })),

  removeImage: (image) =>
    set((state) => ({ images: state.images.filter((img) => img !== image) })),

  clearImages: () => set({ images: [] }),
}));
