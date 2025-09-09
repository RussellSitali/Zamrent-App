import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Tabs group */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Screens group */}
      <Stack.Screen name="screens" options={{ headerShown: false }} />
    </Stack>
  );
}
