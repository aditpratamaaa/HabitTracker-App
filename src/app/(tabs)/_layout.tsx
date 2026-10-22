import { Stack } from 'expo-router';

/** Route group privat; AuthSessionRedirect di root menjaga sesi JWT. */
export default function TabsLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
