import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function EditProfile() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Main content */}
      <View style={styles.content}>
        <Text style={styles.text}>Edit Profile Coming Soon...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backButton: {
    marginTop: 50,        
    marginLeft: 20,
  },
  backText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 25, fontWeight: "600", color: "blue" },
});
