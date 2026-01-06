import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = process.env.EXPO_PUBLIC_API_URL;

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {          
      const fetchDashboardStats = async () => {
        setLoading(true);
        try {
         const token = await AsyncStorage.getItem("adminToken"); 
         const id = await AsyncStorage.getItem("adminId");

          console.log("Logging id ", id);

          const res = await fetch(`${baseURL}/admindashboard/stats`, {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          });

          const data = await res.json();
          setStats(data);

        } catch (err) {
          console.log("Admin dashboard fetch error:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchDashboardStats();
    }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>ZamRent Control Panel</Text>
      </View>

      {/* ================= STATS ================= */}
      <View style={styles.statsGrid}>
        <StatCard label="Total Users" value={stats?.totalUsers} />
        <StatCard label="Total Listings" value={stats?.totalListings} />
        <StatCard label="Verified Users" value={stats?.verifiedUsers} />
        <StatCard
          label="Pending Verifications"
          value={stats?.pendingVerifications}
          highlight
        />
      </View>

      {/* ================= QUICK ACTIONS ================= */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionsGrid}>
          <ActionButton
            label="Manage Listings"
            onPress={() => router.push("/admin/listings")}
          />
          <ActionButton
            label="Manage Users"
            onPress={() => router.push("/screens/manageusers")}
          />
          <ActionButton
            label="Verifications"
            onPress={() => router.push("/admin/verifications")}
            warning
          />
        </View>
      </View>

      {/* ================= RECENT ACTIVITY ================= */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>

        {/* Placeholder rows */}
        <ActivityItem text="—" />
        <ActivityItem text="—" />
        <ActivityItem text="—" />
      </View>
    </ScrollView>
  );
}

const StatCard = ({ label, value, highlight }) => (
  <View style={[styles.statCard, highlight && styles.highlightCard]}>
    <Text style={styles.statValue}>
      {value !== undefined && value !== null ? value : "—"}
    </Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ActionButton = ({ label, onPress, warning }) => (
  <TouchableOpacity
    style={[styles.actionBtn, warning && styles.warningBtn]}
    onPress={onPress}
  >
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

const ActivityItem = ({ text }) => (
  <View style={styles.activityItem}>
    <Text style={styles.activityText}>{text}</Text>
  </View>
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#2f95dc",
  },
  subtitle: {
    color: "#777",
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
  },
  highlightCard: {
    backgroundColor: "#fff3cd",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
  },
  statLabel: {
    color: "#555",
    marginTop: 4,
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionBtn: {
    backgroundColor: "#2f95dc",
    padding: 14,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  warningBtn: {
    backgroundColor: "#f0ad4e",
  },
  actionText: {
    color: "#fff",
    fontWeight: "700",
  },
  activityItem: {
    backgroundColor: "#f7f7f7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  activityText: {
    color: "#444",
  },
});
