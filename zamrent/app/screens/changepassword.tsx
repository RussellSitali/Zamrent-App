
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function ChangePasswordScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Coming Soon Message */}
      <Text style={styles.text}>🔒 Change Password - Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 40, // space for back button
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
  },
  backText: {
    fontSize: 16,
    color: "#2f95dc",
    fontWeight: "600",
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2f95dc",
  },
});
