
import { View, Button } from "react-native";
import { router } from "expo-router";

export default function TestingScreen() {
  const testToken = "my-test-token-123"; 
  const email = "infinitethinker2008@gmail.com"
  // fake token you’d normally get from email

  return (
    <View style={{ padding: 20 }}>
      <Button
        title="Go to ResetPasswordScreen with token"
        onPress={() =>
          router.push(`../screens/passwordscreen?token=${testToken}&email=${email}`)
        }
      />
    </View>
  );
}
