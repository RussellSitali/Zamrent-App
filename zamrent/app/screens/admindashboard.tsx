
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>ZamRent Admin</Text>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/HomeScreen")}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Dashboard Cards */}
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardNumber}>0</Text>
          <Text style={styles.cardLabel}>Total Users</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardNumber}>0</Text>
          <Text style={styles.cardLabel}>Total Listings</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardNumber}>0</Text>
          <Text style={styles.cardLabel}>Active Listings</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardNumber}>0</Text>
          <Text style={styles.cardLabel}>Expired Listings</Text>
        </View>
      </View>

      {/* Coming Soon */}
      <Text style={styles.comingSoon}>More admin features coming soon 🚧</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2f95dc",
  },
  logout: {
    fontSize: 16,
    color: "red",
    fontWeight: "600",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: "center",
  },
  cardNumber: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2f95dc",
  },
  cardLabel: {
    fontSize: 14,
    marginTop: 6,
    color: "#555",
  },
  comingSoon: {
    marginTop: 30,
    textAlign: "center",
    color: "#999",
  },
});
