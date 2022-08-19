import { isDev } from "@/constants/development";
import create from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";

interface storeType {
  count: number;
}

const userDataStore = create<storeType>((set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
}));

const stores = [
  {
    name: "userData",
    store: userDataStore
  }
];
if (isDev) {
  for (const store of stores) {
    mountStoreDevtool(store?.name, store?.store);
  }
}