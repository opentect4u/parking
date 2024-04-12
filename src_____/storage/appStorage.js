import { MMKV } from "react-native-mmkv";

export const loginStorage = new MMKV({
  id: "login-store",
});

export const appStorage = new MMKV({
  id: "app-storage",
});
