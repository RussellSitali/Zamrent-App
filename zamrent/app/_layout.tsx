import { Stack, Slot } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Slot renders nested screens */}
      <Slot />
    </Stack>
  );
}
